"use client"

import { createClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"

// Variable global para almacenar la instancia del cliente
let supabaseClient: SupabaseClient | null = null

// Función para obtener el cliente de Supabase
export function getSupabase() {
  if (supabaseClient) {
    return supabaseClient
  }

  // Si no existe, creamos uno nuevo
  supabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })

  return supabaseClient
}
