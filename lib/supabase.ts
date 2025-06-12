"use client"

import { createClient } from "@supabase/supabase-js"
import { DemoAuth, DemoDatabase } from "./auth-demo"

// Verificar si estamos en modo demo (sin variables de Supabase válidas)
function isDemoMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Si no hay variables o no son válidas, usar modo demo
  return !url || !key || !url.startsWith("http") || url.includes("your-project") || key.includes("your-anon-key")
}

// Variable global para almacenar la instancia del cliente real
let supabaseClient: ReturnType<typeof createClient> | null = null

// Cliente unificado que funciona tanto en modo demo como con Supabase real
export function getSupabase() {
  const isDemo = isDemoMode()

  console.log(isDemo ? "🎭 Usando modo demostración" : "🔗 Intentando usar Supabase real")

  // Si estamos en modo demo, usar la implementación simulada
  if (isDemo) {
    return {
      auth: {
        signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
          return DemoAuth.signIn(email, password)
        },

        signOut: async () => {
          return DemoAuth.signOut()
        },

        getSession: async () => {
          return DemoAuth.getSession()
        },

        onAuthStateChange: (callback: Function) => {
          return DemoAuth.onAuthStateChange(callback as any)
        },
      },

      from: (table: string) => ({
        select: (columns = "*") => ({
          eq: (column: string, value: any) => ({
            single: async () => {
              if (table === "user_profiles") {
                return DemoDatabase.getUserProfile(value)
              }
              return { data: null, error: { message: "Tabla no encontrada en modo demo" } }
            },
          }),

          order: (column: string, options?: any) => ({
            async then(resolve: Function) {
              if (table === "buses") {
                const result = await DemoDatabase.getBuses()
                resolve(result)
              } else {
                resolve({ data: [], error: null })
              }
            },
          }),
        }),

        insert: (data: any) => ({
          select: (columns?: string) => ({
            single: async () => {
              if (table === "user_profiles") {
                return DemoDatabase.createUserProfile(data)
              }
              return { data: { ...data, id: "demo-" + Date.now() }, error: null }
            },
          }),
        }),
      }),
    }
  }

  // Si no estamos en modo demo, intentar usar Supabase real
  try {
    // Si ya tenemos un cliente, devolverlo
    if (supabaseClient) {
      return supabaseClient
    }

    // Intentar crear un cliente real
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    // Crear un cliente simulado si no podemos crear uno real
    if (!url || !key) {
      console.warn("⚠️ Variables de Supabase no disponibles. Usando cliente simulado.")
      return createDemoClient()
    }

    // Crear cliente real
    supabaseClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })

    return supabaseClient
  } catch (error) {
    console.error("❌ Error al crear cliente de Supabase:", error)
    console.warn("Usando cliente simulado como fallback")

    // En caso de error, usar cliente simulado
    return createDemoClient()
  }
}

// Función para crear un cliente simulado
function createDemoClient() {
  return {
    auth: {
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        return DemoAuth.signIn(email, password)
      },
      signOut: async () => {
        return DemoAuth.signOut()
      },
      getSession: async () => {
        return DemoAuth.getSession()
      },
      onAuthStateChange: (callback: Function) => {
        return DemoAuth.onAuthStateChange(callback as any)
      },
    },
    from: (table: string) => ({
      select: (columns = "*") => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            if (table === "user_profiles") {
              return DemoDatabase.getUserProfile(value)
            }
            return { data: null, error: { message: "Tabla no encontrada en modo demo" } }
          },
        }),
        order: (column: string, options?: any) => ({
          async then(resolve: Function) {
            if (table === "buses") {
              const result = await DemoDatabase.getBuses()
              resolve(result)
            } else {
              resolve({ data: [], error: null })
            }
          },
        }),
      }),
      insert: (data: any) => ({
        select: (columns?: string) => ({
          single: async () => {
            if (table === "user_profiles") {
              return DemoDatabase.createUserProfile(data)
            }
            return { data: { ...data, id: "demo-" + Date.now() }, error: null }
          },
        }),
      }),
    }),
  }
}

// Función para verificar el estado de la configuración
export function getSupabaseStatus() {
  const isDemo = isDemoMode()

  return {
    isDemoMode: isDemo,
    hasValidConfig: !isDemo,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "No configurada",
    keyConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }
}
