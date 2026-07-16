import type { Course } from '../types/course'

type DashboardFocusCourseProps = {
  course: Course
  description: string
  loading: boolean
  onContinue: (course: Course) => void
}

export function DashboardFocusCourse({ course, description, loading, onContinue }: DashboardFocusCourseProps) {
  return (
    <section className="dashboard-focus">
      <div>
        <p className="eyebrow">Kontynuuj</p>
        <h3>{course.title}</h3>
        <p className="muted">{description}</p>
      </div>
      <button type="button" disabled={loading} onClick={() => onContinue(course)}>
        Kontynuuj nauke
      </button>
    </section>
  )
}
