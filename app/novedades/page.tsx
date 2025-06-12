"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, FileText, Calendar, User, AlertCircle, CheckCircle, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

interface Novedad {
  id: number
  titulo: string
  descripcion: string
  tipo: "mantenimiento" | "incidente" | "revision" | "otro"
  prioridad: "baja" | "media" | "alta" | "critica"
  estado: "pendiente" | "en_proceso" | "completada" | "cancelada"
  bus_numero: string
  fecha_creacion: string
  fecha_vencimiento?: string
  creado_por: string
  asignado_a?: string
}

const novedadesDemo: Novedad[] = [
  {
    id: 1,
    titulo: "Revisión técnica vencida",
    descripcion: "El bus 001 tiene la revisión técnica vencida desde hace 3 días",
    tipo: "revision",
    prioridad: "alta",
    estado: "pendiente",
    bus_numero: "001",
    fecha_creacion: "2024-01-15T10:30:00Z",
    fecha_vencimiento: "2024-01-20T00:00:00Z",
    creado_por: "Sistema",
  },
  {
    id: 2,
    titulo: "Cambio de aceite programado",
    descripcion: "Mantenimiento preventivo programado para el bus 002",
    tipo: "mantenimiento",
    prioridad: "media",
    estado: "en_proceso",
    bus_numero: "002",
    fecha_creacion: "2024-01-14T08:15:00Z",
    creado_por: "Juan Pérez",
    asignado_a: "Taller Central",
  },
  {
    id: 3,
    titulo: "Incidente en ruta",
    descripcion: "Bus 003 reportó problema en el sistema de frenos durante la ruta matutina",
    tipo: "incidente",
    prioridad: "critica",
    estado: "completada",
    bus_numero: "003",
    fecha_creacion: "2024-01-13T14:45:00Z",
    creado_por: "María García",
    asignado_a: "Mecánico Principal",
  },
]

export default function NovedadesPage() {
  const [novedades, setNovedades] = useState<Novedad[]>(novedadesDemo)
  const [filteredNovedades, setFilteredNovedades] = useState<Novedad[]>(novedadesDemo)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("todas")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const filtered = novedades.filter((novedad) => {
      const matchesSearch =
        novedad.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        novedad.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        novedad.bus_numero.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesTab =
        activeTab === "todas" ||
        (activeTab === "pendientes" && novedad.estado === "pendiente") ||
        (activeTab === "en_proceso" && novedad.estado === "en_proceso") ||
        (activeTab === "completadas" && novedad.estado === "completada")

      return matchesSearch && matchesTab
    })

    setFilteredNovedades(filtered)
  }, [searchTerm, activeTab, novedades])

  const getPrioridadBadge = (prioridad: string) => {
    const prioridades = {
      baja: { label: "Baja", variant: "outline" as const },
      media: { label: "Media", variant: "secondary" as const },
      alta: { label: "Alta", variant: "default" as const },
      critica: { label: "Crítica", variant: "destructive" as const },
    }
    const info = prioridades[prioridad as keyof typeof prioridades]
    return <Badge variant={info.variant}>{info.label}</Badge>
  }

  const getEstadoBadge = (estado: string) => {
    const estados = {
      pendiente: { label: "Pendiente", variant: "outline" as const, icon: Clock },
      en_proceso: { label: "En Proceso", variant: "secondary" as const, icon: AlertCircle },
      completada: { label: "Completada", variant: "default" as const, icon: CheckCircle },
      cancelada: { label: "Cancelada", variant: "destructive" as const, icon: AlertCircle },
    }
    const info = estados[estado as keyof typeof estados]
    const Icon = info.icon
    return (
      <Badge variant={info.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {info.label}
      </Badge>
    )
  }

  const handleCreateNovedad = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const nuevaNovedad: Novedad = {
      id: Date.now(),
      titulo: formData.get("titulo") as string,
      descripcion: formData.get("descripcion") as string,
      tipo: formData.get("tipo") as any,
      prioridad: formData.get("prioridad") as any,
      estado: "pendiente",
      bus_numero: formData.get("bus_numero") as string,
      fecha_creacion: new Date().toISOString(),
      creado_por: "Usuario Actual",
    }

    setNovedades([nuevaNovedad, ...novedades])
    setIsCreateDialogOpen(false)
    toast({
      title: "Novedad creada",
      description: "La novedad ha sido registrada exitosamente",
    })
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Novedades</h1>
        <p className="text-muted-foreground">Gestione las novedades y reportes de la flota</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Novedades</CardTitle>
            <CardDescription>Lista de novedades registradas en el sistema</CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Nueva Novedad</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleCreateNovedad}>
                <DialogHeader>
                  <DialogTitle>Crear Nueva Novedad</DialogTitle>
                  <DialogDescription>Complete los datos para registrar una nueva novedad</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título</Label>
                    <Input id="titulo" name="titulo" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea id="descripcion" name="descripcion" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipo">Tipo</Label>
                      <Select name="tipo" defaultValue="otro" required>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                          <SelectItem value="incidente">Incidente</SelectItem>
                          <SelectItem value="revision">Revisión</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prioridad">Prioridad</Label>
                      <Select name="prioridad" defaultValue="media" required>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baja">Baja</SelectItem>
                          <SelectItem value="media">Media</SelectItem>
                          <SelectItem value="alta">Alta</SelectItem>
                          <SelectItem value="critica">Crítica</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bus_numero">Número de Bus</Label>
                    <Input id="bus_numero" name="bus_numero" placeholder="001" required />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Crear Novedad</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar novedades..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Tabs defaultValue="todas" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="todas">Todas</TabsTrigger>
                <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
                <TabsTrigger value="en_proceso">En Proceso</TabsTrigger>
                <TabsTrigger value="completadas">Completadas</TabsTrigger>
              </TabsList>
              <TabsContent value={activeTab} className="mt-4">
                <div className="space-y-4">
                  {filteredNovedades.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No hay novedades</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        No se encontraron novedades con los filtros actuales
                      </p>
                    </div>
                  ) : (
                    filteredNovedades.map((novedad) => (
                      <Card key={novedad.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-medium">{novedad.titulo}</h3>
                                {getPrioridadBadge(novedad.prioridad)}
                                {getEstadoBadge(novedad.estado)}
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{novedad.descripcion}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(novedad.fecha_creacion).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {novedad.creado_por}
                                </div>
                                <Badge variant="outline">Bus {novedad.bus_numero}</Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
