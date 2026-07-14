import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCourseCatalog } from '../api/courseApi'
import { checkoutCourse } from '../api/paymentApi'
import { useAuth } from '../auth/AuthContext'
import { CourseList } from '../components/CourseList'
import type { Course } from '../types/course'

export function CoursesPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    void loadCourses()
  }, [token])

  async function loadCourses() {
    setLoading(true)
    setError('')

    try {
      setCourses(await getCourseCatalog(token))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie pobrac kursow.')
    } finally {
      setLoading(false)
    }
  }

  async function buyCourse(courseId: string) {
    setLoading(true)
    setError('')

    try {
      const payment = await checkoutCourse(courseId, token)
      window.location.assign(payment.paymentUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie rozpoczac platnosci.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {error && <div className="alert">{error}</div>}
      <CourseList
        courses={courses}
        loading={loading}
        onBuyCourse={(courseId) => void buyCourse(courseId)}
        onOpenCourse={(courseId) => navigate(`/courses/${courseId}`)}
      />
    </>
  )
}
