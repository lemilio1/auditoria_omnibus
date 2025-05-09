"use client"

import { createClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"

// Variable para almacenar la instancia del cliente
let supabaseClient: SupabaseClient | null = null

export function getBrowserClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  supabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      persistSession: true,
      storageKey: "onvia-auth-storage-key",
    },
  })

  return supabaseClient
}
