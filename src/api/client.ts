const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

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
    throw new Error(message)
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
  try {
    const body = await response.json()
    return body.message ?? 'Nie udalo sie wykonac operacji.'
  } catch {
    return 'Nie udalo sie wykonac operacji.'
  }
}
