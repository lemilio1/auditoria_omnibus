import type React from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function ReportesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 pt-16 md:ml-16">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
