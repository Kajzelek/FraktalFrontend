export type PaymentInitResponse = {
  orderId: string
  paymentUrl: string
}

export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'FAILED'

export type OrderResponse = {
  id: string
  userId: string
  courseId: string
  courseTitle: string
  amount: number
  status: OrderStatus
  createdAt: string
  paidAt: string | null
  accessGranted: boolean
}
