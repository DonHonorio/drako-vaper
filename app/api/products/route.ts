import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const query = `
      SELECT 
        p.*,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
      ORDER BY p.id DESC
    `

    const products = await executeQuery(query)
    const transformedProducts = (products as any[]).map((product) => ({
      ...product,
      price: Number(product.price),
      stock_quantity: Number(product.stock_quantity),
      is_active: Boolean(product.is_active),
    }))
    return NextResponse.json(transformedProducts)
  } catch (error) {
    console.error("Error al obtener productos:", error)
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 })
  }
}
