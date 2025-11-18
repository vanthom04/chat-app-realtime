import { BrowserRouter } from "react-router"
import { createRoot } from "react-dom/client"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { ModalProvider } from "@/components/providers/modal-provider"
import { SocketProvider } from "@/components/providers/socket-provider"
import { ReactQueryClientProvider } from "@/components/providers/react-query-client"
import { Toaster } from "@/components/ui/sonner"
import { App } from "@/App.tsx"
import "@/main.css"

createRoot(document.getElementById("root")!).render(
  <ReactQueryClientProvider>
    <SocketProvider>
      <BrowserRouter>
        <ThemeProvider
          enableSystem
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <App />
          <ModalProvider />
          <Toaster richColors />
        </ThemeProvider>
      </BrowserRouter>
    </SocketProvider>
  </ReactQueryClientProvider>
)
