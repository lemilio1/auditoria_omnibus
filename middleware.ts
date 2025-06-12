import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Permitir todas las rutas de API y archivos estáticos
  if (path.startsWith("/api/") || path.startsWith("/_next/") || path.startsWith("/favicon.ico") || path.includes(".")) {
    return NextResponse.next()
  }

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/login", "/test-auth"]
  if (publicRoutes.includes(path)) {
    return NextResponse.next()
  }

  // Para todas las demás rutas, simplemente continuar
  // La verificación de autenticación se hará en el lado del cliente
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
