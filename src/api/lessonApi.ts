import { apiRequest } from './client'
import type {
  AdminLesson,
  LessonFormRequest,
  LessonMaterial,
  LessonMaterialFormRequest,
  LessonPlayer,
  LessonProgress,
} from '../types/lesson'

export function getLessonPlayer(lessonId: string, token: string) {
  return apiRequest<LessonPlayer>(`/api/lessons/${lessonId}/play`, token)
}

export function completeLesson(lessonId: string, token: string) {
  return apiRequest<LessonProgress>(`/api/lessons/${lessonId}/complete`, token, {
    method: 'POST',
  })
}

export function getChapterLessons(chapterId: string, token: string) {
  return apiRequest<AdminLesson[]>(`/api/chapters/${chapterId}/lessons`, token)
}

export function createLesson(chapterId: string, request: LessonFormRequest, token: string) {
  return apiRequest<AdminLesson>(`/api/admin/chapters/${chapterId}/lessons`, token, {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

export function updateLesson(lessonId: string, request: LessonFormRequest, token: string) {
  return apiRequest<AdminLesson>(`/api/admin/lessons/${lessonId}`, token, {
    method: 'PUT',
    body: JSON.stringify(request),
  })
}

export function deleteLesson(lessonId: string, token: string) {
  return apiRequest<void>(`/api/admin/lessons/${lessonId}`, token, {
    method: 'DELETE',
  })
}

export function getLessonMaterials(lessonId: string, token: string) {
  return apiRequest<LessonMaterial[]>(`/api/lessons/${lessonId}/materials`, token)
}

export function createLessonMaterial(lessonId: string, request: LessonMaterialFormRequest, token: string) {
  return apiRequest<LessonMaterial>(`/api/admin/lessons/${lessonId}/materials`, token, {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

export function updateLessonMaterial(materialId: string, request: LessonMaterialFormRequest, token: string) {
  return apiRequest<LessonMaterial>(`/api/admin/lesson-materials/${materialId}`, token, {
    method: 'PUT',
    body: JSON.stringify(request),
  })
}

export function deleteLessonMaterial(materialId: string, token: string) {
  return apiRequest<void>(`/api/admin/lesson-materials/${materialId}`, token, {
    method: 'DELETE',
  })
}
