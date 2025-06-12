"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Bus, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { getSupabase, getSupabaseStatus } from "@/lib/supabase"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("admin@onvia.com")
  const [password, setPassword] = useState("admin123")
  const [supabaseStatus, setSupabaseStatus] = useState<any>(null)
  const { toast } = useToast()
  const supabase = getSupabase()

  useEffect(() => {
    const status = getSupabaseStatus()
    setSupabaseStatus(status)

    if (status.isDemoMode) {
      toast({
        title: "Modo Demostración",
        description: "Usando sistema de autenticación simulado para demostración.",
      })
    }
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("Intentando iniciar sesión con:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })

      console.log("Resultado del login:", { data, error })

      if (error) {
        console.error("Error de autenticación:", error)
        toast({
          variant: "destructive",
          title: "Error al iniciar sesión",
          description: error.message,
        })
        return
      }

      if (data.user) {
        console.log("Usuario autenticado exitosamente:", data.user.id)

        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido al sistema ONVIA",
        })

        // Redirigir al dashboard
        setTimeout(() => {
          window.location.href = "/"
        }, 1000)
      }
    } catch (err: any) {
      console.error("Error inesperado:", err)
      toast({
        variant: "destructive",
        title: "Error de conexión",
        description: "No se pudo procesar la solicitud de inicio de sesión.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-muted/40">
      <div className="flex items-center justify-center mb-8">
        <Bus className="h-10 w-10 md:h-12 md:w-12 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold ml-2">ONVIA</h1>
      </div>

      {supabaseStatus?.isDemoMode && (
        <Alert className="w-full max-w-md mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Modo Demostración:</strong> Sistema completamente funcional con datos simulados.
          </AlertDescription>
        </Alert>
      )}

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>
            {supabaseStatus?.isDemoMode
              ? "Modo demostración - Use las credenciales de prueba"
              : "Ingrese sus credenciales para acceder al sistema"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@onvia.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>
                <strong>Credenciales de prueba:</strong>
              </p>
              <p>Email: admin@onvia.com</p>
              <p>Contraseña: admin123</p>
              {supabaseStatus?.isDemoMode && (
                <p className="mt-2 text-xs">
                  <strong>También disponible:</strong>
                  <br />
                  user@onvia.com / user123
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
