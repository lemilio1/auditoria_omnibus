"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Save, Database, Bell, Shield, Palette, Globe } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function ConfiguracionPage() {
  const [configuracion, setConfiguracion] = useState({
    // Configuración general
    nombreEmpresa: "ONVIA Transport",
    emailContacto: "contacto@onvia.com",
    telefonoContacto: "+54 11 1234-5678",
    direccion: "Av. Principal 123, Buenos Aires",

    // Notificaciones
    notificacionesEmail: true,
    notificacionesPush: true,
    notificacionesMantenimiento: true,
    notificacionesIncidentes: true,

    // Sistema
    backupAutomatico: true,
    frecuenciaBackup: "diario",
    retencionLogs: "30",
    timeoutSesion: "60",

    // Seguridad
    autenticacionDosFactor: false,
    complejidadPassword: "media",
    intentosLogin: "3",
    bloqueoTemporal: "15",
  })

  const { toast } = useToast()

  const handleSave = (seccion: string) => {
    toast({
      title: "Configuración guardada",
      description: `La configuración de ${seccion} ha sido guardada exitosamente`,
    })
  }

  const updateConfiguracion = (key: string, value: any) => {
    setConfiguracion((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">Gestione la configuración del sistema</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
          <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
          <TabsTrigger value="apariencia">Apariencia</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Información General
              </CardTitle>
              <CardDescription>Configuración básica de la empresa y contacto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombreEmpresa">Nombre de la Empresa</Label>
                  <Input
                    id="nombreEmpresa"
                    value={configuracion.nombreEmpresa}
                    onChange={(e) => updateConfiguracion("nombreEmpresa", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailContacto">Email de Contacto</Label>
                  <Input
                    id="emailContacto"
                    type="email"
                    value={configuracion.emailContacto}
                    onChange={(e) => updateConfiguracion("emailContacto", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefonoContacto">Teléfono de Contacto</Label>
                  <Input
                    id="telefonoContacto"
                    value={configuracion.telefonoContacto}
                    onChange={(e) => updateConfiguracion("telefonoContacto", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Textarea
                  id="direccion"
                  value={configuracion.direccion}
                  onChange={(e) => updateConfiguracion("direccion", e.target.value)}
                />
              </div>
              <Button onClick={() => handleSave("general")} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Guardar Configuración General
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificaciones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configuración de Notificaciones
              </CardTitle>
              <CardDescription>Gestione cómo y cuándo recibir notificaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones por Email</Label>
                    <p className="text-sm text-muted-foreground">Recibir notificaciones importantes por correo</p>
                  </div>
                  <Switch
                    checked={configuracion.notificacionesEmail}
                    onCheckedChange={(checked) => updateConfiguracion("notificacionesEmail", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones Push</Label>
                    <p className="text-sm text-muted-foreground">Notificaciones en tiempo real en el navegador</p>
                  </div>
                  <Switch
                    checked={configuracion.notificacionesPush}
                    onCheckedChange={(checked) => updateConfiguracion("notificacionesPush", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertas de Mantenimiento</Label>
                    <p className="text-sm text-muted-foreground">Notificar sobre mantenimientos programados</p>
                  </div>
                  <Switch
                    checked={configuracion.notificacionesMantenimiento}
                    onCheckedChange={(checked) => updateConfiguracion("notificacionesMantenimiento", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertas de Incidentes</Label>
                    <p className="text-sm text-muted-foreground">Notificar sobre incidentes críticos</p>
                  </div>
                  <Switch
                    checked={configuracion.notificacionesIncidentes}
                    onCheckedChange={(checked) => updateConfiguracion("notificacionesIncidentes", checked)}
                  />
                </div>
              </div>
              <Button onClick={() => handleSave("notificaciones")} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Guardar Configuración de Notificaciones
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sistema" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Configuración del Sistema
              </CardTitle>
              <CardDescription>Configuración técnica y de mantenimiento del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Backup Automático</Label>
                    <p className="text-sm text-muted-foreground">Realizar copias de seguridad automáticas</p>
                  </div>
                  <Switch
                    checked={configuracion.backupAutomatico}
                    onCheckedChange={(checked) => updateConfiguracion("backupAutomatico", checked)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="frecuenciaBackup">Frecuencia de Backup</Label>
                    <Select
                      value={configuracion.frecuenciaBackup}
                      onValueChange={(value) => updateConfiguracion("frecuenciaBackup", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diario">Diario</SelectItem>
                        <SelectItem value="semanal">Semanal</SelectItem>
                        <SelectItem value="mensual">Mensual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retencionLogs">Retención de Logs (días)</Label>
                    <Input
                      id="retencionLogs"
                      type="number"
                      value={configuracion.retencionLogs}
                      onChange={(e) => updateConfiguracion("retencionLogs", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeoutSesion">Timeout de Sesión (minutos)</Label>
                    <Input
                      id="timeoutSesion"
                      type="number"
                      value={configuracion.timeoutSesion}
                      onChange={(e) => updateConfiguracion("timeoutSesion", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSave("sistema")} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Guardar Configuración del Sistema
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguridad" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configuración de Seguridad
              </CardTitle>
              <CardDescription>Configuración de seguridad y autenticación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autenticación de Dos Factores</Label>
                    <p className="text-sm text-muted-foreground">Requerir verificación adicional al iniciar sesión</p>
                  </div>
                  <Switch
                    checked={configuracion.autenticacionDosFactor}
                    onCheckedChange={(checked) => updateConfiguracion("autenticacionDosFactor", checked)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="complejidadPassword">Complejidad de Contraseña</Label>
                    <Select
                      value={configuracion.complejidadPassword}
                      onValueChange={(value) => updateConfiguracion("complejidadPassword", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baja">Baja</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="intentosLogin">Intentos de Login</Label>
                    <Input
                      id="intentosLogin"
                      type="number"
                      value={configuracion.intentosLogin}
                      onChange={(e) => updateConfiguracion("intentosLogin", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloqueoTemporal">Bloqueo Temporal (minutos)</Label>
                    <Input
                      id="bloqueoTemporal"
                      type="number"
                      value={configuracion.bloqueoTemporal}
                      onChange={(e) => updateConfiguracion("bloqueoTemporal", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSave("seguridad")} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Guardar Configuración de Seguridad
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apariencia" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Configuración de Apariencia
              </CardTitle>
              <CardDescription>Personalice la apariencia del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tema</Label>
                  <Select defaultValue="light">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Oscuro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <Select defaultValue="es">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Zona Horaria</Label>
                  <Select defaultValue="america/argentina/buenos_aires">
                    <SelectTrigger className="w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america/argentina/buenos_aires">Buenos Aires (GMT-3)</SelectItem>
                      <SelectItem value="america/sao_paulo">São Paulo (GMT-3)</SelectItem>
                      <SelectItem value="america/santiago">Santiago (GMT-3)</SelectItem>
                      <SelectItem value="america/montevideo">Montevideo (GMT-3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={() => handleSave("apariencia")} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Guardar Configuración de Apariencia
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
