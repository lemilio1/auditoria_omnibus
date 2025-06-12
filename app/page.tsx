"use client"

import { useEffect, useState } from "react"
import { getSupabase, getSupabaseStatus } from "@/lib/supabase"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bus, FileText, Bell, FileBarChart } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const supabase = getSupabase()

  useEffect(() => {
    async function getUser() {
      try {
        const status = getSupabaseStatus()
        setIsDemoMode(status.isDemoMode)

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionError || !sessionData.session) {
          console.log("No hay sesión activa")
          setIsLoading(false)
          return
        }

        const userId = sessionData.session.user.id
        console.log("Usuario autenticado:", userId)

        // En modo demo, el usuario ya viene en la sesión
        if (status.isDemoMode) {
          setUser(sessionData.session.user)
        } else {
          // Aquí iría la lógica para Supabase real
          const { data: profile, error: profileError } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", userId)
            .single()

          if (profileError) {
            console.error("Error al obtener perfil:", profileError)
            setUser(sessionData.session.user)
          } else {
            setUser(profile)
          }
        }
      } catch (error: any) {
        console.error("Error al obtener usuario:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
              {isDemoMode && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Modo Demostración:</strong> Sistema completamente funcional con datos simulados.
                  </AlertDescription>
                </Alert>
              )}

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
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground mt-1">Datos de demostración</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Novedades Pendientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2</div>
                    <p className="text-xs text-muted-foreground mt-1">Datos de demostración</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Notificaciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <p className="text-xs text-muted-foreground mt-1">Datos de demostración</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Reportes Generados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground mt-1">Datos de demostración</p>
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
                    <CardTitle>Información del Usuario</CardTitle>
                    <CardDescription>Detalles de tu cuenta</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p>
                        <strong>Nombre:</strong> {user?.name || "N/A"}
                      </p>
                      <p>
                        <strong>Email:</strong> {user?.email || "N/A"}
                      </p>
                      <p>
                        <strong>Rol:</strong> {user?.role || "N/A"}
                      </p>
                      <p>
                        <strong>Estado:</strong> {user?.is_active ? "Activo" : "Inactivo"}
                      </p>
                      {isDemoMode && (
                        <p className="text-sm text-muted-foreground">
                          <strong>Modo:</strong> Demostración
                        </p>
                      )}
                    </div>
                    <Button variant="destructive" onClick={handleSignOut} className="mt-4">
                      Cerrar sesión
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
