
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Users, User, LogOut, Home } from 'lucide-react'
import { supabase } from '../lib/supabase'

type NavbarProps = {
  user: any
  userRole: string | null
}

const Navbar = ({ user, userRole }: NavbarProps) => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white text-xl font-bold">School Management</span>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Dashboard
                </Link>
                {(userRole === 'Admin' || userRole === 'Teacher') && (
                  <Link
                    to="/classes"
                    className="flex items-center gap-2 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    Classes
                  </Link>
                )}
                <Link
                  to="/students"
                  className="flex items-center gap-2 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <Users className="w-4 h-4" />
                  Students
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white text-sm">{user.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
