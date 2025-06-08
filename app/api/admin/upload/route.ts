import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const adminToken = process.env.ADMIN_SECRET_TOKEN
    const authToken = request.headers.get("x-auth-token")

    if (!authToken || authToken !== adminToken) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Asegurarse de que la solicitud es multipart/form-data
    const formData = await request.formData()
    const image = formData.get("image") as File | null

    if (!image) {
      return NextResponse.json({ error: "No se ha proporcionado ninguna imagen" }, { status: 400 })
    }

    // Validar tipo de archivo
    if (!image.type.startsWith("image/")) {
      return NextResponse.json({ error: "El archivo debe ser una imagen" }, { status: 400 })
    }

    // Validar tamaño (máximo 5MB)
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "La imagen es demasiado grande. El tamaño máximo es 5MB" }, { status: 400 })
    }

    // Crear directorio si no existe
    const uploadDir = join(process.cwd(), "public", "products")
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generar nombre único para el archivo
    const fileExtension = image.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExtension}`
    const filePath = join(uploadDir, fileName)

    // Convertir el archivo a un buffer y guardarlo
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Devolver la URL de la imagen
    const imageUrl = `/products/${fileName}`
    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("Error al subir la imagen:", error)
    return NextResponse.json({ error: "Error al procesar la imagen" }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
