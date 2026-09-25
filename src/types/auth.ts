export type AuthResponse = {
  token: string
}

export type LoginForm = {
  email: string
  password: string
}

export type RegisterForm = {
  username: string
  email: string
  password: string
  confirmPassword: string
}
