import type { CourseContent } from '../types/course'

type CourseDetailProps = {
  course: CourseContent
  loading: boolean
  completedLessonIds: Set<string>
  onBack: () => void
  onOpenLesson: (lessonId: string) => void
}

export function CourseDetail({ course, loading, completedLessonIds, onBack, onOpenLesson }: CourseDetailProps) {
  return (
    <section className="course-detail">
      <button type="button" className="secondary-button" onClick={onBack}>
        Wroc do kursow
      </button>

      <div className="course-detail-hero">
        <img src={course.thumbnailUrl} alt="" />
        <div>
          <p className="eyebrow">{course.category}</p>
          <h2>{course.title}</h2>
          <p>{course.description}</p>
          <div className="detail-stats">
            <span>{course.hasAccess ? 'Masz dostep' : 'Brak pelnego dostepu'}</span>
            <span>{course.price === 0 ? 'Darmowy' : `${course.price.toFixed(2)} zl`}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="muted">Ladowanie kursu...</p>
      ) : course.chapters.length === 0 ? (
        <p className="muted">Ten kurs nie ma jeszcze rozdzialow.</p>
      ) : (
        <div className="chapter-list">
          {course.chapters.map((chapter) => (
            <section className="chapter-section" key={chapter.id}>
              <div className="chapter-heading">
                <span>Rozdzial {chapter.position + 1}</span>
                <h3>{chapter.title}</h3>
              </div>

              <div className="lesson-list">
                {chapter.lessons.map((lesson) => (
                  <article className="lesson-row" key={lesson.id}>
                    <div>
                      <div className="lesson-title-line">
                        <h4>{lesson.title}</h4>
                        {(lesson.completed || completedLessonIds.has(lesson.id)) && (
                          <span className="status done">Ukonczona</span>
                        )}
                        {lesson.locked && <span className="status locked">Zablokowana</span>}
                        {lesson.free && !lesson.locked && <span className="status free">Darmowa</span>}
                      </div>
                      <p>{lesson.description}</p>
                    </div>

                    <div className="lesson-actions">
                      <span>{lesson.durationMinutes ?? '-'} min</span>
                      <button type="button" disabled={lesson.locked || loading} onClick={() => onOpenLesson(lesson.id)}>
                        Otworz lekcje
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  )
}
