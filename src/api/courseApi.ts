import { apiRequest } from './client'
import type { AdminCourse, Course, CourseContent, CourseFormRequest } from '../types/course'

export function getCourseCatalog(token: string) {
  return apiRequest<Course[]>('/api/courses/catalog', token)
}

export function getCourseContent(courseId: string, token: string) {
  return apiRequest<CourseContent>(`/api/courses/${courseId}/content`, token)
}

export function getAdminCourses(token: string) {
  return apiRequest<AdminCourse[]>('/api/admin/courses', token)
}

export function getCourse(courseId: string, token: string) {
  return apiRequest<AdminCourse>(`/api/courses/${courseId}`, token)
}

export function createCourse(request: CourseFormRequest, token: string) {
  return apiRequest<AdminCourse>('/api/admin/courses', token, {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

export function updateCourse(courseId: string, request: CourseFormRequest, token: string) {
  return apiRequest<AdminCourse>(`/api/admin/courses/${courseId}`, token, {
    method: 'PUT',
    body: JSON.stringify(request),
  })
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
