import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function middleware(request: NextRequest) {
  // Crear un cliente de Supabase específico para el middleware
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Verificar la sesión
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const path = request.nextUrl.pathname

  // Rutas públicas
  if (path === "/login" || path === "/test-auth") {
    // Si ya hay una sesión y estamos en login, redirigir al dashboard
    if (session && path === "/login") {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  // Proteger rutas privadas
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/login", "/test-auth"],
}
