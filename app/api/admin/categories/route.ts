import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { executeQuery } from "@/lib/database"

// Obtener todas las categorías
export async function GET(request: NextRequest) {
  try {
    const adminToken = process.env.ADMIN_SECRET_TOKEN
    const authToken = request.headers.get("x-auth-token")

    if (!authToken || authToken !== adminToken) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const categories = await executeQuery("SELECT * FROM categories ORDER BY name ASC")
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error al obtener categorías:", error)
    return NextResponse.json({ error: "Error al obtener categorías" }, { status: 500 })
  }
}

// Crear una nueva categoría
export async function POST(request: NextRequest) {
  try {
    const adminToken = process.env.ADMIN_SECRET_TOKEN
    const authToken = request.headers.get("x-auth-token")

    if (!authToken || authToken !== adminToken) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 })
    }

    const query = "INSERT INTO categories (name, description) VALUES (?, ?)"
    const result = await executeQuery(query, [name, description || ""])

    return NextResponse.json({
      success: true,
      id: (result as any).insertId,
    })
  } catch (error) {
    console.error("Error al crear categoría:", error)
    return NextResponse.json({ error: "Error al crear categoría" }, { status: 500 })
  }
}
