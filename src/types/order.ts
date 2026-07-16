export type PaymentStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'FAILED'

export type Order = {
  id: string
  userId: string
  courseId: string
  courseTitle: string
  amount: number
  status: PaymentStatus
  createdAt: string
  paidAt: string | null
  accessGranted: boolean
}
