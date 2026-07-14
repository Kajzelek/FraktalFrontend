import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { LoginPanel } from '../components/LoginPanel'
import type { LoginForm } from '../types/auth'

type LocationState = {
  from?: {
    pathname: string
  }
}

export function LoginPage() {
  const { isAuthenticated, loading, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | null
  const [form, setForm] = useState<LoginForm>({
    email: 'student@fraktal.pl',
    password: 'Student123!',
  })

  if (isAuthenticated) {
    return <Navigate to="/courses" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await login(form)
    navigate(state?.from?.pathname ?? '/courses', { replace: true })
  }

  return <LoginPanel form={form} loading={loading} onFormChange={setForm} onSubmit={(event) => void handleSubmit(event)} />
}
