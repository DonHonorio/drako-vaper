type RequestOptions = {
  method?: string
  body?: any
  headers?: Record<string, string>
}

export async function adminFetch<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const token = localStorage.getItem("adminToken")

  if (!token) {
    throw new Error("No hay token de autenticación")
  }

  const headers = {
    ...options.headers,
    "x-auth-token": token,
    "Content-Type": "application/json",
  }

  const response = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || `Error ${response.status}: ${response.statusText}`)
  }

  return response.json()
}
