import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { executeQuery } from "@/lib/database"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminToken = process.env.ADMIN_SECRET_TOKEN
    const authToken = request.headers.get("x-auth-token")

    if (!authToken || authToken !== adminToken) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const orderId = params.id
    const { status } = await request.json()

    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 })
    }

    const query = "UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    await executeQuery(query, [status, orderId])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al actualizar estado del pedido:", error)
    return NextResponse.json({ error: "Error al actualizar estado del pedido" }, { status: 500 })
  }
}
