"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { AdminProvider } from "@/lib/admin-context"
import { AdminHeader } from "@/components/admin/header"
import { AdminSidebar } from "@/components/admin/sidebar"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login"

  if (isLoginPage) {
    return <AdminProvider>{children}</AdminProvider>
  }

  return (
    <AdminProvider>
      <div className="min-h-screen bg-black">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AdminProvider>
  )
}
