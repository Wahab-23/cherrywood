export interface ApiRequestOptions extends RequestInit {
  // credentials: 'include' is set automatically so cookies are sent
}

export async function apiRequest<T>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { headers = {}, ...rest } = options

  const response = await fetch(url, {
    ...rest,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    } as Record<string, string>,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || `API error: ${response.status}`)
  }

  return data as T
}
