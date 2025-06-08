import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir acceso libre a la página de login y API de login
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next()
  }

  // Solo proteger rutas que empiecen con /admin
  if (pathname.startsWith("/admin")) {
    // Obtener el token de las cookies
    const adminToken = request.cookies.get("adminToken")?.value
    const expectedToken = process.env.ADMIN_SECRET_TOKEN

    console.log("Middleware - Path:", pathname)
    console.log("Middleware - Token from cookie:", adminToken ? "***" : "none")
    console.log("Middleware - Expected token:", expectedToken ? "***" : "none")

    // Si no hay token o no coincide, redirigir al login
    if (!adminToken || !expectedToken || adminToken !== expectedToken) {
      console.log("Middleware - Redirecting to login")
      const loginUrl = new URL("/admin/login", request.url)
      return NextResponse.redirect(loginUrl)
    }

    console.log("Middleware - Access granted")
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
