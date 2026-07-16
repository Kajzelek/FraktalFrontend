import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCourseCatalog, getCourseStart } from '../api/courseApi'
import { useAuth } from '../auth/AuthContext'
import type { Course } from '../types/course'

export function DashboardPage() {
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    void loadCourses()
  }, [token])

  const enrolledCourses = useMemo(() => courses.filter((course) => course.hasAccess), [courses])
  const availableCourses = useMemo(() => courses.filter((course) => !course.hasAccess), [courses])
  const activeCourse = useMemo(
    () =>
      [...enrolledCourses]
        .filter((course) => course.lessonsCount > 0)
        .sort((a, b) => b.progressPercent - a.progressPercent)[0] ?? null,
    [enrolledCourses],
  )
  const completedLessons = enrolledCourses.reduce((sum, course) => sum + course.completedLessons, 0)
  const allLessons = enrolledCourses.reduce((sum, course) => sum + course.lessonsCount, 0)
  const averageProgress = allLessons === 0 ? 0 : Math.round((completedLessons / allLessons) * 100)

  async function loadCourses() {
    setLoading(true)
    setError('')

    try {
      setCourses(await getCourseCatalog(token))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie pobrac dashboardu.')
    } finally {
      setLoading(false)
    }
  }

  async function startCourse(courseId: string) {
    setLoading(true)
    setError('')

    try {
      const start = await getCourseStart(courseId, token)
      navigate(`/lessons/${start.lessonId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie otworzyc lekcji.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="dashboard-page">
      <div className="section-heading">
        <p className="eyebrow">Panel ucznia</p>
        <h2>Czesc{user?.firstName ? `, ${user.firstName}` : ''}</h2>
      </div>

      {error && <div className="alert">{error}</div>}

      <section className="dashboard-stats">
        <article>
          <span>Moje kursy</span>
          <strong>{enrolledCourses.length}</strong>
        </article>
        <article>
          <span>Ukonczone lekcje</span>
          <strong>
            {completedLessons}/{allLessons}
          </strong>
        </article>
        <article>
          <span>Sredni postep</span>
          <strong>{averageProgress}%</strong>
        </article>
      </section>

      {activeCourse && (
        <section className="dashboard-focus">
          <div>
            <p className="eyebrow">Kontynuuj</p>
            <h3>{activeCourse.title}</h3>
            <p className="muted">
              {activeCourse.completedLessons}/{activeCourse.lessonsCount} lekcji ukonczonych
            </p>
          </div>
          <button type="button" disabled={loading} onClick={() => void startCourse(activeCourse.id)}>
            Kontynuuj nauke
          </button>
        </section>
      )}

      <section className="content-grid">
        <div className="section-heading">
          <p className="eyebrow">Kursy</p>
          <h2>Moje kursy</h2>
        </div>

        {loading && courses.length === 0 ? (
          <p className="muted">Ladowanie kursow...</p>
        ) : enrolledCourses.length === 0 ? (
          <p className="muted">Nie masz jeszcze wykupionych kursow.</p>
        ) : (
          <div className="dashboard-course-list">
            {enrolledCourses.map((course) => (
              <article className="dashboard-course-row" key={course.id}>
                <div>
                  <h3>{course.title}</h3>
                  <p>{course.category}</p>
                  <div className="progress-row">
                    <span>Postep</span>
                    <strong>{Math.round(course.progressPercent)}%</strong>
                  </div>
                  <div className="progress-track">
                    <div style={{ width: `${course.progressPercent}%` }} />
                  </div>
                </div>
                <div className="admin-row-actions">
                  <button type="button" className="secondary-button" onClick={() => navigate(`/courses/${course.id}`)}>
                    Szczegoly
                  </button>
                  <button type="button" disabled={loading || !course.canStart} onClick={() => void startCourse(course.id)}>
                    Kontynuuj
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {availableCourses.length > 0 && (
        <section className="content-grid">
          <div className="section-heading">
            <p className="eyebrow">Dostepne</p>
            <h2>Pozostale kursy</h2>
          </div>
          <div className="dashboard-course-list">
            {availableCourses.slice(0, 3).map((course) => (
              <article className="dashboard-course-row" key={course.id}>
                <div>
                  <h3>{course.title}</h3>
                  <p>{course.category}</p>
                </div>
                <button type="button" className="secondary-button" onClick={() => navigate(`/courses/${course.id}`)}>
                  Zobacz
                </button>
              </article>
            ))}
          </div>
        </section>
      )}
    </section>
  )
}
