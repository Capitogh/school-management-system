
import { BookOpen, Users, GraduationCap, User } from 'lucide-react'

type DashboardProps = {
  userRole: string | null
}

const Dashboard = ({ userRole }: DashboardProps) => {
  const getDashboardContent = () => {
    switch (userRole) {
      case 'Admin':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
                <Users className="w-8 h-8 mb-2" />
                <h3 className="text-2xl font-bold">Users</h3>
                <p className="text-blue-100">Manage all users</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
                <BookOpen className="w-8 h-8 mb-2" />
                <h3 className="text-2xl font-bold">Classes</h3>
                <p className="text-green-100">Manage all classes</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
                <GraduationCap className="w-8 h-8 mb-2" />
                <h3 className="text-2xl font-bold">Students</h3>
                <p className="text-purple-100">Manage all students</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg text-white">
                <User className="w-8 h-8 mb-2" />
                <h3 className="text-2xl font-bold">Teachers</h3>
                <p className="text-orange-100">Manage teachers</p>
              </div>
            </div>
          </div>
        )
      case 'Teacher':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
                <BookOpen className="w-8 h-8 mb-2" />
                <h3 className="text-2xl font-bold">My Classes</h3>
                <p className="text-blue-100">View and manage your classes</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
                <GraduationCap className="w-8 h-8 mb-2" />
                <h3 className="text-2xl font-bold">My Students</h3>
                <p className="text-purple-100">View your students</p>
              </div>
            </div>
          </div>
        )
      case 'Student':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
                <BookOpen className="w-8 h-8 mb-2" />
                <h3 className="text-2xl font-bold">My Classes</h3>
                <p className="text-green-100">View your enrolled classes</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
                <User className="w-8 h-8 mb-2" />
                <h3 className="text-2xl font-bold">Profile</h3>
                <p className="text-blue-100">View your profile</p>
              </div>
            </div>
          </div>
        )
      case 'Parent':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
                <GraduationCap className="w-8 h-8 mb-2" />
                <h3 className="text-2xl font-bold">My Children</h3>
                <p className="text-purple-100">View your children's information</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg text-white">
                <BookOpen className="w-8 h-8 mb-2" />
                <h3 className="text-2xl font-bold">Classes</h3>
                <p className="text-orange-100">View children's classes</p>
              </div>
            </div>
          </div>
        )
      default:
        return <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {getDashboardContent()}
    </div>
  )
}

export default Dashboard
