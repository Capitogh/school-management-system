
-- Drop existing objects if they exist
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop table if exists public.class_students;
drop table if exists public.students;
drop table if exists public.classes;
drop table if exists public.users;
drop table if exists public.roles;

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create roles table
create table public.roles (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null
);

-- Create users table
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null references public.roles(name),
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create classes table
create table public.classes (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  teacher_id uuid references public.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create students table
create table public.students (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  parent_id uuid references public.users(id) on delete set null,
  user_id uuid references public.users(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create class_students join table
create table public.class_students (
  class_id uuid references public.classes(id) on delete cascade,
  student_id uuid references public.students(id) on delete cascade,
  primary key (class_id, student_id)
);

-- Enable Row Level Security on all tables
alter table public.users enable row level security;
alter table public.classes enable row level security;
alter table public.students enable row level security;
alter table public.class_students enable row level security;

-- Insert initial roles
insert into public.roles (name) values 
('Admin'), 
('Teacher'), 
('Student'), 
('Parent');

-- Create RLS Policies

-- Users table policies
create policy "Users can view their own profile"
  on public.users
  for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users
  for update
  using (auth.uid() = id);

create policy "Admins can view all users"
  on public.users
  for select
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'Admin'
    )
  );

-- Classes table policies
create policy "Teachers and admins can view classes"
  on public.classes
  for select
  using (
    (teacher_id = auth.uid()) or
    (exists (
      select 1 from public.users
      where id = auth.uid() and role = 'Admin'
    ))
  );

create policy "Admins and teachers can insert classes"
  on public.classes
  for insert
  with check (
    (teacher_id = auth.uid()) or
    (exists (
      select 1 from public.users
      where id = auth.uid() and role = 'Admin'
    ))
  );

create policy "Admins and teachers can update their own classes"
  on public.classes
  for update
  using (
    (teacher_id = auth.uid()) or
    (exists (
      select 1 from public.users
      where id = auth.uid() and role = 'Admin'
    ))
  );

create policy "Admins and teachers can delete their own classes"
  on public.classes
  for delete
  using (
    (teacher_id = auth.uid()) or
    (exists (
      select 1 from public.users
      where id = auth.uid() and role = 'Admin'
    ))
  );

-- Students table policies
create policy "Parents and admins can view students"
  on public.students
  for select
  using (
    (parent_id = auth.uid()) or
    (exists (
      select 1 from public.users
      where id = auth.uid() and role = 'Admin'
    ))
  );

-- Create a trigger to automatically create a user profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', new.email), coalesce(new.raw_user_meta_data->>'role', 'Student'));
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
