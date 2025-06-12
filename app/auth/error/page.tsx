"use client"

import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { AuthErrorContent } from "./auth-error-content"

export default function AuthErrorPage() {
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
          <Suspense
            fallback={
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">Cargando detalles del error...</div>
            }
          >
            <AuthErrorContent />
          </Suspense>
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
