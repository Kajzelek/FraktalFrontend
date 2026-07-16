import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createChapter, deleteChapter, getCourseChapters, updateChapter } from '../api/chapterApi'
import { getCourse } from '../api/courseApi'
import { useAuth } from '../auth/AuthContext'
import { AdminBreadcrumbs } from '../components/AdminBreadcrumbs'
import { AdminChapterForm } from '../components/AdminChapterForm'
import type { Chapter, ChapterFormRequest } from '../types/chapter'
import type { AdminCourse } from '../types/course'

const emptyChapter: ChapterFormRequest = {
  title: '',
  position: 0,
}

export function AdminChaptersPage() {
  const { courseId } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [course, setCourse] = useState<AdminCourse | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [form, setForm] = useState<ChapterFormRequest>(emptyChapter)
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (courseId) {
      void loadData(courseId)
    }
  }, [courseId, token])

  async function loadData(id: string) {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const [courseData, chapterList] = await Promise.all([getCourse(id, token), getCourseChapters(id, token)])
      setCourse(courseData)
      setChapters(chapterList)
      setForm({ ...emptyChapter, position: chapterList.length })
      setEditingChapterId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie pobrac rozdzialow.')
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
    setSuccess('')

    try {
      const editing = Boolean(editingChapterId)
      const saved = editingChapterId
        ? await updateChapter(editingChapterId, form, token)
        : await createChapter(courseId, form, token)
      const nextChapters = editingChapterId
        ? chapters.map((chapter) => (chapter.id === saved.id ? saved : chapter))
        : [...chapters, saved]

      setChapters(sortChapters(nextChapters))
      resetForm(nextChapters.length)
      setSuccess(editing ? 'Rozdzial zostal zapisany.' : 'Rozdzial zostal dodany.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie zapisac rozdzialu.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(chapter: Chapter) {
    const confirmed = window.confirm(
      `Czy na pewno chcesz usunac rozdzial "${chapter.title}"? Tej operacji nie da sie cofnac.`,
    )

    if (!confirmed) {
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await deleteChapter(chapter.id, token)
      const nextChapters = chapters.filter((item) => item.id !== chapter.id)

      setChapters(nextChapters)
      if (editingChapterId === chapter.id) {
        resetForm(nextChapters.length)
      }
      setSuccess('Rozdzial zostal usuniety.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie usunac rozdzialu.')
    } finally {
      setLoading(false)
    }
  }

  function startEdit(chapter: Chapter) {
    setSuccess('')
    setEditingChapterId(chapter.id)
    setForm({
      title: chapter.title,
      position: chapter.position,
    })
  }

  function resetForm(nextPosition = chapters.length) {
    setEditingChapterId(null)
    setForm({ ...emptyChapter, position: Math.max(nextPosition, 0) })
  }

  if (!courseId) {
    return <div className="alert">Brak identyfikatora kursu.</div>
  }

  return (
    <section className="admin-page">
      <AdminBreadcrumbs
        items={[
          { label: 'Kursy', to: '/admin/courses' },
          { label: course?.title ?? 'Rozdzialy' },
        ]}
      />

      <div className="admin-heading-row">
        <div className="section-heading">
          <p className="eyebrow">Admin</p>
          <h2>Rozdzialy</h2>
          {course && <p className="muted">{course.title}</p>}
        </div>
        <button type="button" className="secondary-button" onClick={() => navigate('/admin/courses')}>
          Wroc do kursow
        </button>
      </div>

      {error && <div className="alert">{error}</div>}
      {success && <div className="success-alert">{success}</div>}

      <AdminChapterForm
        value={form}
        loading={loading}
        submitLabel={editingChapterId ? 'Zapisz rozdzial' : 'Dodaj rozdzial'}
        onChange={setForm}
        onSubmit={(event) => void handleSubmit(event)}
        onCancel={editingChapterId ? resetForm : undefined}
      />

      {loading && chapters.length === 0 ? (
        <p className="muted">Ladowanie rozdzialow...</p>
      ) : chapters.length === 0 ? (
        <p className="muted">Ten kurs nie ma jeszcze rozdzialow.</p>
      ) : (
        <div className="admin-table">
          {sortChapters(chapters).map((chapter) => (
            <article className="admin-course-row" key={chapter.id}>
              <div>
                <div className="lesson-title-line">
                  <h3>{chapter.title}</h3>
                  <span className="status free">Pozycja {chapter.position}</span>
                </div>
              </div>

              <div className="admin-row-actions">
                <button
                  type="button"
                  className="secondary-button"
                  disabled={loading}
                  onClick={() => navigate(`/admin/courses/${courseId}/chapters/${chapter.id}/lessons`)}
                >
                  Lekcje
                </button>
                <button type="button" className="secondary-button" disabled={loading} onClick={() => startEdit(chapter)}>
                  Edytuj
                </button>
                <button type="button" disabled={loading} onClick={() => void handleDelete(chapter)}>
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

function sortChapters(chapters: Chapter[]) {
  return [...chapters].sort((a, b) => a.position - b.position)
}
