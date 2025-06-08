import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    const adminToken = process.env.ADMIN_SECRET_TOKEN

    if (!token || token !== adminToken) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error en la autenticación:", error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}
