
import { useState, useEffect } from 'react'
import { User } from 'lucide-react'
import { supabase } from '../lib/supabase'

type ProfileProps = {
  user: any
  userRole: string | null
}

type Profile = {
  id: string
  name: string
  email: string
  role: string
}

const Profile = ({ user, userRole }: ProfileProps) => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setProfile(data)
      setName(data.name)
    } catch (err) {
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    try {
      await supabase
        .from('users')
        .update({ name })
        .eq('id', user.id)
      fetchProfile()
    } catch (err) {
      console.error('Error updating profile:', err)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
          <div className="flex items-center gap-6">
            <div className="bg-white bg-opacity-20 rounded-full p-4">
              <User className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{profile?.name}</h1>
              <p className="text-blue-100 mt-1">{userRole}</p>
            </div>
          </div>
        </div>
        <div className="p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={profile?.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <input
                type="text"
                value={profile?.role}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={updating}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
