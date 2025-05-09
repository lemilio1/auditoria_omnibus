"use client"

import { createClient } from "@supabase/supabase-js"

// Creamos una variable para almacenar la instancia del cliente
let supabase: ReturnType<typeof createClient> | undefined = undefined

// Función para obtener el cliente de Supabase
export default function getSupabase() {
  if (supabase) return supabase

  // Si no existe, creamos uno nuevo
  supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      persistSession: true,
      storageKey: "onvia-auth-storage-key",
      autoRefreshToken: true,
    },
  })

  return supabase
}
