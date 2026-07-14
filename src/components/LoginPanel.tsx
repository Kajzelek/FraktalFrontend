import type { FormEvent } from 'react'
import type { LoginForm } from '../types/auth'

type LoginPanelProps = {
  form: LoginForm
  loading: boolean
  onFormChange: (form: LoginForm) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function LoginPanel({ form, loading, onFormChange, onSubmit }: LoginPanelProps) {
  return (
    <section className="login-panel">
      <div>
        <p className="eyebrow">Logowanie</p>
        <h2>Wejdz do kursow</h2>
      </div>

      <form onSubmit={onSubmit}>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => onFormChange({ ...form, email: event.target.value })}
            autoComplete="email"
            required
          />
        </label>

        <label>
          Haslo
          <input
            type="password"
            value={form.password}
            onChange={(event) => onFormChange({ ...form, password: event.target.value })}
            autoComplete="current-password"
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Logowanie...' : 'Zaloguj'}
        </button>
      </form>
    </section>
  )
}
