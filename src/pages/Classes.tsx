
import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'

type ClassesProps = {
  userRole: string | null
  userId: string
}

type Class = {
  id: string
  name: string
  teacher_id: string
  teacher?: { name: string }
}

const Classes = ({ userRole, userId }: ClassesProps) => {
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [className, setClassName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchClasses()
  }, [userRole, userId])

  const fetchClasses = async () => {
    try {
      let query = supabase.from('classes').select(`
        *,
        teacher:users!classes_teacher_id_fkey(name)
      `)

      if (userRole === 'Teacher') {
        query = query.eq('teacher_id', userId)
      }

      const { data, error } = await query
      if (error) throw error
      setClasses(data || [])
    } catch (err) {
      console.error('Error fetching classes:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await supabase
          .from('classes')
          .update({ name: className })
          .eq('id', editingId)
      } else {
        await supabase
          .from('classes')
          .insert({ name: className, teacher_id: userRole === 'Teacher' ? userId : null })
      }
      fetchClasses()
      setShowModal(false)
      setClassName('')
      setEditingId(null)
    } catch (err) {
      console.error('Error saving class:', err)
    }
  }

  const handleEdit = (cls: Class) => {
    setClassName(cls.name)
    setEditingId(cls.id)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await supabase.from('classes').delete().eq('id', id)
        fetchClasses()
      } catch (err) {
        console.error('Error deleting class:', err)
      }
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
        {(userRole === 'Admin' || userRole === 'Teacher') && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Class
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{cls.name}</h3>
                {cls.teacher && (
                  <p className="text-gray-500 text-sm mt-1">Teacher: {cls.teacher.name}</p>
                )}
              </div>
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            {(userRole === 'Admin' || (userRole === 'Teacher' && cls.teacher_id === userId)) && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(cls)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cls.id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingId ? 'Edit Class' : 'Add Class'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Name
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setClassName('')
                    setEditingId(null)
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Classes
