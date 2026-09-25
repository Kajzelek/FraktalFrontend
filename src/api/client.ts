const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'


export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}


export async function apiRequest<T>(path: string, token: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const message = await readErrorMessage(response)
    throw new ApiError(response.status, message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const body = await response.text()

  if (!body) {
    return undefined as T
  }

  return JSON.parse(body) as T
}

async function readErrorMessage(response: Response) {

  const fallbackMessage = 'Nie udalo sie wykonac operacji.'

  try {
    const body: unknown = await response.json()

    if (!body || typeof body !== 'object') {
      return fallbackMessage
    }

    const errorData = body as Record<string, unknown>

    if (typeof errorData.message === 'string') {
      return errorData.message
    }

    const validationMessages = Object.values(errorData).filter(
      (value): value is string => typeof value === 'string',
    )

    if (validationMessages.length > 0) {
      return validationMessages.join(' ')
    }

    return fallbackMessage
  } catch {
    return fallbackMessage
  }
}
