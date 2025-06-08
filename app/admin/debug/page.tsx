"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    const cookies = document.cookie.split(";")
    const adminTokenCookie = cookies.find((cookie) => cookie.trim().startsWith("adminToken="))
    const localStorageToken = localStorage.getItem("adminToken")

    setDebugInfo({
      cookies: document.cookie,
      adminTokenCookie: adminTokenCookie || "No encontrada",
      localStorageToken: localStorageToken || "No encontrado",
      pathname: window.location.pathname,
      userAgent: navigator.userAgent,
    })
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Debug - Estado de Autenticación</h1>

      <Card className="bg-card border-red-900/20">
        <CardHeader>
          <CardTitle className="text-white">Información de Debug</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-white text-sm overflow-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
        </CardContent>
      </Card>
    </div>
  )
}
