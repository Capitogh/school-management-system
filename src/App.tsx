
import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Classes from './pages/Classes'
import Students from './pages/Students'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'

type UserRole = 'Admin' | 'Teacher' | 'Student' | 'Parent'

function App() {
  const [user, setUser] = useState<any>(null)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user)
        await fetchUserRole(session.user.id)
      } else {
        setUser(null)
        setUserRole(null)
      }
      setLoading(false)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      setUser(session.user)
      await fetchUserRole(session.user.id)
    }
    setLoading(false)
  }

  const fetchUserRole = async (userId: string) => {
    const { data } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (data) {
      setUserRole(data.role as UserRole)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-2xl font-semibold text-blue-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar user={user} userRole={userRole} />}
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login setUser={setUser} setUserRole={setUserRole} /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard userRole={userRole} /> : <Navigate to="/login" />}
        />
        <Route
          path="/classes"
          element={user ? <Classes userRole={userRole} userId={user?.id} /> : <Navigate to="/login" />}
        />
        <Route
          path="/students"
          element={user ? <Students userRole={userRole} userId={user?.id} /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={user ? <Profile user={user} userRole={userRole} /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </div>
  )
}

export default App
