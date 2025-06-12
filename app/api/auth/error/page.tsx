"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [errorDescription, setErrorDescription] = useState<string | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get("error")
    const errorDescParam = searchParams.get("error_description")

    setError(errorParam || "Unknown authentication error")
    setErrorDescription(errorDescParam || "An unknown error occurred during authentication")
  }, [searchParams])

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <CardTitle>Error de Autenticación</CardTitle>
          </div>
          <CardDescription>Se ha producido un error durante el proceso de autenticación</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
            <p className="font-medium">{error}</p>
            {errorDescription && <p className="text-sm mt-1">{errorDescription}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => (window.location.href = "/login")} className="w-full">
            Volver al inicio de sesión
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
