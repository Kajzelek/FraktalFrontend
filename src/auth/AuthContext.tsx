import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { getMe, login as loginRequest } from '../api/authApi'
import type { LoginForm } from '../types/auth'
import type { UserProfile } from '../types/user'

const TOKEN_STORAGE_KEY = 'fraktal.authToken'

type AuthContextValue = {
  token: string
  user: UserProfile | null
  loading: boolean
  error: string
  isAuthenticated: boolean
  login: (form: LoginForm) => Promise<void>
  logout: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY) ?? '')
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setUser(null)
      return
    }

    void loadCurrentUser(token)
  }, [token])

  async function loadCurrentUser(authToken: string) {
    setLoading(true)
    setError('')

    try {
      const profile = await getMe(authToken)
      setUser(profile)
    } catch (err) {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      setToken('')
      setUser(null)
      setError(err instanceof Error ? err.message : 'Sesja wygasla. Zaloguj sie ponownie.')
    } finally {
      setLoading(false)
    }
  }

  async function login(form: LoginForm) {
    setLoading(true)
    setError('')

    try {
      const auth = await loginRequest(form)
      localStorage.setItem(TOKEN_STORAGE_KEY, auth.token)
      setToken(auth.token)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie zalogowac.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    setToken('')
    setUser(null)
  }

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      error,
      isAuthenticated: Boolean(token),
      login,
      logout,
      clearError: () => setError(''),
    }),
    [token, user, loading, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
