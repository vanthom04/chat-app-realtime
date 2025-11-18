import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SidebarHeader } from "@/components/ui/sidebar"

export const AppSidebarHeader = () => {
  const { theme, setTheme } = useTheme()

  return (
    <SidebarHeader className="mx-2 px-3 py-2.5 bg-gradient-to-r from-primary to-purple-600 rounded-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-2xl font-bold tracking-wider">Chatio.</h1>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="text-white hover:bg-accent/50 hover:text-black dark:hover:text-white"
        >
          <SunIcon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </SidebarHeader>
  )
}
