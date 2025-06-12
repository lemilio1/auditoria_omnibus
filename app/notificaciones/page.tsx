"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, Trash2, AlertTriangle, Info, CheckCircle, Clock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

interface Notificacion {
  id: number
  titulo: string
  mensaje: string
  tipo: "info" | "warning" | "success" | "error"
  leida: boolean
  fecha: string
  accion?: string
  enlace?: string
}

const notificacionesDemo: Notificacion[] = [
  {
    id: 1,
    titulo: "Revisión técnica vencida",
    mensaje: "El bus 001 tiene la revisión técnica vencida. Se requiere acción inmediata.",
    tipo: "error",
    leida: false,
    fecha: "2024-01-15T10:30:00Z",
    accion: "Ver detalles",
    enlace: "/buses/001",
  },
  {
    id: 2,
    titulo: "Mantenimiento completado",
    mensaje: "El mantenimiento programado del bus 002 ha sido completado exitosamente.",
    tipo: "success",
    leida: false,
    fecha: "2024-01-14T16:45:00Z",
  },
  {
    id: 3,
    titulo: "Próximo mantenimiento",
    mensaje: "El bus 003 tiene mantenimiento programado para mañana a las 08:00.",
    tipo: "info",
    leida: true,
    fecha: "2024-01-14T09:15:00Z",
  },
  {
    id: 4,
    titulo: "Combustible bajo",
    mensaje: "El bus 001 reporta nivel de combustible bajo durante la ruta.",
    tipo: "warning",
    leida: false,
    fecha: "2024-01-13T14:20:00Z",
  },
  {
    id: 5,
    titulo: "Nuevo usuario registrado",
    mensaje: "Se ha registrado un nuevo usuario en el sistema: María González.",
    tipo: "info",
    leida: true,
    fecha: "2024-01-12T11:30:00Z",
  },
]

export default function NotificacionesPage() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>(notificacionesDemo)
  const [activeTab, setActiveTab] = useState("todas")
  const { toast } = useToast()

  const filteredNotificaciones = notificaciones.filter((notif) => {
    if (activeTab === "todas") return true
    if (activeTab === "no_leidas") return !notif.leida
    if (activeTab === "leidas") return notif.leida
    return true
  })

  const getTipoIcon = (tipo: string) => {
    const iconos = {
      info: Info,
      warning: AlertTriangle,
      success: CheckCircle,
      error: AlertTriangle,
    }
    return iconos[tipo as keyof typeof iconos] || Info
  }

  const getTipoBadge = (tipo: string) => {
    const tipos = {
      info: { label: "Info", variant: "outline" as const },
      warning: { label: "Advertencia", variant: "secondary" as const },
      success: { label: "Éxito", variant: "default" as const },
      error: { label: "Error", variant: "destructive" as const },
    }
    const info = tipos[tipo as keyof typeof tipos]
    return <Badge variant={info.variant}>{info.label}</Badge>
  }

  const marcarComoLeida = (id: number) => {
    setNotificaciones((prev) => prev.map((notif) => (notif.id === id ? { ...notif, leida: true } : notif)))
    toast({
      title: "Notificación marcada como leída",
    })
  }

  const eliminarNotificacion = (id: number) => {
    setNotificaciones((prev) => prev.filter((notif) => notif.id !== id))
    toast({
      title: "Notificación eliminada",
    })
  }

  const marcarTodasComoLeidas = () => {
    setNotificaciones((prev) => prev.map((notif) => ({ ...notif, leida: true })))
    toast({
      title: "Todas las notificaciones marcadas como leídas",
    })
  }

  const noLeidasCount = notificaciones.filter((n) => !n.leida).length

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notificaciones</h1>
          <p className="text-muted-foreground">Centro de notificaciones del sistema</p>
        </div>
        {noLeidasCount > 0 && (
          <Button onClick={marcarTodasComoLeidas} variant="outline">
            <Check className="h-4 w-4 mr-2" />
            Marcar todas como leídas
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaciones
            {noLeidasCount > 0 && <Badge variant="destructive">{noLeidasCount}</Badge>}
          </CardTitle>
          <CardDescription>Mantenga un seguimiento de todas las notificaciones del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="todas" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="todas">
                Todas
                <Badge variant="secondary" className="ml-2">
                  {notificaciones.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="no_leidas">
                No leídas
                <Badge variant="destructive" className="ml-2">
                  {noLeidasCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="leidas">
                Leídas
                <Badge variant="outline" className="ml-2">
                  {notificaciones.length - noLeidasCount}
                </Badge>
              </TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-4">
              <div className="space-y-4">
                {filteredNotificaciones.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No hay notificaciones</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      No se encontraron notificaciones en esta categoría
                    </p>
                  </div>
                ) : (
                  filteredNotificaciones.map((notificacion) => {
                    const Icon = getTipoIcon(notificacion.tipo)
                    return (
                      <Card
                        key={notificacion.id}
                        className={`transition-all ${!notificacion.leida ? "border-l-4 border-l-primary bg-muted/30" : ""}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <Icon
                                className={`h-5 w-5 mt-0.5 ${
                                  notificacion.tipo === "error"
                                    ? "text-red-500"
                                    : notificacion.tipo === "warning"
                                      ? "text-yellow-500"
                                      : notificacion.tipo === "success"
                                        ? "text-green-500"
                                        : "text-blue-500"
                                }`}
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className={`font-medium ${!notificacion.leida ? "font-semibold" : ""}`}>
                                    {notificacion.titulo}
                                  </h3>
                                  {getTipoBadge(notificacion.tipo)}
                                  {!notificacion.leida && <Badge variant="outline">Nueva</Badge>}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{notificacion.mensaje}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(notificacion.fecha).toLocaleString()}
                                  </div>
                                  {notificacion.accion && (
                                    <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                                      {notificacion.accion}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {!notificacion.leida && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => marcarComoLeida(notificacion.id)}
                                  title="Marcar como leída"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => eliminarNotificacion(notificacion.id)}
                                title="Eliminar notificación"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
