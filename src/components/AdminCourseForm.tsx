import type { FormEvent } from 'react'
import type { CourseFormRequest } from '../types/course'

type AdminCourseFormProps = {
  value: CourseFormRequest
  loading: boolean
  submitLabel: string
  onChange: (value: CourseFormRequest) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}

export function AdminCourseForm({ value, loading, submitLabel, onChange, onSubmit, onCancel }: AdminCourseFormProps) {
  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <label>
        Tytul
        <input
          value={value.title}
          onChange={(event) => onChange({ ...value, title: event.target.value })}
          required
        />
      </label>

      <label>
        Opis
        <textarea
          value={value.description}
          onChange={(event) => onChange({ ...value, description: event.target.value })}
          required
          rows={5}
        />
      </label>

      <div className="form-grid">
        <label>
          Kategoria
          <input
            value={value.category}
            onChange={(event) => onChange({ ...value, category: event.target.value })}
            required
          />
        </label>

        <label>
          Cena
          <input
            type="number"
            min="0"
            step="0.01"
            value={value.price}
            onChange={(event) => onChange({ ...value, price: Number(event.target.value) })}
            required
          />
        </label>
      </div>

      <label>
        Miniatura URL
        <input
          value={value.thumbnailUrl}
          onChange={(event) => onChange({ ...value, thumbnailUrl: event.target.value })}
          placeholder="https://..."
        />
      </label>

      <div className="form-actions">
        <button type="button" className="secondary-button" onClick={onCancel}>
          Anuluj
        </button>
        <button type="submit" disabled={loading}>
          {loading ? 'Zapisywanie...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
