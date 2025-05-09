import { createClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"

// Declaramos la variable global para el cliente
const globalForSupabase = global as unknown as {
  supabase: SupabaseClient | undefined
}

// Función para obtener el cliente de Supabase
export const getSupabaseClient = () => {
  // Si ya existe un cliente en el entorno global, lo devolvemos
  if (typeof window === "undefined") {
    // Servidor: Siempre creamos una nueva instancia
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storageKey: "onvia-auth-storage-key",
      },
    })
  } else {
    // Cliente: Usamos el singleton
    if (!globalForSupabase.supabase) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

      globalForSupabase.supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          storageKey: "onvia-auth-storage-key",
        },
      })
    }

    return globalForSupabase.supabase
  }
}
