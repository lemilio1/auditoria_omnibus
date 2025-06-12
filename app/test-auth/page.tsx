"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabase } from "@/lib/supabase"

export default function TestAuthPage() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = getSupabase()

  const testConnection = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      console.log("Probando conexión con Supabase...")

      // Probar la conexión básica
      const { data: connectionTest, error: connectionError } = await supabase
        .from("user_profiles")
        .select("count", { count: "exact", head: true })

      if (connectionError) {
        setResult({
          success: false,
          step: "connection",
          error: connectionError.message,
          details: connectionError,
        })
        return
      }

      console.log("Conexión exitosa, probando autenticación...")

      // Probar autenticación
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: "admin@onvia.com",
        password: "admin123",
      })

      if (authError) {
        setResult({
          success: false,
          step: "authentication",
          error: authError.message,
          details: authError,
        })
        return
      }

      console.log("Autenticación exitosa, verificando perfil...")

      // Verificar perfil
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single()

      setResult({
        success: true,
        user: authData.user,
        profile: profile,
        profileError: profileError?.message,
      })
    } catch (error: any) {
      console.error("Error en prueba:", error)
      setResult({
        success: false,
        step: "unexpected",
        error: error.message,
        details: error,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setResult({ success: true, message: "Sesión cerrada exitosamente" })
    } catch (error: any) {
      setResult({ success: false, error: error.message })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Prueba de Autenticación</CardTitle>
          <CardDescription>Prueba la conexión y autenticación con Supabase</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={testConnection} disabled={isLoading}>
              {isLoading ? "Probando..." : "Probar Conexión y Auth"}
            </Button>
            <Button onClick={testSignOut} variant="outline">
              Cerrar Sesión
            </Button>
          </div>

          {result && (
            <div className="mt-4 p-4 border rounded-md">
              <h3 className="text-lg font-medium mb-2">Resultado:</h3>
              <pre className="bg-muted p-2 rounded overflow-auto text-xs whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Esta página prueba la conexión con Supabase y la autenticación con admin@onvia.com / admin123
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
