"use server"

import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

interface CreateUserParams {
  email: string
  password: string
  name: string
  role: string
  permissions: Record<string, boolean>
}

export async function createUser(params: CreateUserParams) {
  const { email, password, name, role, permissions } = params
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  try {
    // 1. Crear el usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) {
      return { error: authError.message }
    }

    const userId = authData.user.id

    // 2. Crear el perfil del usuario
    const { error: profileError } = await supabase.from("user_profiles").insert({
      id: userId,
      email,
      name,
      role,
      created_at: new Date().toISOString(),
      is_active: true,
    })

    if (profileError) {
      // Si hay un error, intentar eliminar el usuario de auth
      await supabase.auth.admin.deleteUser(userId)
      return { error: profileError.message }
    }

    // 3. Crear los permisos del usuario
    const { error: permissionsError } = await supabase.from("user_permissions").insert({
      user_id: userId,
      permissions,
    })

    if (permissionsError) {
      // Si hay un error, intentar limpiar
      await supabase.from("user_profiles").delete().eq("id", userId)
      await supabase.auth.admin.deleteUser(userId)
      return { error: permissionsError.message }
    }

    // 4. Registrar la acción en los logs
    await supabase.from("system_logs").insert({
      action: "create_user",
      description: `Usuario ${name} (${email}) creado con rol ${role}`,
      user_id: null, // Se podría obtener el ID del usuario actual si es necesario
      user_name: "Sistema",
      fecha_creacion: new Date().toISOString(),
    })

    return { success: true, userId }
  } catch (error: any) {
    console.error("Error al crear usuario:", error)
    return { error: error.message || "Error al crear usuario" }
  }
}
