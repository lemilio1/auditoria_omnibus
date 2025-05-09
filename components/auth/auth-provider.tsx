"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import getSupabase from "@/lib/supabase-browser"

type UserProfile = {
  id: string
  email: string
  name: string
  role: string
  is_active: boolean
}

type AuthContextType = {
  user: UserProfile | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = getSupabase()

  useEffect(() => {
    // Función para obtener el usuario actual
    async function getUser() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          setUser(null)
          setIsLoading(false)
          return
        }

        // Obtener el perfil del usuario
        const { data } = await supabase.from("user_profiles").select("*").eq("id", session.user.id).single()

        if (data) {
          setUser(data as UserProfile)
        }
      } catch (error) {
        console.error("Error al obtener el usuario:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Obtener el usuario al cargar el componente
    getUser()

    // Suscribirse a cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Obtener el perfil del usuario
        const { data } = await supabase.from("user_profiles").select("*").eq("id", session.user.id).single()

        if (data) {
          setUser(data as UserProfile)
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }
    })

    // Limpiar la suscripción al desmontar el componente
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

  // Función para cerrar sesión
  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, isLoading, signOut }}>{children}</AuthContext.Provider>
}
