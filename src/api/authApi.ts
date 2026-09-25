import { apiRequest } from './client'
import type { AuthResponse, LoginForm, RegisterForm } from '../types/auth'
import type { UserProfile } from '../types/user'


export function register(form: RegisterForm){
  const { username, email, password } = form

  return apiRequest<AuthResponse>('/api/auth/register', '', {
    method: 'POST',
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  })
}

export function login(form: LoginForm) {
  return apiRequest<AuthResponse>('/api/auth/login', '', {
    method: 'POST',
    body: JSON.stringify(form),
  })
}

export function getMe(token: string) {
  return apiRequest<UserProfile>('/api/me', token)
}
