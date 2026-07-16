import { apiRequest } from './client'
import type { Chapter, ChapterFormRequest } from '../types/chapter'

export function getCourseChapters(courseId: string, token: string) {
  return apiRequest<Chapter[]>(`/api/courses/${courseId}/chapters`, token)
}

export function createChapter(courseId: string, request: ChapterFormRequest, token: string) {
  return apiRequest<Chapter>(`/api/admin/courses/${courseId}/chapters`, token, {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

export function updateChapter(chapterId: string, request: ChapterFormRequest, token: string) {
  return apiRequest<Chapter>(`/api/admin/chapters/${chapterId}`, token, {
    method: 'PUT',
    body: JSON.stringify(request),
  })
}

export function deleteChapter(chapterId: string, token: string) {
  return apiRequest<void>(`/api/admin/chapters/${chapterId}`, token, {
    method: 'DELETE',
  })
}
