import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCourse, updateCourse } from '../api/courseApi'
import { useAuth } from '../auth/AuthContext'
import { AdminCourseForm } from '../components/AdminCourseForm'
import type { CourseFormRequest } from '../types/course'

const emptyCourse: CourseFormRequest = {
  title: '',
  description: '',
  category: '',
  thumbnailUrl: '',
  price: 0,
}

export function AdminCourseEditPage() {
  const { courseId } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<CourseFormRequest>(emptyCourse)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (courseId) {
      void loadCourse(courseId)
    }
  }, [courseId, token])

  async function loadCourse(id: string) {
    setLoading(true)
    setError('')

    try {
      const course = await getCourse(id, token)
      setForm({
        title: course.title,
        description: course.description,
        category: course.category,
        thumbnailUrl: course.thumbnailUrl ?? '',
        price: course.price,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie pobrac kursu.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!courseId) {
      setError('Brak identyfikatora kursu.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await updateCourse(courseId, form, token)
      navigate('/admin/courses')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie zapisac kursu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="admin-page">
      <div className="section-heading">
        <p className="eyebrow">Admin</p>
        <h2>Edytuj kurs</h2>
      </div>

      {error && <div className="alert">{error}</div>}

      <AdminCourseForm
        value={form}
        loading={loading}
        submitLabel="Zapisz zmiany"
        onChange={setForm}
        onSubmit={(event) => void handleSubmit(event)}
        onCancel={() => navigate('/admin/courses')}
      />
    </section>
  )
}
