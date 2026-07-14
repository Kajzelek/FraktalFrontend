import { CourseCard } from './CourseCard'
import type { Course } from '../types/course'

type CourseListProps = {
  courses: Course[]
  loading: boolean
  onOpenCourse: (courseId: string) => void
  onBuyCourse: (courseId: string) => void
}

export function CourseList({ courses, loading, onOpenCourse, onBuyCourse }: CourseListProps) {
  return (
    <section className="content-grid">
      <div className="section-heading">
        <p className="eyebrow">Kursy</p>
        <h2>Twoje kursy</h2>
      </div>

      {loading ? (
        <p className="muted">Ladowanie kursow...</p>
      ) : courses.length === 0 ? (
        <p className="muted">Nie znaleziono kursow.</p>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <CourseCard course={course} key={course.id} onBuy={onBuyCourse} onOpen={onOpenCourse} />
          ))}
        </div>
      )}
    </section>
  )
}
