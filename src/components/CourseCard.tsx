import type { Course } from '../types/course'

type CourseCardProps = {
  course: Course
  onOpen: (courseId: string) => void
  onBuy: (courseId: string) => void
}

export function CourseCard({ course, onOpen, onBuy }: CourseCardProps) {
  const canOpen = course.hasAccess || course.freePreviewAvailable
  const canBuy = !course.hasAccess && course.price > 0

  return (
    <article className="course-card">
      <img src={course.thumbnailUrl} alt="" />
      <div className="course-body">
        <div className="course-meta">
          <span>{course.category}</span>
          <span>{course.price === 0 ? 'Darmowy' : `${course.price.toFixed(2)} zl`}</span>
        </div>

        <h3>{course.title}</h3>
        <p>{course.description}</p>

        <div className="progress-row">
          <span>
            Postep ({course.completedLessons}/{course.lessonsCount})
          </span>
          <strong>{Math.round(course.progressPercent)}%</strong>
        </div>
        <div className="progress-track">
          <div style={{ width: `${Math.min(course.progressPercent, 100)}%` }} />
        </div>

        <div className="course-actions">
          {canOpen && (
            <button type="button" onClick={() => onOpen(course.id)}>
              {course.hasAccess ? 'Kontynuuj' : 'Podglad'}
            </button>
          )}

          {canBuy && (
            <button type="button" className={canOpen ? 'secondary-button' : undefined} onClick={() => onBuy(course.id)}>
              Kup kurs
            </button>
          )}

          {!canOpen && !canBuy && (
            <button type="button" disabled>
              Brak dostepu
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
