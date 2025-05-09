import { createClient } from "@supabase/supabase-js"

// Creamos un objeto para almacenar la instancia del cliente
let supabaseClientInstance: ReturnType<typeof createClient> | null = null

// Creamos una función que devuelve el cliente de Supabase
export const getSupabaseClient = () => {
  // Si ya existe un cliente, lo devolvemos
  if (supabaseClientInstance) {
    return supabaseClientInstance
  }

  // Si no existe, creamos uno nuevo
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  // Creamos el cliente y lo guardamos
  supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storageKey: "onvia-auth-storage-key",
    },
  })

  return supabaseClientInstance
}
