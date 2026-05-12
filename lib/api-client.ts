import { getStoredAuth } from './auth-context'

export interface ApiRequestOptions extends RequestInit {
  requireAuth?: boolean
}

export async function apiRequest<T>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { requireAuth = true, headers = {}, ...rest } = options

  const authHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  } as Record<string, string>

  if (requireAuth) {
    const auth = getStoredAuth()
    if (auth?.token) {
      authHeaders.Authorization = `Bearer ${auth.token}`
    }
  }

  const response = await fetch(url, {
    ...rest,
    headers: authHeaders,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || `API error: ${response.status}`)
  }

  return data as T
}
