"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getSupabase, getSupabaseStatus } from "@/lib/supabase"

interface AuthWrapperProps {
  children: React.ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = getSupabase()
  const { isDemoMode } = getSupabaseStatus()

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/login", "/test-auth"]
  const isPublicRoute = publicRoutes.includes(pathname)

  useEffect(() => {
    async function checkAuth() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        console.log("Verificando autenticación:", { session: !!session, error, pathname })

        if (error) {
          console.error("Error al verificar sesión:", error)
          setIsAuthenticated(false)
        } else {
          setIsAuthenticated(!!session)
        }

        // Si estamos en una ruta pública y hay sesión, redirigir al dashboard
        if (session && isPublicRoute) {
          console.log("Usuario autenticado en ruta pública, redirigiendo...")
          router.push("/")
          return
        }

        // Si estamos en una ruta privada y no hay sesión, redirigir al login
        if (!session && !isPublicRoute) {
          console.log("Usuario no autenticado en ruta privada, redirigiendo al login...")
          router.push("/login")
          return
        }
      } catch (error) {
        console.error("Error inesperado al verificar autenticación:", error)
        setIsAuthenticated(false)
        if (!isPublicRoute) {
          router.push("/login")
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Configurar listener para cambios de autenticación
    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        console.log("Cambio en estado de autenticación:", event, !!session)
        setIsAuthenticated(!!session)

        if (event === "SIGNED_IN" && session) {
          console.log("Usuario se ha autenticado, redirigiendo...")
          router.push("/")
        } else if (event === "SIGNED_OUT") {
          console.log("Usuario se ha desconectado, redirigiendo al login...")
          router.push("/login")
        }
      })

      return () => {
        try {
          subscription?.unsubscribe()
        } catch (error) {
          console.error("Error al desuscribirse:", error)
        }
      }
    } catch (error) {
      console.error("Error al configurar listener de autenticación:", error)
      // Continuar sin el listener
    }
  }, [supabase, router, pathname, isPublicRoute])

  // Mostrar loading mientras verificamos la autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Si es una ruta pública, mostrar el contenido
  if (isPublicRoute) {
    return <>{children}</>
  }

  // Si es una ruta privada y el usuario está autenticado, mostrar el contenido
  if (isAuthenticated) {
    return <>{children}</>
  }

  // Si llegamos aquí, mostrar loading (mientras se redirige)
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  )
}
