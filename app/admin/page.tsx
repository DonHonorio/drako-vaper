"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingBag, Tag, TrendingUp, AlertTriangle, Clock } from "lucide-react"
import { useAdmin } from "@/lib/admin-context"
import { adminFetch } from "@/lib/admin-client"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Stats {
  totalProducts: number
  totalCategories: number
  totalOrders: number
  revenue: number
  lowStockProducts: number
  recentOrders: number
  monthlyStats: Array<{
    month: string
    orders: number
    revenue: number
  }>
  topProducts: Array<{
    name: string
    totalSold: number
    revenue: number
  }>
}

export default function AdminDashboard() {
  const { isAuthenticated } = useAdmin()
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    revenue: 0,
    lowStockProducts: 0,
    recentOrders: 0,
    monthlyStats: [],
    topProducts: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await adminFetch<Stats>("/api/admin/stats")
        setStats(data)
      } catch (error) {
        console.error("Error al cargar estadísticas:", error)
        setError("Error al cargar las estadísticas")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Panel de Administración</h1>
          <p className="text-muted-foreground">Cargando estadísticas...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-card border-red-900/20 animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-700 rounded w-20"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-700 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Panel de Administración</h1>
        <p className="text-muted-foreground">Bienvenido al panel de control de VapeStore</p>
      </div>

      {error && (
        <Alert className="border-red-900/20 bg-red-900/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-400">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card className="bg-card border-red-900/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white text-sm font-medium">Productos</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Productos activos</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-red-900/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white text-sm font-medium">Categorías</CardTitle>
            <Tag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground">Categorías totales</p>
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

        <Card className="bg-card border-red-900/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white text-sm font-medium">Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">Productos con stock bajo</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-red-900/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white text-sm font-medium">Recientes</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.recentOrders}</div>
            <p className="text-xs text-muted-foreground">Pedidos últimos 7 días</p>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas mensuales */}
      {stats.monthlyStats.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-red-900/20">
            <CardHeader>
              <CardTitle className="text-white">Estadísticas Mensuales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.monthlyStats.slice(0, 6).map((stat) => (
                  <div key={stat.month} className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">
                        {new Date(stat.month + "-01").toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">{stat.orders} pedidos</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">€{stat.revenue.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Productos más vendidos */}
          <Card className="bg-card border-red-900/20">
            <CardHeader>
              <CardTitle className="text-white">Productos Más Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topProducts.length > 0 ? (
                  stats.topProducts.map((product, index) => (
                    <div key={product.name} className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-primary font-bold">#{index + 1}</span>
                        <div>
                          <p className="text-white font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.totalSold} vendidos</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">€{product.revenue.toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">No hay datos de ventas disponibles</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
