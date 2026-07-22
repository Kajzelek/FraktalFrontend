import type { AdminCourse } from './course'

export type Enrollment = {
  id: string
  userId: string
  course: AdminCourse
  enrollmentDate: string
}
