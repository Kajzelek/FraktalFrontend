import { apiRequest } from './client'
import type { AuthResponse, LoginForm } from '../types/auth'
import type { UserProfile } from '../types/user'

export function login(form: LoginForm) {
  return apiRequest<AuthResponse>('/api/auth/login', '', {
    method: 'POST',
    body: JSON.stringify(form),
  })
}

export function getMe(token: string) {
  return apiRequest<UserProfile>('/api/me', token)
}
