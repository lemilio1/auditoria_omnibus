"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSidebarContext } from "@/components/ui/sidebar"
import { useAuth } from "@/components/auth/auth-provider"
import { Bus, FileText, Home, Settings, Bell, ClipboardList, Users, History, FileBarChart } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname()
  const { state, openMobile, setOpenMobile } = useSidebarContext()
  const { user } = useAuth()

  // Verificar si el usuario tiene permisos para ver ciertas secciones
  const canViewUsers = user?.role && ["administrador", "admin_superior", "super_usuario"].includes(user.role)
  const canViewLogs = user?.role && ["admin_superior", "super_usuario"].includes(user.role)

  return (
    <>
      {/* Overlay para móviles */}
      {openMobile && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setOpenMobile(false)}
        />
      )}

      <div
        className={cn(
          "fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-all duration-300 md:w-16 md:translate-x-0",
          openMobile ? "translate-x-0" : "-translate-x-full",
          className,
        )}
        {...props}
      >
        <ScrollArea className="h-full py-6">
          <nav className="grid gap-2 px-2">
            <Link href="/" passHref>
              <Button
                variant={pathname === "/" ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  "md:justify-center",
                  pathname === "/" && "bg-primary text-primary-foreground",
                )}
              >
                <Home className="h-5 w-5" />
                <span className={cn("ml-2", "md:hidden")}>Inicio</span>
              </Button>
            </Link>
            <Link href="/buses" passHref>
              <Button
                variant={pathname.startsWith("/buses") ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  "md:justify-center",
                  pathname.startsWith("/buses") && "bg-primary text-primary-foreground",
                )}
              >
                <Bus className="h-5 w-5" />
                <span className={cn("ml-2", "md:hidden")}>Buses</span>
              </Button>
            </Link>
            <Link href="/novedades" passHref>
              <Button
                variant={pathname.startsWith("/novedades") ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  "md:justify-center",
                  pathname.startsWith("/novedades") && "bg-primary text-primary-foreground",
                )}
              >
                <FileText className="h-5 w-5" />
                <span className={cn("ml-2", "md:hidden")}>Novedades</span>
              </Button>
            </Link>
            <Link href="/notificaciones" passHref>
              <Button
                variant={pathname.startsWith("/notificaciones") ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  "md:justify-center",
                  pathname.startsWith("/notificaciones") && "bg-primary text-primary-foreground",
                )}
              >
                <Bell className="h-5 w-5" />
                <span className={cn("ml-2", "md:hidden")}>Notificaciones</span>
              </Button>
            </Link>
            <Link href="/reportes" passHref>
              <Button
                variant={pathname.startsWith("/reportes") ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  "md:justify-center",
                  pathname.startsWith("/reportes") && "bg-primary text-primary-foreground",
                )}
              >
                <FileBarChart className="h-5 w-5" />
                <span className={cn("ml-2", "md:hidden")}>Reportes</span>
              </Button>
            </Link>
            <Link href="/historial" passHref>
              <Button
                variant={pathname.startsWith("/historial") ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  "md:justify-center",
                  pathname.startsWith("/historial") && "bg-primary text-primary-foreground",
                )}
              >
                <History className="h-5 w-5" />
                <span className={cn("ml-2", "md:hidden")}>Historial</span>
              </Button>
            </Link>

            {canViewUsers && (
              <Link href="/usuarios" passHref>
                <Button
                  variant={pathname.startsWith("/usuarios") ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    "md:justify-center",
                    pathname.startsWith("/usuarios") && "bg-primary text-primary-foreground",
                  )}
                >
                  <Users className="h-5 w-5" />
                  <span className={cn("ml-2", "md:hidden")}>Usuarios</span>
                </Button>
              </Link>
            )}

            {canViewLogs && (
              <Link href="/logs" passHref>
                <Button
                  variant={pathname.startsWith("/logs") ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    "md:justify-center",
                    pathname.startsWith("/logs") && "bg-primary text-primary-foreground",
                  )}
                >
                  <ClipboardList className="h-5 w-5" />
                  <span className={cn("ml-2", "md:hidden")}>Logs</span>
                </Button>
              </Link>
            )}

            <Link href="/configuracion" passHref>
              <Button
                variant={pathname.startsWith("/configuracion") ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  "md:justify-center",
                  pathname.startsWith("/configuracion") && "bg-primary text-primary-foreground",
                )}
              >
                <Settings className="h-5 w-5" />
                <span className={cn("ml-2", "md:hidden")}>Configuración</span>
              </Button>
            </Link>
          </nav>
        </ScrollArea>
      </div>
    </>
  )
}
