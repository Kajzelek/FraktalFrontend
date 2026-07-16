import type { FormEvent } from 'react'
import type { LessonFormRequest } from '../types/lesson'

type AdminLessonFormProps = {
  value: LessonFormRequest
  loading: boolean
  submitLabel: string
  onChange: (value: LessonFormRequest) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel?: () => void
}

export function AdminLessonForm({
  value,
  loading,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
}: AdminLessonFormProps) {
  return (
    <form className="admin-form lesson-form" onSubmit={onSubmit}>
      <label>
        Tytul lekcji
        <input
          value={value.title}
          onChange={(event) => onChange({ ...value, title: event.target.value })}
          required
        />
      </label>

      <label>
        Opis
        <textarea
          rows={3}
          value={value.description}
          onChange={(event) => onChange({ ...value, description: event.target.value })}
        />
      </label>

      <div className="lesson-options-grid">
        <label>
          Pozycja
          <input
            type="number"
            min="0"
            value={value.position}
            onChange={(event) => onChange({ ...value, position: Number(event.target.value) })}
            required
          />
        </label>

        <label>
          Czas (min)
          <input
            type="number"
            min="0"
            value={value.durationMinutes ?? ''}
            onChange={(event) =>
              onChange({
                ...value,
                durationMinutes: event.target.value === '' ? null : Number(event.target.value),
              })
            }
          />
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={value.free}
            onChange={(event) => onChange({ ...value, free: event.target.checked })}
          />
          Darmowa lekcja
        </label>
      </div>

      <label>
        Wideo URL
        <input
          value={value.videoUrl}
          onChange={(event) => onChange({ ...value, videoUrl: event.target.value })}
          placeholder="https://..."
        />
      </label>

      <label>
        PDF URL
        <input
          value={value.pdfUrl}
          onChange={(event) => onChange({ ...value, pdfUrl: event.target.value })}
          placeholder="https://..."
        />
      </label>

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="secondary-button" onClick={onCancel}>
            Anuluj
          </button>
        )}
        <button type="submit" disabled={loading}>
          {loading ? 'Zapisywanie...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
