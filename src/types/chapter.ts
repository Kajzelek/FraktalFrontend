export type Chapter = {
  id: string
  title: string
  position: number
  courseId: string
}

export type ChapterFormRequest = {
  title: string
  position: number
}
