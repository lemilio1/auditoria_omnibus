"use client"

import { createClient } from "@supabase/supabase-js"

// Singleton para el cliente de Supabase
let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Variables de entorno de Supabase no configuradas")
    throw new Error("Supabase no está configurado correctamente")
  }

  // Crear cliente de Supabase
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

  return supabaseClient
}

// Función para verificar el estado de la configuración de Supabase
export function getSupabaseStatus() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Verificar si las variables de entorno están configuradas correctamente
  const isConfigured = !!(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("http") &&
    !supabaseUrl.includes("your-project") &&
    !supabaseAnonKey.includes("your-anon-key")
  )

  return {
    isDemoMode: !isConfigured,
    hasValidConfig: isConfigured,
    url: supabaseUrl || "No configurada",
    keyConfigured: !!supabaseAnonKey,
  }
}
