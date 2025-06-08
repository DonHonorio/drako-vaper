"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AdminContextType {
  isAuthenticated: boolean
  token: string | null
  loading: boolean
}

const AdminContext = createContext<AdminContextType | null>(null)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = () => {
      // Verificar si hay una cookie de admin
      const cookies = document.cookie.split(";")
      const adminTokenCookie = cookies.find((cookie) => cookie.trim().startsWith("adminToken="))

      if (adminTokenCookie) {
        const tokenValue = adminTokenCookie.split("=")[1]
        setToken(tokenValue)
        setIsAuthenticated(true)
      } else if (pathname?.startsWith("/admin") && pathname !== "/admin/login") {
        // Si no hay token y está en una ruta protegida, redirigir al login
        router.push("/admin/login")
      }

      setLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  return <AdminContext.Provider value={{ isAuthenticated, token, loading }}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin debe ser usado dentro de un AdminProvider")
  }
  return context
}
