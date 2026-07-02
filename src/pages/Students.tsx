
import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit } from 'lucide-react'
import { supabase } from '../lib/supabase'

type StudentsProps = {
  userRole: string | null
  userId: string
}

type Student = {
  id: string
  name: string
  parent_id: string | null
}

const Students = ({ userRole, userId }: StudentsProps) => {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [studentName, setStudentName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchStudents()
  }, [userRole, userId])

  const fetchStudents = async () => {
    try {
      let query = supabase.from('students').select('*')

      if (userRole === 'Parent') {
        query = query.eq('parent_id', userId)
      }

      const { data, error } = await query
      if (error) throw error
      setStudents(data || [])
    } catch (err) {
      console.error('Error fetching students:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await supabase
          .from('students')
          .update({ name: studentName })
          .eq('id', editingId)
      } else {
        await supabase
          .from('students')
          .insert({ 
            name: studentName, 
            parent_id: userRole === 'Parent' ? userId : null 
          })
      }
      fetchStudents()
      setShowModal(false)
      setStudentName('')
      setEditingId(null)
    } catch (err) {
      console.error('Error saving student:', err)
    }
  }

  const handleEdit = (student: Student) => {
    setStudentName(student.name)
    setEditingId(student.id)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await supabase.from('students').delete().eq('id', id)
        fetchStudents()
      } catch (err) {
        console.error('Error deleting student:', err)
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
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
        {(userRole === 'Admin' || userRole === 'Parent') && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Student
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              {(userRole === 'Admin' || userRole === 'Parent') && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{student.name}</div>
                </td>
                {(userRole === 'Admin' || (userRole === 'Parent' && student.parent_id === userId)) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingId ? 'Edit Student' : 'Add Student'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setStudentName('')
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

export default Students
