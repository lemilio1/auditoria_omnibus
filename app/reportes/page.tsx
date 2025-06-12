"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileBarChart, Download, TrendingUp, Bus, FileText, AlertTriangle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function ReportesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("mes")
  const { toast } = useToast()

  const generateReport = (tipo: string) => {
    toast({
      title: "Generando reporte",
      description: `El reporte de ${tipo} se está generando. Se descargará automáticamente.`,
    })
  }

  const estadisticas = {
    buses: {
      total: 3,
      activos: 2,
      mantenimiento: 1,
      inactivos: 0,
    },
    novedades: {
      total: 15,
      pendientes: 3,
      en_proceso: 2,
      completadas: 10,
    },
    mantenimientos: {
      programados: 5,
      completados: 12,
      vencidos: 1,
    },
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
        <p className="text-muted-foreground">Genere reportes y visualice estadísticas del sistema</p>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bus className="h-4 w-4" />
              Buses Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.buses.activos}</div>
            <p className="text-xs text-muted-foreground mt-1">de {estadisticas.buses.total} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Novedades Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.novedades.pendientes}</div>
            <p className="text-xs text-muted-foreground mt-1">de {estadisticas.novedades.total} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Mantenimientos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.mantenimientos.completados}</div>
            <p className="text-xs text-muted-foreground mt-1">completados este mes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alertas Activas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.mantenimientos.vencidos}</div>
            <p className="text-xs text-muted-foreground mt-1">requieren atención</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileBarChart className="h-5 w-5" />
            Generador de Reportes
          </CardTitle>
          <CardDescription>Genere reportes personalizados del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Período</label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semana">Esta semana</SelectItem>
                    <SelectItem value="mes">Este mes</SelectItem>
                    <SelectItem value="trimestre">Este trimestre</SelectItem>
                    <SelectItem value="año">Este año</SelectItem>
                    <SelectItem value="personalizado">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="buses" className="w-full">
              <TabsList>
                <TabsTrigger value="buses">Buses</TabsTrigger>
                <TabsTrigger value="novedades">Novedades</TabsTrigger>
                <TabsTrigger value="mantenimiento">Mantenimiento</TabsTrigger>
                <TabsTrigger value="operacional">Operacional</TabsTrigger>
              </TabsList>

              <TabsContent value="buses" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Estado de Flota</CardTitle>
                      <CardDescription>Reporte del estado actual de todos los buses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Activos:</span>
                          <Badge variant="default">{estadisticas.buses.activos}</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>En mantenimiento:</span>
                          <Badge variant="secondary">{estadisticas.buses.mantenimiento}</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Inactivos:</span>
                          <Badge variant="outline">{estadisticas.buses.inactivos}</Badge>
                        </div>
                      </div>
                      <Button
                        className="w-full mt-4"
                        variant="outline"
                        onClick={() => generateReport("estado de flota")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Generar PDF
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Historial de Mantenimiento</CardTitle>
                      <CardDescription>Reporte detallado de mantenimientos realizados</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Completados:</span>
                          <Badge variant="default">{estadisticas.mantenimientos.completados}</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Programados:</span>
                          <Badge variant="secondary">{estadisticas.mantenimientos.programados}</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Vencidos:</span>
                          <Badge variant="destructive">{estadisticas.mantenimientos.vencidos}</Badge>
                        </div>
                      </div>
                      <Button
                        className="w-full mt-4"
                        variant="outline"
                        onClick={() => generateReport("historial de mantenimiento")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Generar PDF
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Costos Operacionales</CardTitle>
                      <CardDescription>Análisis de costos por bus y período</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Combustible:</span>
                          <span className="font-medium">$45,230</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Mantenimiento:</span>
                          <span className="font-medium">$12,450</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Total:</span>
                          <span className="font-bold">$57,680</span>
                        </div>
                      </div>
                      <Button
                        className="w-full mt-4"
                        variant="outline"
                        onClick={() => generateReport("costos operacionales")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Generar PDF
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="novedades" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Resumen de Novedades</CardTitle>
                      <CardDescription>Estadísticas de novedades por tipo y estado</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Total:</span>
                          <Badge variant="outline">{estadisticas.novedades.total}</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Pendientes:</span>
                          <Badge variant="destructive">{estadisticas.novedades.pendientes}</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>En proceso:</span>
                          <Badge variant="secondary">{estadisticas.novedades.en_proceso}</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Completadas:</span>
                          <Badge variant="default">{estadisticas.novedades.completadas}</Badge>
                        </div>
                      </div>
                      <Button
                        className="w-full mt-4"
                        variant="outline"
                        onClick={() => generateReport("resumen de novedades")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Generar PDF
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Análisis de Incidentes</CardTitle>
                      <CardDescription>Reporte detallado de incidentes y su resolución</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Incidentes críticos:</span>
                          <Badge variant="destructive">2</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tiempo promedio resolución:</span>
                          <span className="font-medium">4.2 horas</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tasa de resolución:</span>
                          <span className="font-medium">95%</span>
                        </div>
                      </div>
                      <Button
                        className="w-full mt-4"
                        variant="outline"
                        onClick={() => generateReport("análisis de incidentes")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Generar PDF
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="mantenimiento" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Calendario de Mantenimiento</CardTitle>
                      <CardDescription>Programación y cumplimiento de mantenimientos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Próximos 7 días:</span>
                          <Badge variant="secondary">3</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Próximos 30 días:</span>
                          <Badge variant="outline">8</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Vencidos:</span>
                          <Badge variant="destructive">1</Badge>
                        </div>
                      </div>
                      <Button
                        className="w-full mt-4"
                        variant="outline"
                        onClick={() => generateReport("calendario de mantenimiento")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Generar PDF
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Eficiencia de Mantenimiento</CardTitle>
                      <CardDescription>Métricas de rendimiento del área de mantenimiento</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Tiempo promedio:</span>
                          <span className="font-medium">2.5 horas</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Cumplimiento:</span>
                          <span className="font-medium">92%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Costo promedio:</span>
                          <span className="font-medium">$1,250</span>
                        </div>
                      </div>
                      <Button
                        className="w-full mt-4"
                        variant="outline"
                        onClick={() => generateReport("eficiencia de mantenimiento")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Generar PDF
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="operacional" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Disponibilidad de Flota</CardTitle>
                      <CardDescription>Porcentaje de disponibilidad por período</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Disponibilidad actual:</span>
                          <Badge variant="default">85%</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Promedio mensual:</span>
                          <span className="font-medium">88%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Objetivo:</span>
                          <span className="font-medium">90%</span>
                        </div>
                      </div>
                      <Button
                        className="w-full mt-4"
                        variant="outline"
                        onClick={() => generateReport("disponibilidad de flota")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Generar PDF
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Rendimiento General</CardTitle>
                      <CardDescription>Métricas generales de rendimiento operacional</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Km recorridos:</span>
                          <span className="font-medium">12,450 km</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Consumo promedio:</span>
                          <span className="font-medium">3.2 km/l</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Horas operación:</span>
                          <span className="font-medium">245 hrs</span>
                        </div>
                      </div>
                      <Button
                        className="w-full mt-4"
                        variant="outline"
                        onClick={() => generateReport("rendimiento general")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Generar PDF
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
