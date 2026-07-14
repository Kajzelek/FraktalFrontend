import { apiRequest } from './client'
import type { AdminCourse, Course, CourseContent } from '../types/course'

export function getCourseCatalog(token: string) {
  return apiRequest<Course[]>('/api/courses/catalog', token)
}

export function getCourseContent(courseId: string, token: string) {
  return apiRequest<CourseContent>(`/api/courses/${courseId}/content`, token)
}

export function getAdminCourses(token: string) {
  return apiRequest<AdminCourse[]>('/api/admin/courses', token)
}

export function publishCourse(courseId: string, token: string) {
  return apiRequest<AdminCourse>(`/api/admin/courses/${courseId}/publish`, token, {
    method: 'PATCH',
  })
}

export function unpublishCourse(courseId: string, token: string) {
  return apiRequest<AdminCourse>(`/api/admin/courses/${courseId}/unpublish`, token, {
    method: 'PATCH',
  })
}
