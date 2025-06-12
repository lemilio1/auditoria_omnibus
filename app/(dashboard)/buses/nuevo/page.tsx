"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ImageUpload } from "@/components/ui/image-upload"
import { getSupabaseClient } from "@/lib/supabase/client"

export default function NuevoBusPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [imagenes, setImagenes] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)

      const nuevoBus = {
        numero_interno: formData.get("numero_interno") as string,
        marca: formData.get("marca") as string,
        modelo: formData.get("modelo") as string,
        patente: formData.get("patente") as string,
        año: Number.parseInt(formData.get("año") as string) || null,
        capacidad: Number.parseInt(formData.get("capacidad") as string) || null,
        estado: (formData.get("estado") as string) || "activo",
        observaciones: (formData.get("observaciones") as string) || null,
        fecha_ingreso: (formData.get("fecha_ingreso") as string) || new Date().toISOString().split("T")[0],
        proxima_revision: (formData.get("proxima_revision") as string) || null,
        created_at: new Date().toISOString(),
      }

      console.log("Creando bus:", nuevoBus)

      // Usar getSupabaseClient en lugar de getSupabase
      const supabase = getSupabaseClient()

      const { data, error } = await supabase.from("buses").insert([nuevoBus]).select().single()

      if (error) {
        console.error("Error al crear bus:", error)
        throw new Error(error.message)
      }

      console.log("Bus creado exitosamente:", data)

      toast({
        title: "Bus creado exitosamente",
        description: `El bus ${nuevoBus.numero_interno} ha sido registrado en el sistema`,
      })

      router.push("/buses")
    } catch (error: any) {
      console.error("Error al crear bus:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo crear el bus. Intente nuevamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (files: File[]) => {
    // Simular subida de imágenes
    const urls = files.map((file, index) => `/placeholder.svg?height=200&width=300&text=Bus+Image+${index + 1}`)
    return urls
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Bus</h1>
          <p className="text-muted-foreground">Registre un nuevo bus en la flota</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Básica */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
                <CardDescription>Datos principales del bus</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numero_interno">Número Interno *</Label>
                    <Input id="numero_interno" name="numero_interno" placeholder="001" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patente">Patente *</Label>
                    <Input id="patente" name="patente" placeholder="AB123CD" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marca">Marca *</Label>
                    <Select name="marca" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar marca" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mercedes-benz">Mercedes Benz</SelectItem>
                        <SelectItem value="scania">Scania</SelectItem>
                        <SelectItem value="volvo">Volvo</SelectItem>
                        <SelectItem value="iveco">Iveco</SelectItem>
                        <SelectItem value="volkswagen">Volkswagen</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modelo">Modelo *</Label>
                    <Input id="modelo" name="modelo" placeholder="OF-1721" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="año">Año</Label>
                    <Input id="año" name="año" type="number" placeholder="2020" min="1990" max="2030" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacidad">Capacidad (pasajeros)</Label>
                    <Input id="capacidad" name="capacidad" type="number" placeholder="45" min="1" max="100" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Textarea
                    id="observaciones"
                    name="observaciones"
                    placeholder="Información adicional sobre el bus..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Imágenes</CardTitle>
                <CardDescription>Suba imágenes del bus (máximo 5 imágenes)</CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  onChange={(files) => console.log("Files changed:", files)}
                  onUpload={handleImageUpload}
                  value={imagenes}
                  maxFiles={5}
                  maxSize={5 * 1024 * 1024} // 5MB
                />
              </CardContent>
            </Card>
          </div>

          {/* Panel Lateral */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estado y Configuración</CardTitle>
                <CardDescription>Estado inicial y configuración del bus</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado Inicial</Label>
                  <Select name="estado" defaultValue="activo">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="mantenimiento">En Mantenimiento</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fecha_ingreso">Fecha de Ingreso</Label>
                  <Input
                    id="fecha_ingreso"
                    name="fecha_ingreso"
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proxima_revision">Próxima Revisión Técnica</Label>
                  <Input id="proxima_revision" name="proxima_revision" type="date" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Guardando..." : "Crear Bus"}
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>
                  Cancelar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
