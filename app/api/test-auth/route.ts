import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Crear un cliente de Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Intentar iniciar sesión con las credenciales de prueba
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "admin@onvia.com",
      password: "admin123",
    })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    // Verificar si el usuario existe en la tabla user_profiles
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", data.user.id)
      .single()

    if (profileError) {
      return NextResponse.json(
        { success: false, error: "Usuario autenticado pero no se encontró el perfil" },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Autenticación exitosa",
      user: data.user,
      profile,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
