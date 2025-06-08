"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap, LogOut } from "lucide-react"

export function AdminHeader() {
  const handleLogout = () => {
    // Eliminar la cookie
    document.cookie = "adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

    // Eliminar de localStorage
    localStorage.removeItem("adminToken")

    // Redirigir al login
    window.location.href = "/admin/login"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-red-900/20 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/admin" className="flex items-center space-x-2">
          <Zap className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            VapeStore Admin
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-red-900/20 text-primary hover:bg-primary hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  )
}
