import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { completeLesson, getLessonPlayer } from '../api/lessonApi'
import { useAuth } from '../auth/AuthContext'
import { LessonPlayerView } from '../components/LessonPlayerView'
import type { LessonPlayer } from '../types/lesson'

export function LessonPage() {
  const { lessonId } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState<LessonPlayer | null>(null)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (lessonId) {
      void loadLesson(lessonId)
    }
  }, [lessonId, token])

  async function loadLesson(id: string) {
    setLoading(true)
    setError('')

    try {
      const player = await getLessonPlayer(id, token)
      setLesson(player)
      setCompleted(player.completed)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie pobrac lekcji.')
    } finally {
      setLoading(false)
    }
  }

  async function handleComplete() {
    if (!lesson) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const progress = await completeLesson(lesson.lessonId, token)
      setCompleted(progress.completed)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie zapisac postepu.')
    } finally {
      setLoading(false)
    }
  }

  if (!lessonId) {
    return <div className="alert">Brak identyfikatora lekcji.</div>
  }

  if (error) {
    return <div className="alert">{error}</div>
  }

  if (!lesson) {
    return <p className="muted">Ladowanie lekcji...</p>
  }

  return (
    <LessonPlayerView
      lesson={lesson}
      loading={loading}
      completed={completed}
      onBack={() => navigate(`/courses/${lesson.courseId}`)}
      onComplete={() => void handleComplete()}
      onOpenLesson={(nextLessonId) => {
        if (nextLessonId) {
          navigate(`/lessons/${nextLessonId}`)
        }
      }}
    />
  )
}
