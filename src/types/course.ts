export type Course = {
  id: string
  title: string
  description: string
  category: string
  thumbnailUrl: string
  price: number
  hasAccess: boolean
  lessonsCount: number
  completedLessons: number
  progressPercent: number
  freePreviewAvailable: boolean
  canStart: boolean
}

export type LessonContent = {
  id: string
  title: string
  description: string
  position: number
  free: boolean
  locked: boolean
  completed: boolean
  durationMinutes: number | null
}

export type ChapterContent = {
  id: string
  title: string
  position: number
  lessons: LessonContent[]
}

export type CourseContent = {
  id: string
  title: string
  description: string
  category: string
  thumbnailUrl: string
  price: number
  published: boolean
  hasAccess: boolean
  chapters: ChapterContent[]
}
