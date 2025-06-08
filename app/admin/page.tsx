"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingBag, Tag, TrendingUp } from "lucide-react"
import { useAdmin } from "@/lib/admin-context"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const { isAuthenticated, token } = useAdmin()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    revenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    const fetchStats = async () => {
      try {
        // En un caso real, aquí harías una petición a tu API para obtener estadísticas
        // Por ahora, usaremos datos de ejemplo
        setStats({
          totalProducts: 10,
          totalCategories: 6,
          totalOrders: 25,
          revenue: 1250.75,
        })
      } catch (error) {
        console.error("Error al cargar estadísticas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Panel de Administración</h1>
        <p className="text-muted-foreground">Bienvenido al panel de control de VapeStore</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-red-900/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white text-sm font-medium">Productos</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Productos en catálogo</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-red-900/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white text-sm font-medium">Categorías</CardTitle>
            <Tag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground">Categorías activas</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-red-900/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white text-sm font-medium">Pedidos</CardTitle>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Pedidos totales</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-red-900/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white text-sm font-medium">Ingresos</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">€{stats.revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Ingresos totales</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
