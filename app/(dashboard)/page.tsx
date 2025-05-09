"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bus, FileText, Bell, FileBarChart } from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push("/login")
        return
      }

      const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", data.session.user.id).single()

      setUser(profile)
      setIsLoading(false)
    }

    getUser()
  }, [router, supabase])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido, {user?.name || "Usuario"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Buses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">+2 desde el último mes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Novedades Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground mt-1">-3 desde la semana pasada</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Notificaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">5 sin leer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reportes Generados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground mt-1">+8 desde el último mes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Accesos Rápidos</CardTitle>
            <CardDescription>Accede rápidamente a las funciones más utilizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => router.push("/buses")} className="h-auto py-4 justify-start" variant="outline">
                <Bus className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Buses</div>
                  <div className="text-xs text-muted-foreground">Gestionar flota</div>
                </div>
              </Button>
              <Button onClick={() => router.push("/novedades")} className="h-auto py-4 justify-start" variant="outline">
                <FileText className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Novedades</div>
                  <div className="text-xs text-muted-foreground">Ver novedades</div>
                </div>
              </Button>
              <Button
                onClick={() => router.push("/notificaciones")}
                className="h-auto py-4 justify-start"
                variant="outline"
              >
                <Bell className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Notificaciones</div>
                  <div className="text-xs text-muted-foreground">Ver notificaciones</div>
                </div>
              </Button>
              <Button onClick={() => router.push("/reportes")} className="h-auto py-4 justify-start" variant="outline">
                <FileBarChart className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Reportes</div>
                  <div className="text-xs text-muted-foreground">Generar reportes</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas actividades en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Bus className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Nuevo bus agregado</p>
                  <p className="text-xs text-muted-foreground">Bus #1234 - Mercedes Benz</p>
                  <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Novedad reportada</p>
                  <p className="text-xs text-muted-foreground">Bus #5678 - Problema en puerta trasera</p>
                  <p className="text-xs text-muted-foreground">Hace 5 horas</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Bell className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Notificación enviada</p>
                  <p className="text-xs text-muted-foreground">Mantenimiento programado para mañana</p>
                  <p className="text-xs text-muted-foreground">Hace 1 día</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
