import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { executeQuery } from "@/lib/database"

// Obtener todos los productos
export async function GET(request: NextRequest) {
  try {
    const adminToken = process.env.ADMIN_SECRET_TOKEN
    const authToken = request.headers.get("x-auth-token")

    if (!authToken || authToken !== adminToken) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const query = `
      SELECT 
        p.*,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id DESC
    `

    const products = await executeQuery(query)
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error al obtener productos:", error)
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 })
  }
}

// Crear un nuevo producto
export async function POST(request: NextRequest) {
  try {
    const adminToken = process.env.ADMIN_SECRET_TOKEN
    const authToken = request.headers.get("x-auth-token")

    if (!authToken || authToken !== adminToken) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const product = await request.json()

    // Validar datos
    if (!product.name || product.price === undefined) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
    }

    const query = `
      INSERT INTO products (
        name, description, price, image_url, category_id, stock_quantity, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `

    const result = await executeQuery(query, [
      product.name,
      product.description || "",
      product.price,
      product.image_url || "/placeholder.svg?height=300&width=300",
      product.category_id || null,
      product.stock_quantity || 0,
      product.is_active !== undefined ? product.is_active : true,
    ])

    return NextResponse.json({
      success: true,
      id: (result as any).insertId,
    })
  } catch (error) {
    console.error("Error al crear producto:", error)
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 })
  }
}
