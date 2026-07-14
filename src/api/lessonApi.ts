import { apiRequest } from './client'
import type { LessonPlayer, LessonProgress } from '../types/lesson'

export function getLessonPlayer(lessonId: string, token: string) {
  return apiRequest<LessonPlayer>(`/api/lessons/${lessonId}/play`, token)
}

export function completeLesson(lessonId: string, token: string) {
  return apiRequest<LessonProgress>(`/api/lessons/${lessonId}/complete`, token, {
    method: 'POST',
  })
}
