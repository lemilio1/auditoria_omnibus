"use client"

import { createClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"

// Creamos una variable global para almacenar la instancia del cliente
let supabaseInstance: SupabaseClient | null = null

export function createBrowserClient() {
  if (supabaseInstance) return supabaseInstance

  // Si no existe, creamos uno nuevo
  supabaseInstance = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })

  return supabaseInstance
}
