"use client"

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bus, FileText, Bell, FileBarChart } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const router = useRouter()
  const supabase = getSupabase()

  useEffect(() => {
    async function getUser() {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        setSessionInfo(sessionData)

        if (sessionError) {
          console.error("Error al obtener sesión:", sessionError)
          setError(`Error de sesión: ${sessionError.message}`)
          return
        }

        if (!sessionData.session) {
          console.log("No hay sesión activa, redirigiendo a login")
          window.location.href = "/login"
          return
        }

        const userId = sessionData.session.user.id
        console.log("ID de usuario autenticado:", userId)

        // Intentar crear un perfil básico si no existe
        const { data: existingProfiles, error: checkError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", userId)

        if (checkError) {
          console.error("Error al verificar perfil existente:", checkError)
          setError(`Error al verificar perfil: ${checkError.message}`)
          return
        }

        if (!existingProfiles || existingProfiles.length === 0) {
          console.log("No se encontró perfil, intentando crear uno básico")

          // Obtener el email del usuario desde la sesión
          const userEmail = sessionData.session.user.email

          // Crear un perfil básico
          const { data: newProfile, error: insertError } = await supabase
            .from("user_profiles")
            .insert([
              {
                id: userId,
                email: userEmail,
                name: userEmail?.split("@")[0] || "Usuario",
                role: "visitante",
                is_active: true,
                created_at: new Date().toISOString(),
              },
            ])
            .select()

          if (insertError) {
            console.error("Error al crear perfil básico:", insertError)
            setError(`Error al crear perfil: ${insertError.message}`)
            return
          }

          if (newProfile && newProfile.length > 0) {
            console.log("Perfil básico creado:", newProfile[0])
            setUser(newProfile[0])
          } else {
            setError("No se pudo crear un perfil básico")
          }
        } else {
          console.log("Perfil encontrado:", existingProfiles[0])
          setUser(existingProfiles[0])
        }
      } catch (error: any) {
        console.error("Error inesperado:", error)
        setError(`Error inesperado: ${error.message}`)
      } finally {
        setIsLoading(false)
      }
    }

    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No se pudo cargar el perfil</CardTitle>
            <CardDescription>
              Se ha detectado una sesión activa pero no se pudo cargar el perfil del usuario.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">{error}</div>
            )}
            {sessionInfo && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800 text-sm">
                <p>Información de sesión:</p>
                <pre className="mt-2 text-xs overflow-auto">{JSON.stringify(sessionInfo, null, 2)}</pre>
              </div>
            )}
            <Button onClick={() => (window.location.href = "/login")} className="w-full">
              Volver al login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 overflow-auto p-4 md:p-6 pt-20 md:pt-24 md:ml-16">
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
                      <Button className="h-auto py-4 justify-start" variant="outline">
                        <Bus className="h-5 w-5 mr-2" />
                        <div className="text-left">
                          <div className="font-medium">Buses</div>
                          <div className="text-xs text-muted-foreground">Gestionar flota</div>
                        </div>
                      </Button>
                      <Button className="h-auto py-4 justify-start" variant="outline">
                        <FileText className="h-5 w-5 mr-2" />
                        <div className="text-left">
                          <div className="font-medium">Novedades</div>
                          <div className="text-xs text-muted-foreground">Ver novedades</div>
                        </div>
                      </Button>
                      <Button className="h-auto py-4 justify-start" variant="outline">
                        <Bell className="h-5 w-5 mr-2" />
                        <div className="text-left">
                          <div className="font-medium">Notificaciones</div>
                          <div className="text-xs text-muted-foreground">Ver notificaciones</div>
                        </div>
                      </Button>
                      <Button className="h-auto py-4 justify-start" variant="outline">
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

              <div className="mt-8">
                <Button variant="destructive" onClick={handleSignOut}>
                  Cerrar sesión
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
