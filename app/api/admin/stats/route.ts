import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const adminToken = process.env.ADMIN_SECRET_TOKEN
    const authToken = request.headers.get("x-auth-token")

    if (!authToken || authToken !== adminToken) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Obtener estadísticas en paralelo
    const [productsResult, categoriesResult, ordersResult, revenueResult, lowStockResult, recentOrdersResult] =
      await Promise.all([
        // Total de productos
        executeQuery("SELECT COUNT(*) as total FROM products WHERE is_active = 1"),

        // Total de categorías
        executeQuery("SELECT COUNT(*) as total FROM categories"),

        // Total de pedidos
        executeQuery("SELECT COUNT(*) as total FROM orders"),

        // Ingresos totales
        executeQuery("SELECT SUM(total) as revenue FROM orders WHERE status != 'cancelled'"),

        // Productos con stock bajo (menos de 10)
        executeQuery("SELECT COUNT(*) as total FROM products WHERE stock_quantity < 10 AND is_active = 1"),

        // Pedidos recientes (últimos 7 días)
        executeQuery("SELECT COUNT(*) as total FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)"),
      ])

    // Obtener estadísticas por mes (últimos 6 meses)
    const monthlyStats = await executeQuery(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as orders,
        SUM(total) as revenue
      FROM orders 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        AND status != 'cancelled'
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month DESC
    `)

    // Productos más vendidos
    const topProducts = await executeQuery(`
      SELECT 
        p.name,
        SUM(oi.quantity) as total_sold,
        SUM(oi.subtotal) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'cancelled'
      GROUP BY p.id, p.name
      ORDER BY total_sold DESC
      LIMIT 5
    `)

    const stats = {
      totalProducts: (productsResult as any[])[0]?.total || 0,
      totalCategories: (categoriesResult as any[])[0]?.total || 0,
      totalOrders: (ordersResult as any[])[0]?.total || 0,
      revenue: Number((revenueResult as any[])[0]?.revenue || 0),
      lowStockProducts: (lowStockResult as any[])[0]?.total || 0,
      recentOrders: (recentOrdersResult as any[])[0]?.total || 0,
      monthlyStats: (monthlyStats as any[]).map((stat) => ({
        month: stat.month,
        orders: Number(stat.orders),
        revenue: Number(stat.revenue),
      })),
      topProducts: (topProducts as any[]).map((product) => ({
        name: product.name,
        totalSold: Number(product.total_sold),
        revenue: Number(product.revenue),
      })),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 })
  }
}
