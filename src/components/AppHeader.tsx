import type { UserProfile } from '../types/user'

type AppHeaderProps = {
  user: UserProfile | null
  onLogout: () => void
}

export function AppHeader({ user, onLogout }: AppHeaderProps) {
  return (
    <section className="topbar">
      <div>
        <p className="eyebrow">Fraktal</p>
        <h1>Platforma kursowa</h1>
      </div>

      {user && (
        <div className="user-box">
          <span>
            {user.firstName} {user.lastName}
          </span>
          <small>{user.role === 'ROLE_ADMIN' ? 'Admin' : 'Student'}</small>
          <button type="button" onClick={onLogout}>
            Wyloguj
          </button>
        </div>
      )}
    </section>
  )
}
