import type { FormEvent } from 'react'
import type {
  LessonMaterialFormRequest,
  MaterialProvider,
  MaterialStatus,
  MaterialType,
} from '../types/lesson'

type AdminLessonMaterialFormProps = {
  value: LessonMaterialFormRequest
  loading: boolean
  submitLabel: string
  onChange: (value: LessonMaterialFormRequest) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel?: () => void
}

const materialTypes: MaterialType[] = ['VIDEO', 'PDF', 'LINK', 'ATTACHMENT']
const providers: MaterialProvider[] = ['EXTERNAL_URL', 'CLOUDFLARE_STREAM']
const statuses: MaterialStatus[] = ['READY', 'PROCESSING', 'FAILED']

export function AdminLessonMaterialForm({
  value,
  loading,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
}: AdminLessonMaterialFormProps) {
  return (
    <form className="admin-form material-form" onSubmit={onSubmit}>
      <label>
        Tytul materialu
        <input
          value={value.title}
          onChange={(event) => onChange({ ...value, title: event.target.value })}
          required
        />
      </label>

      <div className="material-options-grid">
        <label>
          Typ
          <select
            value={value.type}
            onChange={(event) => onChange({ ...value, type: event.target.value as MaterialType })}
            required
          >
            {materialTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label>
          Provider
          <select
            value={value.provider}
            onChange={(event) => onChange({ ...value, provider: event.target.value as MaterialProvider })}
            required
          >
            {providers.map((provider) => (
              <option key={provider} value={provider}>
                {provider}
              </option>
            ))}
          </select>
        </label>

        <label>
          Status
          <select
            value={value.status}
            onChange={(event) => onChange({ ...value, status: event.target.value as MaterialStatus })}
            required
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        URL
        <input
          value={value.url ?? ''}
          onChange={(event) => onChange({ ...value, url: event.target.value })}
          placeholder="https://..."
        />
      </label>

      <label>
        Provider asset ID
        <input
          value={value.providerAssetId ?? ''}
          onChange={(event) => onChange({ ...value, providerAssetId: event.target.value })}
          placeholder="np. Cloudflare Stream ID"
        />
      </label>

      <div className="material-options-grid">
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
          Czas (sek)
          <input
            type="number"
            min="0"
            value={value.durationSeconds ?? ''}
            onChange={(event) =>
              onChange({
                ...value,
                durationSeconds: event.target.value === '' ? null : Number(event.target.value),
              })
            }
          />
        </label>
      </div>

      <label>
        Miniatura URL
        <input
          value={value.thumbnailUrl ?? ''}
          onChange={(event) => onChange({ ...value, thumbnailUrl: event.target.value })}
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
