import { apiRequest } from './client'
import type { Order } from '../types/order'

export function getMyOrders(token: string) {
  return apiRequest<Order[]>('/api/me/orders', token)
}
