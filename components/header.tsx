"use client"

import Link from "next/link"
import { Bus, Menu, Bell, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebarContext } from "@/components/ui/sidebar"
import { getSupabase } from "@/lib/supabase"
import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Header() {
  const { toggleSidebar } = useSidebarContext()
  const [user, setUser] = useState<any>(null)
  const supabase = getSupabase()

  useEffect(() => {
    async function getUser() {
      try {
        const { data } = await supabase.auth.getSession()

        if (data.session) {
          const { data: profiles, error } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", data.session.user.id)

          if (error) {
            console.error("Error al obtener perfil en Header:", error)
            return
          }

          if (profiles && profiles.length > 0) {
            setUser(profiles[0])
          } else {
            // Si no hay perfil, usar información básica de la sesión
            setUser({
              name: data.session.user.email?.split("@")[0] || "Usuario",
              email: data.session.user.email,
            })
          }
        }
      } catch (error) {
        console.error("Error al verificar sesión en Header:", error)
      }
    }

    getUser()
  }, [supabase])

  // Obtener iniciales del nombre
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "U"

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  return (
    <header className="fixed top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={toggleSidebar}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <Link href="/" className="flex items-center gap-2">
          <Bus className="h-6 w-6" />
          <span className="text-lg font-bold">ONVIA</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.name || "Usuario"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Mi Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
