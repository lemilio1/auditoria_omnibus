import { createServerClient as createServerClientSupabase } from "@supabase/ssr"
import { cookies } from "next/headers"
import { getSupabaseClient } from "./singleton"

export function createServerClient(cookieStore: ReturnType<typeof cookies>) {
  return createServerClientSupabase(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
}

export async function getServerSession() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

export async function getUserProfile(userId: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error al obtener perfil de usuario:", error)
    return null
  }

  return data
}

export async function getUserPermissions(userId: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const { data, error } = await supabase.from("user_permissions").select("permissions").eq("user_id", userId).single()

  if (error) {
    console.error("Error al obtener permisos de usuario:", error)
    return {}
  }

  return data.permissions
}

// Exportamos también el cliente singleton para uso en el servidor si es necesario
export { getSupabaseClient }
