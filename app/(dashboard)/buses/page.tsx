"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, BusIcon, MoreHorizontal } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

// Actualizada la interfaz para reflejar el esquema real de la base de datos
interface Bus {
  id: number
  numero_interno?: string // Cambiado de numero a numero_interno y marcado como opcional
  marca?: string // Marcado como opcional
  modelo?: string // Marcado como opcional
  patente?: string // Marcado como opcional
  estado?: string // Marcado como opcional
  ultima_revision?: string // Marcado como opcional
  created_at?: string
}

export default function BusesPage() {
  const [buses, setBuses] = useState<Bus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const supabase = getSupabaseClient()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchBuses() {
      setIsLoading(true)
      try {
        // Primero, vamos a verificar qué columnas existen en la tabla buses
        const { data: tableInfo, error: tableError } = await supabase.from("buses").select("*").limit(1)

        if (tableError) {
          console.error("Error al verificar la estructura de la tabla:", tableError)
          toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudo verificar la estructura de la tabla buses",
          })
          setIsLoading(false)
          return
        }

        // Ahora que sabemos qué columnas existen, hacemos la consulta principal
        const { data, error } = await supabase.from("buses").select("*")

        if (error) {
          console.error("Error al cargar buses:", error)
          toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudieron cargar los buses",
          })
        } else {
          console.log("Buses cargados:", data)
          setBuses(data || [])
        }
      } catch (error: any) {
        console.error("Error al cargar buses:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: `Error al cargar buses: ${error.message}`,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBuses()
  }, [supabase, toast])

  // Actualizada la función de filtrado para usar las columnas correctas
  const filteredBuses = buses.filter(
    (bus) =>
      (bus.numero_interno?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (bus.marca?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (bus.patente?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
  )

  const getEstadoBadge = (estado?: string) => {
    if (!estado) return <Badge variant="outline">No definido</Badge>

    const estados: Record<string, { label: string; variant: "default" | "outline" | "secondary" | "destructive" }> = {
      activo: { label: "Activo", variant: "default" },
      mantenimiento: { label: "Mantenimiento", variant: "secondary" },
      inactivo: { label: "Inactivo", variant: "outline" },
      reparacion: { label: "Reparación", variant: "destructive" },
    }

    const estadoInfo = estados[estado.toLowerCase()] || { label: estado, variant: "outline" }
    return <Badge variant={estadoInfo.variant}>{estadoInfo.label}</Badge>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Buses</h1>
        <p className="text-muted-foreground">Gestione la flota de buses</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Buses</CardTitle>
            <CardDescription>Lista de buses registrados en el sistema</CardDescription>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Nuevo Bus</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número interno, marca o patente..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número Interno</TableHead>
                      <TableHead className="hidden md:table-cell">Marca</TableHead>
                      <TableHead className="hidden md:table-cell">Modelo</TableHead>
                      <TableHead>Patente</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="hidden md:table-cell">Última Revisión</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBuses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center py-4">
                            <BusIcon className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">No se encontraron buses</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBuses.map((bus) => (
                        <TableRow key={bus.id}>
                          <TableCell className="font-medium">{bus.numero_interno || "N/A"}</TableCell>
                          <TableCell className="hidden md:table-cell">{bus.marca || "N/A"}</TableCell>
                          <TableCell className="hidden md:table-cell">{bus.modelo || "N/A"}</TableCell>
                          <TableCell>{bus.patente || "N/A"}</TableCell>
                          <TableCell>{getEstadoBadge(bus.estado)}</TableCell>
                          <TableCell className="hidden md:table-cell">{bus.ultima_revision || "N/A"}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Abrir menú</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                                <DropdownMenuItem>Editar</DropdownMenuItem>
                                <DropdownMenuItem>Registrar novedad</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
