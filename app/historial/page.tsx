"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { History, Search, Calendar, User, Activity, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface HistorialEntry {
  id: number
  fecha: string
  usuario: string
  accion: string
  modulo: string
  descripcion: string
  detalles?: string
  ip?: string
}

const historialDemo: HistorialEntry[] = [
  {
    id: 1,
    fecha: "2024-01-15T14:30:00Z",
    usuario: "admin@onvia.com",
    accion: "Crear",
    modulo: "Novedades",
    descripcion: "Creó una nueva novedad para el bus 001",
    detalles: "Novedad: Revisión técnica vencida",
    ip: "192.168.1.100",
  },
  {
    id: 2,
    fecha: "2024-01-15T13:45:00Z",
    usuario: "admin@onvia.com",
    accion: "Actualizar",
    modulo: "Buses",
    descripcion: "Actualizó el estado del bus 002",
    detalles: "Estado cambiado de 'activo' a 'mantenimiento'",
    ip: "192.168.1.100",
  },
  {
    id: 3,
    fecha: "2024-01-15T12:20:00Z",
    usuario: "user@onvia.com",
    accion: "Ver",
    modulo: "Reportes",
    descripcion: "Generó reporte de estado de flota",
    detalles: "Reporte PDF generado exitosamente",
    ip: "192.168.1.105",
  },
  {
    id: 4,
    fecha: "2024-01-15T11:15:00Z",
    usuario: "admin@onvia.com",
    accion: "Crear",
    modulo: "Usuarios",
    descripción: "Creó un nuevo usuario en el sistema",
    detalles: "Usuario: María González (maria@onvia.com)",
    ip: "192.168.1.100",
  },
  {
    id: 5,
    fecha: "2024-01-15T10:30:00Z",
    usuario: "admin@onvia.com",
    accion: "Login",
    modulo: "Autenticación",
    descripcion: "Inició sesión en el sistema",
    ip: "192.168.1.100",
  },
  {
    id: 6,
    fecha: "2024-01-14T16:45:00Z",
    usuario: "user@onvia.com",
    accion: "Completar",
    modulo: "Novedades",
    descripcion: "Marcó como completada una novedad",
    detalles: "Novedad ID: 3 - Mantenimiento bus 002",
    ip: "192.168.1.105",
  },
  {
    id: 7,
    fecha: "2024-01-14T15:20:00Z",
    usuario: "admin@onvia.com",
    accion: "Eliminar",
    modulo: "Notificaciones",
    descripcion: "Eliminó notificaciones leídas",
    detalles: "5 notificaciones eliminadas",
    ip: "192.168.1.100",
  },
  {
    id: 8,
    fecha: "2024-01-14T14:10:00Z",
    usuario: "user@onvia.com",
    accion: "Ver",
    modulo: "Buses",
    descripcion: "Consultó la lista de buses",
    ip: "192.168.1.105",
  },
]

export default function HistorialPage() {
  const [historial, setHistorial] = useState<HistorialEntry[]>(historialDemo)
  const [filteredHistorial, setFilteredHistorial] = useState<HistorialEntry[]>(historialDemo)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedModule, setSelectedModule] = useState("todos")
  const [selectedAction, setSelectedAction] = useState("todas")
  const [selectedUser, setSelectedUser] = useState("todos")

  const applyFilters = () => {
    let filtered = historial

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (entry) =>
          entry.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.modulo.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtro por módulo
    if (selectedModule !== "todos") {
      filtered = filtered.filter((entry) => entry.modulo.toLowerCase() === selectedModule.toLowerCase())
    }

    // Filtro por acción
    if (selectedAction !== "todas") {
      filtered = filtered.filter((entry) => entry.accion.toLowerCase() === selectedAction.toLowerCase())
    }

    // Filtro por usuario
    if (selectedUser !== "todos") {
      filtered = filtered.filter((entry) => entry.usuario === selectedUser)
    }

    setFilteredHistorial(filtered)
  }

  // Aplicar filtros cuando cambien
  React.useEffect(() => {
    applyFilters()
  }, [searchTerm, selectedModule, selectedAction, selectedUser, historial])

  const getAccionBadge = (accion: string) => {
    const acciones = {
      crear: { label: "Crear", variant: "default" as const },
      actualizar: { label: "Actualizar", variant: "secondary" as const },
      eliminar: { label: "Eliminar", variant: "destructive" as const },
      ver: { label: "Ver", variant: "outline" as const },
      login: { label: "Login", variant: "default" as const },
      logout: { label: "Logout", variant: "outline" as const },
      completar: { label: "Completar", variant: "default" as const },
    }
    const info = acciones[accion.toLowerCase() as keyof typeof acciones] || {
      label: accion,
      variant: "outline" as const,
    }
    return <Badge variant={info.variant}>{info.label}</Badge>
  }

  const getModuloBadge = (modulo: string) => {
    const colores = {
      buses: "bg-blue-100 text-blue-800",
      novedades: "bg-green-100 text-green-800",
      usuarios: "bg-purple-100 text-purple-800",
      reportes: "bg-orange-100 text-orange-800",
      notificaciones: "bg-yellow-100 text-yellow-800",
      autenticación: "bg-gray-100 text-gray-800",
    }
    const color = colores[modulo.toLowerCase() as keyof typeof colores] || "bg-gray-100 text-gray-800"
    return <Badge className={color}>{modulo}</Badge>
  }

  const uniqueModules = [...new Set(historial.map((entry) => entry.modulo))]
  const uniqueActions = [...new Set(historial.map((entry) => entry.accion))]
  const uniqueUsers = [...new Set(historial.map((entry) => entry.usuario))]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Historial</h1>
        <p className="text-muted-foreground">Registro de actividades del sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Registro de Actividades
          </CardTitle>
          <CardDescription>Historial completo de acciones realizadas en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar en el historial..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Módulo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los módulos</SelectItem>
                  {uniqueModules.map((module) => (
                    <SelectItem key={module} value={module.toLowerCase()}>
                      {module}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Acción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las acciones</SelectItem>
                  {uniqueActions.map((action) => (
                    <SelectItem key={action} value={action.toLowerCase()}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Usuario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los usuarios</SelectItem>
                  {uniqueUsers.map((user) => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Lista de historial */}
            <div className="space-y-4">
              {filteredHistorial.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <History className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No hay registros</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    No se encontraron registros con los filtros actuales
                  </p>
                </div>
              ) : (
                filteredHistorial.map((entry) => (
                  <Card key={entry.id} className="border-l-4 border-l-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getAccionBadge(entry.accion)}
                            {getModuloBadge(entry.modulo)}
                          </div>
                          <h3 className="font-medium mb-1">{entry.descripcion}</h3>
                          {entry.detalles && <p className="text-sm text-muted-foreground mb-2">{entry.detalles}</p>}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(entry.fecha).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {entry.usuario}
                            </div>
                            {entry.ip && (
                              <div className="flex items-center gap-1">
                                <Activity className="h-3 w-3" />
                                {entry.ip}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Información de resultados */}
            <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
              <span>
                Mostrando {filteredHistorial.length} de {historial.length} registros
              </span>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Limpiar filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
