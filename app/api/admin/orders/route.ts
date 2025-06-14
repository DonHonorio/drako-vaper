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

    const query = "SELECT * FROM orders ORDER BY created_at DESC"
    const orders = await executeQuery(query)
    const transformedOrders = (orders as any[]).map((order) => ({
      ...order,
      subtotal: Number(order.subtotal),
      shipping_cost: Number(order.shipping_cost),
      total: Number(order.total),
    }))
    return NextResponse.json(transformedOrders)
  } catch (error) {
    console.error("Error al obtener pedidos:", error)
    return NextResponse.json({ error: "Error al obtener pedidos" }, { status: 500 })
  }
}
