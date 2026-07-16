import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCourseChapters } from '../api/chapterApi'
import { getCourse } from '../api/courseApi'
import {
  createLessonMaterial,
  deleteLessonMaterial,
  getChapterLessons,
  getLessonMaterials,
  updateLessonMaterial,
} from '../api/lessonApi'
import { useAuth } from '../auth/AuthContext'
import { AdminBreadcrumbs } from '../components/AdminBreadcrumbs'
import { AdminLessonMaterialForm } from '../components/AdminLessonMaterialForm'
import type { Chapter } from '../types/chapter'
import type { AdminCourse } from '../types/course'
import type { AdminLesson, LessonMaterial, LessonMaterialFormRequest } from '../types/lesson'

const emptyMaterial: LessonMaterialFormRequest = {
  title: '',
  type: 'VIDEO',
  url: '',
  provider: 'EXTERNAL_URL',
  providerAssetId: '',
  durationSeconds: null,
  thumbnailUrl: '',
  status: 'READY',
  position: 0,
}

export function AdminLessonMaterialsPage() {
  const { courseId, chapterId, lessonId } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [course, setCourse] = useState<AdminCourse | null>(null)
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [lesson, setLesson] = useState<AdminLesson | null>(null)
  const [materials, setMaterials] = useState<LessonMaterial[]>([])
  const [form, setForm] = useState<LessonMaterialFormRequest>(emptyMaterial)
  const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (courseId && chapterId && lessonId) {
      void loadData(courseId, chapterId, lessonId)
    }
  }, [courseId, chapterId, lessonId, token])

  async function loadData(selectedCourseId: string, selectedChapterId: string, selectedLessonId: string) {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const [courseData, chapterList, lessonList, materialList] = await Promise.all([
        getCourse(selectedCourseId, token),
        getCourseChapters(selectedCourseId, token),
        getChapterLessons(selectedChapterId, token),
        getLessonMaterials(selectedLessonId, token),
      ])

      setCourse(courseData)
      setChapter(chapterList.find((item) => item.id === selectedChapterId) ?? null)
      setLesson(lessonList.find((item) => item.id === selectedLessonId) ?? null)
      setMaterials(sortMaterials(materialList))
      setForm({ ...emptyMaterial, position: materialList.length })
      setEditingMaterialId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie pobrac materialow.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!lessonId) {
      setError('Brak identyfikatora lekcji.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const request = normalizeRequest(form)
      const editing = Boolean(editingMaterialId)
      const saved = editingMaterialId
        ? await updateLessonMaterial(editingMaterialId, request, token)
        : await createLessonMaterial(lessonId, request, token)
      const nextMaterials = editingMaterialId
        ? materials.map((material) => (material.id === saved.id ? saved : material))
        : [...materials, saved]

      setMaterials(sortMaterials(nextMaterials))
      resetForm(nextMaterials.length)
      setSuccess(editing ? 'Material zostal zapisany.' : 'Material zostal dodany.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie zapisac materialu.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(material: LessonMaterial) {
    const confirmed = window.confirm(
      `Czy na pewno chcesz usunac material "${material.title}"? Tej operacji nie da sie cofnac.`,
    )

    if (!confirmed) {
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await deleteLessonMaterial(material.id, token)
      const nextMaterials = materials.filter((item) => item.id !== material.id)

      setMaterials(nextMaterials)
      if (editingMaterialId === material.id) {
        resetForm(nextMaterials.length)
      }
      setSuccess('Material zostal usuniety.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udalo sie usunac materialu.')
    } finally {
      setLoading(false)
    }
  }

  function startEdit(material: LessonMaterial) {
    setSuccess('')
    setEditingMaterialId(material.id)
    setForm({
      title: material.title,
      type: material.type,
      url: material.url ?? '',
      provider: material.provider,
      providerAssetId: material.providerAssetId ?? '',
      durationSeconds: material.durationSeconds,
      thumbnailUrl: material.thumbnailUrl ?? '',
      status: material.status,
      position: material.position,
    })
  }

  function resetForm(nextPosition = materials.length) {
    setEditingMaterialId(null)
    setForm({ ...emptyMaterial, position: Math.max(nextPosition, 0) })
  }

  if (!courseId || !chapterId || !lessonId) {
    return <div className="alert">Brak identyfikatora kursu, rozdzialu lub lekcji.</div>
  }

  return (
    <section className="admin-page">
      <AdminBreadcrumbs
        items={[
          { label: 'Kursy', to: '/admin/courses' },
          { label: course?.title ?? 'Rozdzialy', to: `/admin/courses/${courseId}/chapters` },
          { label: chapter?.title ?? 'Lekcje', to: `/admin/courses/${courseId}/chapters/${chapterId}/lessons` },
          { label: lesson?.title ?? 'Materialy' },
        ]}
      />

      <div className="admin-heading-row">
        <div className="section-heading">
          <p className="eyebrow">Admin</p>
          <h2>Materialy</h2>
          <p className="muted">
            {[course?.title, chapter?.title, lesson?.title].filter(Boolean).join(' / ') || 'Wybrana lekcja'}
          </p>
        </div>
        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate(`/admin/courses/${courseId}/chapters/${chapterId}/lessons`)}
        >
          Wroc do lekcji
        </button>
      </div>

      {error && <div className="alert">{error}</div>}
      {success && <div className="success-alert">{success}</div>}

      <AdminLessonMaterialForm
        value={form}
        loading={loading}
        submitLabel={editingMaterialId ? 'Zapisz material' : 'Dodaj material'}
        onChange={setForm}
        onSubmit={(event) => void handleSubmit(event)}
        onCancel={editingMaterialId ? resetForm : undefined}
      />

      {loading && materials.length === 0 ? (
        <p className="muted">Ladowanie materialow...</p>
      ) : materials.length === 0 ? (
        <p className="muted">Ta lekcja nie ma jeszcze materialow.</p>
      ) : (
        <div className="admin-table">
          {sortMaterials(materials).map((material) => (
            <article className="admin-course-row" key={material.id}>
              <div>
                <div className="lesson-title-line">
                  <h3>{material.title}</h3>
                  <span className="status free">{material.type}</span>
                  <span className={material.status === 'READY' ? 'status done' : 'status locked'}>
                    {material.status}
                  </span>
                </div>
                <div className="course-meta">
                  <span>Pozycja {material.position}</span>
                  <span>{material.provider}</span>
                  <span>{material.durationSeconds ?? 0} sek</span>
                </div>
                {material.url && <p>{material.url}</p>}
                {material.providerAssetId && <p>Asset ID: {material.providerAssetId}</p>}
              </div>

              <div className="admin-row-actions">
                {material.url && (
                  <a className="button-link secondary-link" href={material.url} target="_blank" rel="noreferrer">
                    Otworz
                  </a>
                )}
                <button
                  type="button"
                  className="secondary-button"
                  disabled={loading}
                  onClick={() => startEdit(material)}
                >
                  Edytuj
                </button>
                <button type="button" disabled={loading} onClick={() => void handleDelete(material)}>
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

function normalizeRequest(request: LessonMaterialFormRequest): LessonMaterialFormRequest {
  return {
    ...request,
    title: request.title.trim(),
    url: normalizeOptionalText(request.url),
    providerAssetId: normalizeOptionalText(request.providerAssetId),
    thumbnailUrl: normalizeOptionalText(request.thumbnailUrl),
  }
}

function normalizeOptionalText(value: string | null) {
  const trimmed = value?.trim() ?? ''
  return trimmed ? trimmed : null
}

function sortMaterials(materials: LessonMaterial[]) {
  return [...materials].sort((a, b) => a.position - b.position)
}
