import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCourseChapters } from '../api/chapterApi'
import { getCourse } from '../api/courseApi'
import { createLesson, deleteLesson, getChapterLessons, updateLesson } from '../api/lessonApi'
import { useAuth } from '../auth/AuthContext'
import { AdminLessonForm } from '../components/AdminLessonForm'
import type { Chapter } from '../types/chapter'
import type { AdminCourse } from '../types/course'
import type { AdminLesson, LessonFormRequest } from '../types/lesson'

const emptyLesson: LessonFormRequest = {
  title: '',
  description: '',
  position: 0,
  videoUrl: '',
  pdfUrl: '',
  free: false,
  durationMinutes: null,
}

export function AdminLessonsPage() {
  const { courseId, chapterId } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [course, setCourse] = useState<AdminCourse | null>(null)
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [lessons, setLessons] = useState<AdminLesson[]>([])
  const [form, setForm] = useState<LessonFormRequest>(emptyLesson)
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (courseId && chapterId) {
      void loadData(courseId, chapterId)
    }
  }, [courseId, chapterId, token])

  async function loadData(selectedCourseId: string, selectedChapterId: string) {
    setLoading(true)
    setError('')

    try {
      const [courseData, chapterList, lessonList] = await Promise.all([
        getCourse(selectedCourseId, token),
        getCourseChapters(selectedCourseId, token),
        getChapterLessons(selectedChapterId, token),
      ])

      setCourse(courseData)
      setChapter(chapterList.find((item) => item.id === selectedChapterId) ?? null)
      setLessons(sortLessons(lessonList))
      setForm({ ...emptyLesson, position: lessonList.length })
      setEditingLessonId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie pobrac lekcji.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!chapterId) {
      setError('Brak identyfikatora rozdzialu.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const request = normalizeRequest(form)
      const saved = editingLessonId
        ? await updateLesson(editingLessonId, request, token)
        : await createLesson(chapterId, request, token)
      const nextLessons = editingLessonId
        ? lessons.map((lesson) => (lesson.id === saved.id ? saved : lesson))
        : [...lessons, saved]

      setLessons(sortLessons(nextLessons))
      resetForm(nextLessons.length)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie zapisac lekcji.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(lessonId: string) {
    setLoading(true)
    setError('')

    try {
      await deleteLesson(lessonId, token)
      const nextLessons = lessons.filter((lesson) => lesson.id !== lessonId)

      setLessons(nextLessons)
      if (editingLessonId === lessonId) {
        resetForm(nextLessons.length)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie usunac lekcji.')
    } finally {
      setLoading(false)
    }
  }

  function startEdit(lesson: AdminLesson) {
    setEditingLessonId(lesson.id)
    setForm({
      title: lesson.title,
      description: lesson.description ?? '',
      position: lesson.position,
      videoUrl: lesson.videoUrl ?? '',
      pdfUrl: lesson.pdfUrl ?? '',
      free: lesson.free,
      durationMinutes: lesson.durationMinutes,
    })
  }

  function resetForm(nextPosition = lessons.length) {
    setEditingLessonId(null)
    setForm({ ...emptyLesson, position: Math.max(nextPosition, 0) })
  }

  if (!courseId || !chapterId) {
    return <div className="alert">Brak identyfikatora kursu lub rozdzialu.</div>
  }

  return (
    <section className="admin-page">
      <div className="admin-heading-row">
        <div className="section-heading">
          <p className="eyebrow">Admin</p>
          <h2>Lekcje</h2>
          <p className="muted">
            {[course?.title, chapter?.title].filter(Boolean).join(' / ') || 'Wybrany rozdzial'}
          </p>
        </div>
        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate(`/admin/courses/${courseId}/chapters`)}
        >
          Wroc do rozdzialow
        </button>
      </div>

      {error && <div className="alert">{error}</div>}

      <AdminLessonForm
        value={form}
        loading={loading}
        submitLabel={editingLessonId ? 'Zapisz lekcje' : 'Dodaj lekcje'}
        onChange={setForm}
        onSubmit={(event) => void handleSubmit(event)}
        onCancel={editingLessonId ? resetForm : undefined}
      />

      {loading && lessons.length === 0 ? (
        <p className="muted">Ladowanie lekcji...</p>
      ) : lessons.length === 0 ? (
        <p className="muted">Ten rozdzial nie ma jeszcze lekcji.</p>
      ) : (
        <div className="admin-table">
          {sortLessons(lessons).map((lesson) => (
            <article className="admin-course-row" key={lesson.id}>
              <div>
                <div className="lesson-title-line">
                  <h3>{lesson.title}</h3>
                  <span className="status free">Pozycja {lesson.position}</span>
                  <span className={lesson.free ? 'status done' : 'status locked'}>
                    {lesson.free ? 'Darmowa' : 'Platna'}
                  </span>
                </div>
                {lesson.description && <p>{lesson.description}</p>}
                <div className="course-meta">
                  <span>{lesson.durationMinutes ?? 0} min</span>
                  <span>{lesson.videoUrl ? 'Wideo' : 'Brak wideo'}</span>
                  <span>{lesson.pdfUrl ? 'PDF' : 'Brak PDF'}</span>
                </div>
              </div>

              <div className="admin-row-actions">
                <button
                  type="button"
                  className="secondary-button"
                  disabled={loading}
                  onClick={() =>
                    navigate(`/admin/courses/${courseId}/chapters/${chapterId}/lessons/${lesson.id}/materials`)
                  }
                >
                  Materialy
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  disabled={loading}
                  onClick={() => navigate(`/lessons/${lesson.id}`)}
                >
                  Podglad
                </button>
                <button type="button" className="secondary-button" disabled={loading} onClick={() => startEdit(lesson)}>
                  Edytuj
                </button>
                <button type="button" disabled={loading} onClick={() => void handleDelete(lesson.id)}>
                  Usun
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function normalizeRequest(request: LessonFormRequest) {
  return {
    ...request,
    title: request.title.trim(),
    description: request.description.trim(),
    videoUrl: request.videoUrl.trim(),
    pdfUrl: request.pdfUrl.trim(),
  }
}

function sortLessons(lessons: AdminLesson[]) {
  return [...lessons].sort((a, b) => a.position - b.position)
}
