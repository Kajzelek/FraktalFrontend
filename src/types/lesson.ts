export type MaterialType = 'VIDEO' | 'PDF' | 'LINK' | 'ATTACHMENT'
export type MaterialProvider = 'EXTERNAL_URL' | 'CLOUDFLARE_STREAM'
export type MaterialStatus = 'READY' | 'PROCESSING' | 'FAILED'

export type LessonMaterial = {
  id: string
  lessonId: string
  title: string
  type: MaterialType
  url: string | null
  provider: MaterialProvider
  providerAssetId: string | null
  durationSeconds: number | null
  thumbnailUrl: string | null
  status: MaterialStatus
  position: number
}

export type LessonPlayer = {
  lessonId: string
  title: string
  description: string
  videoUrl: string | null
  pdfUrl: string | null
  durationMinutes: number | null
  free: boolean
  chapterId: string
  courseId: string
  previousLessonId: string | null
  nextLessonId: string | null
  completed: boolean
  completedAt: string | null
  primaryVideo: LessonMaterial | null
  primaryPdf: LessonMaterial | null
  materials: LessonMaterial[]
}

export type LessonProgress = {
  lessonId: string
  completed: boolean
  completedAt: string | null
}
