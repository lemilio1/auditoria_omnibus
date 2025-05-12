"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Bus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getSupabase } from "@/lib/supabase"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = getSupabase()

  // Verificar si ya hay una sesión activa al cargar la página
  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        console.log("Sesión activa detectada, redirigiendo...")
        window.location.href = "/"
      }
    }

    checkSession()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log("Iniciando sesión con:", email, password)

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.error("Error de inicio de sesión:", signInError)
        setError(signInError.message)
        toast({
          variant: "destructive",
          title: "Error al iniciar sesión",
          description: signInError.message,
        })
        setIsLoading(false)
        return
      }

      console.log("Sesión iniciada correctamente:", data)

      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido al sistema ONVIA",
      })

      // Usar window.location para una redirección forzada
      window.location.href = "/"
    } catch (err: any) {
      console.error("Error inesperado:", err)
      setError(err.message || "Error inesperado")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al iniciar sesión",
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

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>Ingrese sus credenciales para acceder al sistema</CardDescription>
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
              />
            </div>
            {error && <div className="text-sm text-red-500 font-medium">{error}</div>}
            <div className="text-sm text-muted-foreground">
              <p>Credenciales de prueba:</p>
              <p>Email: admin@onvia.com</p>
              <p>Contraseña: admin123</p>
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
