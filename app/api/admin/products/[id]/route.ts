import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { executeQuery } from "@/lib/database"

// Obtener un producto por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminToken = process.env.ADMIN_SECRET_TOKEN
    const authToken = request.headers.get("x-auth-token")

    if (!authToken || authToken !== adminToken) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const id = params.id
    const query = `
      SELECT 
        p.*,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `

    const products = await executeQuery(query, [id])

    if (Array.isArray(products) && products.length === 0) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json(products[0])
  } catch (error) {
    console.error("Error al obtener producto:", error)
    return NextResponse.json({ error: "Error al obtener producto" }, { status: 500 })
  }
}

// Actualizar un producto
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminToken = process.env.ADMIN_SECRET_TOKEN
    const authToken = request.headers.get("x-auth-token")

    if (!authToken || authToken !== adminToken) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const id = params.id
    const product = await request.json()

    // Validar datos
    if (!product.name || product.price === undefined) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
    }

    const query = `
      UPDATE products SET
        name = ?,
        description = ?,
        price = ?,
        image_url = ?,
        category_id = ?,
        stock_quantity = ?,
        is_active = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `

    await executeQuery(query, [
      product.name,
      product.description || "",
      product.price,
      product.image_url || "/placeholder.svg?height=300&width=300",
      product.category_id || null,
      product.stock_quantity || 0,
      product.is_active !== undefined ? product.is_active : true,
      id,
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al actualizar producto:", error)
    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 })
  }
}

// Eliminar un producto
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminToken = process.env.ADMIN_SECRET_TOKEN
    const authToken = request.headers.get("x-auth-token")

    if (!authToken || authToken !== adminToken) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const id = params.id
    const query = "DELETE FROM products WHERE id = ?"

    await executeQuery(query, [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar producto:", error)
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 })
  }
}
