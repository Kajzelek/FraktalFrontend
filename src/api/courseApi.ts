import { apiRequest } from './client'
import type { Course, CourseContent } from '../types/course'

export function getCourseCatalog(token: string) {
  return apiRequest<Course[]>('/api/courses/catalog', token)
}

export function getCourseContent(courseId: string, token: string) {
  return apiRequest<CourseContent>(`/api/courses/${courseId}/content`, token)
}
