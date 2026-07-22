export type Role = 'ROLE_STUDENT' | 'ROLE_ADMIN'

export type UserProfile = {
  id: string
  firstName: string
  lastName: string
  nickname: string
  username: string
  email: string
  role: Role
}

export type AdminUser = UserProfile & {
  createdAt: string
}
