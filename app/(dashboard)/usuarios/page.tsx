"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseClient } from "@/lib/supabase/client"
import { createUser } from "@/lib/actions/user-actions"
import { UserPlus, Users, Search, MoreHorizontal, UserCog, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  email: string
  name: string
  role: string
  is_active: boolean
  created_at: string
  last_login: string | null
  permissions: Record<string, boolean>
}

export default function UsuariosPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("todos")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const supabase = getSupabaseClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesTab =
        activeTab === "todos" ||
        (activeTab === "activos" && user.is_active) ||
        (activeTab === "inactivos" && !user.is_active)

      return matchesSearch && matchesTab
    })

    setFilteredUsers(filtered)
  }, [searchTerm, activeTab, users])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      // Obtener perfiles de usuario
      const { data: profiles, error: profilesError } = await supabase
        .from("user_profiles")
        .select("*")
        .order("name", { ascending: true })

      if (profilesError) throw profilesError

      // Obtener permisos de usuario
      const { data: permissions, error: permissionsError } = await supabase.from("user_permissions").select("*")

      if (permissionsError) throw permissionsError

      // Combinar datos
      const usersWithPermissions = profiles.map((profile) => {
        const userPermissions = permissions.find((p) => p.user_id === profile.id)
        return {
          ...profile,
          permissions: userPermissions?.permissions || {},
        }
      })

      setUsers(usersWithPermissions)
      setFilteredUsers(usersWithPermissions)
    } catch (error) {
      console.error("Error al cargar usuarios:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los usuarios",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsCreatingUser(true)

    try {
      const formData = new FormData(e.currentTarget)

      const email = formData.get("email") as string
      const password = formData.get("password") as string
      const name = formData.get("name") as string
      const role = formData.get("role") as string

      // Permisos basados en checkboxes
      const permissions: Record<string, boolean> = {
        ver_buses: formData.get("ver_buses") === "on",
        editar_buses: formData.get("editar_buses") === "on",
        crear_buses: formData.get("crear_buses") === "on",
        eliminar_buses: formData.get("eliminar_buses") === "on",
        ver_novedades: formData.get("ver_novedades") === "on",
        crear_novedades: formData.get("crear_novedades") === "on",
        aprobar_novedades: formData.get("aprobar_novedades") === "on",
        ver_usuarios: formData.get("ver_usuarios") === "on",
        editar_usuarios: formData.get("editar_usuarios") === "on",
        ver_logs: formData.get("ver_logs") === "on",
        configuracion_avanzada: formData.get("configuracion_avanzada") === "on",
      }

      // Crear usuario usando la acción del servidor
      const result = await createUser({
        email,
        password,
        name,
        role,
        permissions,
      })

      if (result.error) {
        throw new Error(result.error)
      }

      toast({
        title: "Usuario creado",
        description: `Se ha creado el usuario ${name} (${email})`,
      })

      setIsCreateDialogOpen(false)
      fetchUsers() // Recargar la lista de usuarios
    } catch (error: any) {
      console.error("Error al crear usuario:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo crear el usuario",
      })
    } finally {
      setIsCreatingUser(false)
    }
  }

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const { error } = await supabase.from("user_profiles").update({ is_active: !isActive }).eq("id", userId)

      if (error) throw error

      // Actualizar la lista de usuarios
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, is_active: !isActive } : user)))

      toast({
        title: `Usuario ${!isActive ? "activado" : "desactivado"}`,
        description: `El usuario ha sido ${!isActive ? "activado" : "desactivado"} correctamente`,
      })
    } catch (error: any) {
      console.error("Error al cambiar estado del usuario:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo cambiar el estado del usuario",
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.")) {
      return
    }

    try {
      // Eliminar permisos primero (debido a la restricción de clave foránea)
      const { error: permissionsError } = await supabase.from("user_permissions").delete().eq("user_id", userId)

      if (permissionsError) throw permissionsError

      // Luego eliminar el perfil
      const { error: profileError } = await supabase.from("user_profiles").delete().eq("id", userId)

      if (profileError) throw profileError

      // Actualizar la lista de usuarios
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId))

      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado correctamente",
      })
    } catch (error: any) {
      console.error("Error al eliminar usuario:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo eliminar el usuario",
      })
    }
  }

  const getRoleBadge = (role: string) => {
    const roles: Record<string, { label: string; variant: "default" | "outline" | "secondary" | "destructive" }> = {
      super_usuario: { label: "Super Usuario", variant: "destructive" },
      admin_superior: { label: "Admin Superior", variant: "destructive" },
      administrador: { label: "Administrador", variant: "default" },
      carga: { label: "Carga", variant: "secondary" },
      visitante: { label: "Visitante", variant: "outline" },
    }

    const roleInfo = roles[role] || { label: role, variant: "outline" }
    return <Badge variant={roleInfo.variant}>{roleInfo.label}</Badge>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
        <p className="text-muted-foreground">Gestione los usuarios del sistema</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Usuarios</CardTitle>
            <CardDescription>Lista de usuarios registrados en el sistema</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Nuevo Usuario</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <form onSubmit={handleCreateUser}>
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                    <DialogDescription>Complete los datos para crear un nuevo usuario en el sistema</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input id="name" name="name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <Input id="password" name="password" type="password" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Rol</Label>
                        <Select name="role" defaultValue="visitante" required>
                          <SelectTrigger id="role">
                            <SelectValue placeholder="Seleccionar rol" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="visitante">Visitante</SelectItem>
                            <SelectItem value="carga">Carga</SelectItem>
                            <SelectItem value="administrador">Administrador</SelectItem>
                            <SelectItem value="admin_superior">Admin Superior</SelectItem>
                            <SelectItem value="super_usuario">Super Usuario</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Permisos</Label>
                      <div className="grid grid-cols-2 gap-2 border rounded-md p-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Buses</h4>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="ver_buses" name="ver_buses" defaultChecked />
                              <label htmlFor="ver_buses" className="text-sm">
                                Ver buses
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="editar_buses" name="editar_buses" />
                              <label htmlFor="editar_buses" className="text-sm">
                                Editar buses
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="crear_buses" name="crear_buses" />
                              <label htmlFor="crear_buses" className="text-sm">
                                Crear buses
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="eliminar_buses" name="eliminar_buses" />
                              <label htmlFor="eliminar_buses" className="text-sm">
                                Eliminar buses
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Novedades</h4>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="ver_novedades" name="ver_novedades" defaultChecked />
                              <label htmlFor="ver_novedades" className="text-sm">
                                Ver novedades
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="crear_novedades" name="crear_novedades" />
                              <label htmlFor="crear_novedades" className="text-sm">
                                Crear novedades
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="aprobar_novedades" name="aprobar_novedades" />
                              <label htmlFor="aprobar_novedades" className="text-sm">
                                Aprobar novedades
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Usuarios</h4>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="ver_usuarios" name="ver_usuarios" />
                              <label htmlFor="ver_usuarios" className="text-sm">
                                Ver usuarios
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="editar_usuarios" name="editar_usuarios" />
                              <label htmlFor="editar_usuarios" className="text-sm">
                                Editar usuarios
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Sistema</h4>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="ver_logs" name="ver_logs" />
                              <label htmlFor="ver_logs" className="text-sm">
                                Ver logs
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="configuracion_avanzada" name="configuracion_avanzada" />
                              <label htmlFor="configuracion_avanzada" className="text-sm">
                                Configuración avanzada
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isCreatingUser}>
                      {isCreatingUser ? "Creando..." : "Crear Usuario"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, email o rol..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="todos">
                  Todos
                  <Badge variant="secondary" className="ml-2">
                    {users.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="activos">
                  Activos
                  <Badge variant="secondary" className="ml-2">
                    {users.filter((u) => u.is_active).length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="inactivos">
                  Inactivos
                  <Badge variant="secondary" className="ml-2">
                    {users.filter((u) => !u.is_active).length}
                  </Badge>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="todos" className="mt-4">
                <UsersList
                  users={filteredUsers}
                  onToggleStatus={handleToggleUserStatus}
                  onDelete={handleDeleteUser}
                  getRoleBadge={getRoleBadge}
                />
              </TabsContent>
              <TabsContent value="activos" className="mt-4">
                <UsersList
                  users={filteredUsers}
                  onToggleStatus={handleToggleUserStatus}
                  onDelete={handleDeleteUser}
                  getRoleBadge={getRoleBadge}
                />
              </TabsContent>
              <TabsContent value="inactivos" className="mt-4">
                <UsersList
                  users={filteredUsers}
                  onToggleStatus={handleToggleUserStatus}
                  onDelete={handleDeleteUser}
                  getRoleBadge={getRoleBadge}
                />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface UsersListProps {
  users: User[]
  onToggleStatus: (userId: string, isActive: boolean) => void
  onDelete: (userId: string) => void
  getRoleBadge: (role: string) => React.ReactNode
}

function UsersList({ users, onToggleStatus, onDelete, getRoleBadge }: UsersListProps) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Users className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No hay usuarios</h3>
        <p className="text-sm text-muted-foreground mt-1">No se encontraron usuarios con los filtros actuales</p>
      </div>
    )
  }

  return (
    <div className="border rounded-md">
      <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b">
        <div>Nombre</div>
        <div>Email</div>
        <div>Rol</div>
        <div>Estado</div>
        <div className="text-right">Acciones</div>
      </div>
      <div className="divide-y">
        {users.map((user) => (
          <div key={user.id} className="grid grid-cols-5 gap-4 p-4 items-center">
            <div>{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
            <div>{getRoleBadge(user.role)}</div>
            <div>
              <Switch checked={user.is_active} onCheckedChange={() => onToggleStatus(user.id, user.is_active)} />
            </div>
            <div className="flex justify-end">
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
                  <DropdownMenuItem asChild>
                    <button className="flex w-full items-center cursor-pointer">
                      <UserCog className="mr-2 h-4 w-4" />
                      <span>Editar permisos</span>
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onToggleStatus(user.id, user.is_active)}
                    className="flex items-center cursor-pointer"
                  >
                    <Switch className="mr-2 h-4 w-4" checked={user.is_active} />
                    <span>{user.is_active ? "Desactivar" : "Activar"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(user.id)}
                    className="flex items-center text-red-600 dark:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Eliminar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
