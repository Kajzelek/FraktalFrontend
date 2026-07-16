import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCourse } from '../api/courseApi'
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

export function AdminCourseCreatePage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<CourseFormRequest>(emptyCourse)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await createCourse(form, token)
      navigate('/admin/courses')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie utworzyc kursu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="admin-page">
      <div className="section-heading">
        <p className="eyebrow">Admin</p>
        <h2>Nowy kurs</h2>
      </div>

      {error && <div className="alert">{error}</div>}

      <AdminCourseForm
        value={form}
        loading={loading}
        submitLabel="Utworz kurs"
        onChange={setForm}
        onSubmit={(event) => void handleSubmit(event)}
        onCancel={() => navigate('/admin/courses')}
      />
    </section>
  )
}
