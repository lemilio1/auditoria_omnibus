import type React from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import AuthGuard from "@/components/auth/auth-guard"

export default function UsuariosLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </AuthGuard>
  )
}
