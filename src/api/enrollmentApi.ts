import { apiRequest } from './client'
import type { Enrollment } from '../types/enrollment'

export function grantCourseAccess(userId: string, courseId: string, token: string) {
  return apiRequest<Enrollment>(`/api/admin/users/${userId}/courses/${courseId}/grant-access`, token, {
    method: 'POST',
  })
}
