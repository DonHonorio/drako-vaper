import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminToken = process.env.ADMIN_SECRET_TOKEN
    const authToken = request.headers.get("x-auth-token")

    if (!authToken || authToken !== adminToken) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const orderId = params.id
    const query = "SELECT * FROM order_items WHERE order_id = ?"
    const items = await executeQuery(query, [orderId])

    return NextResponse.json(items)
  } catch (error) {
    console.error("Error al obtener items del pedido:", error)
    return NextResponse.json({ error: "Error al obtener items del pedido" }, { status: 500 })
  }
}
