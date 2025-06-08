import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"
import type { Category } from "@/lib/types"

export async function GET() {
  try {
    const categories = (await executeQuery("SELECT * FROM categories ORDER BY name ASC")) as Category[]

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Error al obtener categorías" }, { status: 500 })
  }
}
