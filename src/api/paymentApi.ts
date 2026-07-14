import { apiRequest } from './client'
import type { OrderResponse, PaymentInitResponse } from '../types/payment'

export function checkoutCourse(courseId: string, token: string) {
  return apiRequest<PaymentInitResponse>(`/api/courses/${courseId}/checkout`, token, {
    method: 'POST',
  })
}

export function confirmMockPayment(orderId: string, token: string) {
  return apiRequest<OrderResponse>(`/api/payments/mock/${orderId}/success`, token, {
    method: 'POST',
  })
}

export function cancelMockPayment(orderId: string, token: string) {
  return apiRequest<OrderResponse>(`/api/payments/mock/${orderId}/cancel`, token, {
    method: 'POST',
  })
}

export function failMockPayment(orderId: string, token: string) {
  return apiRequest<OrderResponse>(`/api/payments/mock/${orderId}/fail`, token, {
    method: 'POST',
  })
}
