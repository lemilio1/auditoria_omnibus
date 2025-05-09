"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-provider"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: string[]
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole = [] }) => {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (!isLoading && user && requiredRole.length > 0) {
      // Verificar si el usuario tiene el rol requerido
      if (!requiredRole.includes(user.role)) {
        router.push("/")
      }
    }
  }, [isLoading, user, router, requiredRole])

  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Si no está cargando y hay un usuario, mostrar el contenido
  if (!isLoading && user) {
    return <>{children}</>
  }

  // No mostrar nada mientras se redirige
  return null
}

export default AuthGuard
