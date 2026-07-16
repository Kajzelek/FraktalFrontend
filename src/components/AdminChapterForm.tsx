import type { FormEvent } from 'react'
import type { ChapterFormRequest } from '../types/chapter'

type AdminChapterFormProps = {
  value: ChapterFormRequest
  loading: boolean
  submitLabel: string
  onChange: (value: ChapterFormRequest) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel?: () => void
}

export function AdminChapterForm({
  value,
  loading,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
}: AdminChapterFormProps) {
  return (
    <form className="chapter-form" onSubmit={onSubmit}>
      <label>
        Tytul rozdzialu
        <input
          value={value.title}
          onChange={(event) => onChange({ ...value, title: event.target.value })}
          required
        />
      </label>

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
