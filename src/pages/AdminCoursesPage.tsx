import { useEffect, useState } from 'react'
import { getAdminCourses, publishCourse, unpublishCourse } from '../api/courseApi'
import { useAuth } from '../auth/AuthContext'
import type { AdminCourse } from '../types/course'

export function AdminCoursesPage() {
  const { token } = useAuth()
  const [courses, setCourses] = useState<AdminCourse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    void loadCourses()
  }, [token])

  async function loadCourses() {
    setLoading(true)
    setError('')

    try {
      setCourses(await getAdminCourses(token))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie pobrac kursow admina.')
    } finally {
      setLoading(false)
    }
  }

  async function togglePublish(course: AdminCourse) {
    setLoading(true)
    setError('')

    try {
      const updated = course.published
        ? await unpublishCourse(course.id, token)
        : await publishCourse(course.id, token)

      setCourses((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie zmienic publikacji kursu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="admin-page">
      <div className="section-heading">
        <p className="eyebrow">Admin</p>
        <h2>Kursy</h2>
      </div>

      {error && <div className="alert">{error}</div>}

      {loading && courses.length === 0 ? (
        <p className="muted">Ladowanie kursow...</p>
      ) : courses.length === 0 ? (
        <p className="muted">Nie ma jeszcze kursow.</p>
      ) : (
        <div className="admin-table">
          {courses.map((course) => (
            <article className="admin-course-row" key={course.id}>
              <div>
                <div className="lesson-title-line">
                  <h3>{course.title}</h3>
                  <span className={course.published ? 'status done' : 'status locked'}>
                    {course.published ? 'Opublikowany' : 'Ukryty'}
                  </span>
                </div>
                <p>{course.description}</p>
                <div className="course-meta">
                  <span>{course.category}</span>
                  <span>{course.price.toFixed(2)} zl</span>
                </div>
              </div>

              <div className="admin-row-actions">
                <button type="button" className="secondary-button" disabled={loading}>
                  Edytuj pozniej
                </button>
                <button type="button" disabled={loading} onClick={() => void togglePublish(course)}>
                  {course.published ? 'Ukryj' : 'Opublikuj'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
