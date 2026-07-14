import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCourseContent } from '../api/courseApi'
import { useAuth } from '../auth/AuthContext'
import { CourseDetail } from '../components/CourseDetail'
import type { CourseContent } from '../types/course'

export function CourseDetailPage() {
  const { courseId } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [course, setCourse] = useState<CourseContent | null>(null)
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(() => new Set())
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
      const content = await getCourseContent(id, token)
      setCourse(content)
      setCompletedLessonIds(getCompletedLessonIds(content))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie pobrac kursu.')
    } finally {
      setLoading(false)
    }
  }

  if (!courseId) {
    return <div className="alert">Brak identyfikatora kursu.</div>
  }

  if (error) {
    return <div className="alert">{error}</div>
  }

  if (!course) {
    return <p className="muted">Ladowanie kursu...</p>
  }

  return (
    <CourseDetail
      course={course}
      loading={loading}
      completedLessonIds={completedLessonIds}
      onBack={() => navigate('/courses')}
      onOpenLesson={(lessonId) => navigate(`/lessons/${lessonId}`)}
    />
  )
}

function getCompletedLessonIds(course: CourseContent) {
  return new Set(
    course.chapters.flatMap((chapter) =>
      chapter.lessons.filter((lesson) => lesson.completed).map((lesson) => lesson.id),
    ),
  )
}
