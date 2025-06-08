export function setAdminToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("adminToken", token)
    // También establecer una cookie para el middleware
    document.cookie = `adminToken=${token}; path=/; max-age=86400; secure; samesite=strict`
  }
}

export function getAdminToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("adminToken")
  }
  return null
}

export function removeAdminToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("adminToken")
    // Eliminar la cookie también
    document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  }
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })

    return response.ok
  } catch {
    return false
  }
}
