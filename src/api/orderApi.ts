import { apiRequest } from './client'
import type { Order } from '../types/order'

export function getMyOrders(token: string) {
  return apiRequest<Order[]>('/api/me/orders', token)
}

export function getAdminOrders(token: string) {
  return apiRequest<Order[]>('/api/admin/orders', token)
}

export function markOrderAsPaid(orderId: string, token: string) {
  return apiRequest<Order>(`/api/admin/orders/${orderId}/mark-paid`, token, {
    method: 'PATCH',
  })
}

export function cancelOrder(orderId: string, token: string) {
  return apiRequest<Order>(`/api/admin/orders/${orderId}/cancel`, token, {
    method: 'PATCH',
  })
}

export function failOrder(orderId: string, token: string) {
  return apiRequest<Order>(`/api/admin/orders/${orderId}/fail`, token, {
    method: 'PATCH',
  })
}
