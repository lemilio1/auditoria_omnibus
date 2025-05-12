"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabase } from "@/lib/supabase"

export default function TestAuthPage() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [apiResult, setApiResult] = useState<any>(null)
  const [isApiLoading, setIsApiLoading] = useState(false)
  const supabase = getSupabase()

  const testAuth = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "admin@onvia.com",
        password: "admin123",
      })

      if (error) {
        setResult({ success: false, error: error.message })
      } else {
        // Verificar si el usuario existe en la tabla user_profiles
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", data.user.id)
          .single()

        if (profileError) {
          setResult({ success: false, error: "Usuario autenticado pero no se encontró el perfil" })
        } else {
          setResult({
            success: true,
            message: "Autenticación exitosa",
            user: data.user,
            profile,
          })
        }
      }
    } catch (error: any) {
      setResult({ success: false, error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const testApiAuth = async () => {
    setIsApiLoading(true)
    try {
      const response = await fetch("/api/test-auth")
      const data = await response.json()
      setApiResult(data)
    } catch (error: any) {
      setApiResult({ success: false, error: error.message })
    } finally {
      setIsApiLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Prueba de Autenticación</CardTitle>
          <CardDescription>Prueba la autenticación con Supabase</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Button onClick={testAuth} disabled={isLoading} className="flex-1">
              {isLoading ? "Probando..." : "Probar Autenticación Cliente"}
            </Button>
            <Button onClick={testApiAuth} disabled={isApiLoading} className="flex-1">
              {isApiLoading ? "Probando..." : "Probar Autenticación API"}
            </Button>
          </div>

          {result && (
            <div className="mt-4 p-4 border rounded-md">
              <h3 className="text-lg font-medium mb-2">Resultado Cliente:</h3>
              <pre className="bg-muted p-2 rounded overflow-auto text-xs">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}

          {apiResult && (
            <div className="mt-4 p-4 border rounded-md">
              <h3 className="text-lg font-medium mb-2">Resultado API:</h3>
              <pre className="bg-muted p-2 rounded overflow-auto text-xs">{JSON.stringify(apiResult, null, 2)}</pre>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Esta página prueba la autenticación con las credenciales admin@onvia.com / admin123
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
