import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { executeQuery } from "@/lib/database"

// Actualizar una categoría
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminToken = process.env.ADMIN_SECRET_TOKEN
    const authToken = request.headers.get("x-auth-token")

    if (!authToken || authToken !== adminToken) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const id = params.id
    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 })
    }

    const query = "UPDATE categories SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    await executeQuery(query, [name, description || "", id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al actualizar categoría:", error)
    return NextResponse.json({ error: "Error al actualizar categoría" }, { status: 500 })
  }
}

// Eliminar una categoría
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminToken = process.env.ADMIN_SECRET_TOKEN
    const authToken = request.headers.get("x-auth-token")

    if (!authToken || authToken !== adminToken) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const id = params.id

    // Verificar si hay productos usando esta categoría
    const productsWithCategory = await executeQuery("SELECT COUNT(*) as count FROM products WHERE category_id = ?", [
      id,
    ])

    if ((productsWithCategory as any)[0].count > 0) {
      return NextResponse.json(
        { error: "No se puede eliminar la categoría porque tiene productos asociados" },
        { status: 400 },
      )
    }

    const query = "DELETE FROM categories WHERE id = ?"
    await executeQuery(query, [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar categoría:", error)
    return NextResponse.json({ error: "Error al eliminar categoría" }, { status: 500 })
  }
}
