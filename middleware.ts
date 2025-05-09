import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function middleware(request: NextRequest) {
  // Crear un cliente de Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Verificar la sesión
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const path = request.nextUrl.pathname

  // Rutas públicas
  if (path === "/login") {
    if (session) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  // Proteger rutas privadas
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Verificar permisos para rutas específicas
  if (path.startsWith("/usuarios") || path.startsWith("/configuracion/avanzada")) {
    // Obtener el perfil del usuario
    const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", session.user.id).single()

    const role = profile?.role

    if (role !== "administrador" && role !== "admin_superior" && role !== "super_usuario") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  if (path.startsWith("/logs")) {
    // Obtener el perfil del usuario
    const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", session.user.id).single()

    const role = profile?.role

    if (role !== "admin_superior" && role !== "super_usuario") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard/:path*",
    "/buses/:path*",
    "/novedades/:path*",
    "/usuarios",
    "/usuarios/:path*",
    "/configuracion/:path*",
    "/logs/:path*",
    "/reportes/:path*",
    "/notificaciones/:path*",
  ],
}
