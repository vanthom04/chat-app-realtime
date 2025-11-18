import { Outlet } from "react-router"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export const MainLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex bg-slate-100 dark:bg-slate-950 w-full max-h-screen p-2">
        <AppSidebar />
        <main className="flex-1 rounded-lg shadow-xs overflow-hidden">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}
