"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Lock, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminLogin() {
  const [token, setToken] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Verificar si ya está autenticado al cargar la página
  useEffect(() => {
    const checkExistingAuth = () => {
      // Verificar si hay una cookie de admin
      const cookies = document.cookie.split(";")
      const adminTokenCookie = cookies.find((cookie) => cookie.trim().startsWith("adminToken="))

      if (adminTokenCookie) {
        console.log("Found existing admin token, redirecting to admin panel")
        router.push("/admin")
      }
    }

    checkExistingAuth()
  }, [router])

  const setCookie = (name: string, value: string, days = 1) => {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log("Attempting login...")

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (response.ok) {
        console.log("Login successful, setting cookie and redirecting...")

        // Establecer la cookie
        setCookie("adminToken", token, 1) // 1 día de duración

        // También guardar en localStorage como respaldo
        localStorage.setItem("adminToken", token)

        // Pequeña pausa para asegurar que la cookie se establezca
        setTimeout(() => {
          console.log("Redirecting to admin panel...")
          window.location.href = "/admin"
        }, 100)
      } else {
        console.log("Login failed:", data.error)
        setError(data.error || "Token inválido")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Error al intentar iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Card className="w-full max-w-md bg-card border-red-900/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white">Panel de Administración</CardTitle>
          <CardDescription className="text-muted-foreground">Ingresa tu token de acceso para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-950/50 border-red-900">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token" className="text-white">
                  Token de Administración
                </Label>
                <Input
                  id="token"
                  type="password"
                  placeholder="Ingresa tu token secreto"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                  className="bg-secondary border-red-900/20 text-white"
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? (
                  <>
                    <Lock className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Acceder
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <div className="w-full space-y-2">
            <p className="text-sm text-muted-foreground text-center">
              El token debe coincidir con la variable ADMIN_SECRET_TOKEN en el archivo .env
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Token por defecto: <code className="bg-secondary px-1 rounded">vapestore_admin_secret_token_2024</code>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
