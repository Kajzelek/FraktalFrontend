import { apiRequest } from './client'
import type { AdminUser } from '../types/user'

export function getAdminUsers(token: string) {
  return apiRequest<AdminUser[]>('/api/admin/users', token)
}

export function getAdminUser(userId: string, token: string) {
  return apiRequest<AdminUser>(`/api/admin/users/${userId}`, token)
}
