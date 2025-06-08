import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"
import type { Product } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "name"

    let query = `
      SELECT 
        p.*,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `
    const params: any[] = []

    if (category && category !== "all") {
      query += " AND c.name = ?"
      params.push(category)
    }

    if (search) {
      query += " AND (p.name LIKE ? OR p.description LIKE ?)"
      params.push(`%${search}%`, `%${search}%`)
    }

    // Ordenamiento
    switch (sortBy) {
      case "price-low":
        query += " ORDER BY p.price ASC"
        break
      case "price-high":
        query += " ORDER BY p.price DESC"
        break
      case "name":
      default:
        query += " ORDER BY p.name ASC"
        break
    }

    const products = (await executeQuery(query, params)) as Product[]

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 })
  }
}
