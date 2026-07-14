import { Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { AppHeader } from './AppHeader'

export function AppLayout() {
  const { user, logout, error } = useAuth()

  return (
    <main className="app-shell">
      <AppHeader user={user} onLogout={logout} />
      {error && <div className="alert">{error}</div>}
      <Outlet />
    </main>
  )
}
