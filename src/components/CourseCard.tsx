import type { Course } from '../types/course'

type CourseCardProps = {
  course: Course
  onOpen: (courseId: string) => void
}

export function CourseCard({ course, onOpen }: CourseCardProps) {
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

        <button type="button" disabled={!course.canStart} onClick={() => onOpen(course.id)}>
          {course.hasAccess ? 'Kontynuuj' : course.canStart ? 'Podglad' : 'Kup kurs'}
        </button>
      </div>
    </article>
  )
}
