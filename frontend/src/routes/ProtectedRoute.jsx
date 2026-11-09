
import { Navigate, Outlet } from 'react-router-dom'

function ProtectedRoute({ role }) {
  const token = sessionStorage.getItem('token')

  let user = null

  try {
    user = JSON.parse(sessionStorage.getItem('user'))
  } catch {
    user = null
  }

  // Check login
  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  // Check user role
  if (role && user.role !== role) {
    const dashboard = `/${user.role.toLowerCase()}/dashboard`
    return <Navigate to={dashboard} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
