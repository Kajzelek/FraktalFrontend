import type { Course } from '../types/course'

type DashboardCourseRowProps = {
  course: Course
  description?: string
  actionLabel?: string
  actionDisabled?: boolean
  loading?: boolean
  onOpenCourse: (courseId: string) => void
  onAction?: (course: Course) => void
}

export function DashboardCourseRow({
  course,
  description,
  actionLabel,
  actionDisabled = false,
  loading = false,
  onOpenCourse,
  onAction,
}: DashboardCourseRowProps) {
  return (
    <article className="dashboard-course-row">
      <div>
        <h3>{course.title}</h3>
        <p>{course.category}</p>
        {description && (
          <>
            <div className="progress-row">
              <span>Postep</span>
              <strong>{Math.round(course.progressPercent)}%</strong>
            </div>
            <div className="progress-track">
              <div style={{ width: `${course.progressPercent}%` }} />
            </div>
            <p className="muted">{description}</p>
          </>
        )}
      </div>
      <div className="admin-row-actions">
        <button type="button" className="secondary-button" onClick={() => onOpenCourse(course.id)}>
          Szczegoly
        </button>
        {onAction && actionLabel && (
          <button type="button" disabled={loading || actionDisabled} onClick={() => onAction(course)}>
            {actionLabel}
          </button>
        )}
      </div>
    </article>
  )
}
