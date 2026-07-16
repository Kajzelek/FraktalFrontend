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

export type AdminCourse = {
  id: string
  title: string
  description: string
  category: string
  thumbnailUrl: string
  price: number
  published: boolean
  createdAt: string
}

export type CourseFormRequest = {
  title: string
  description: string
  category: string
  thumbnailUrl: string
  price: number
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

export type CourseStart = {
  courseId: string
  chapterId: string
  chapterTitle: string
  lessonId: string
  lessonTitle: string
  mode: string
}

export type ContinueLesson = {
  courseId: string
  chapterId: string
  chapterTitle: string
  lessonId: string
  lessonTitle: string
  lessonPosition: number
  free: boolean
  locked: boolean
  courseCompleted: boolean
}
