import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function AdminRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return <p className="muted">Ladowanie uprawnien...</p>
  }

  if (user?.role !== 'ROLE_ADMIN') {
    return <Navigate to="/courses" replace />
  }

  return <Outlet />
}
