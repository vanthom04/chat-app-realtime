import { toast } from "sonner"
import { io as ClientIO, Socket } from "socket.io-client"
import { useState, useEffect, useContext, createContext } from "react"

import { api } from "@/lib/api"
import { useAuthStore } from "@/hooks/use-auth-store"
import type { AuthResponse } from "@/features/auth/types"

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false
})

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketContextProvider")
  }

  return context
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { accessToken, signOut } = useAuthStore()

  const [isConnected, setIsConnected] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    if (!accessToken) return

    const socketInstance = ClientIO(import.meta.env.VITE_API_URL!, {
      transports: ["websocket"],
      withCredentials: true,
      autoConnect: true,
      auth: {
        accessToken
      }
    })

    socketInstance.on("connect", () => {
      setIsConnected(true)
    })

    socketInstance.on("disconnect", () => {
      setIsConnected(false)
    })

    // Handle connect error (token expired)
    socketInstance.on("connect_error", async (error) => {
      if (error.message === "TOKEN_EXPIRED") {
        await api
          .post<AuthResponse>("/api/auth/refresh-token", undefined, {
            headers: {
              "Content-Type": "application/json"
            }
          })
          .then((data) => {
            ;(socketInstance.auth as Record<string, string>).accessToken = data.accessToken
            socketInstance.connect()
          })
          .catch(async () => {
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!")
            await signOut()
          })
      } else {
        throw new Error(error.message)
      }
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.off("connect_error")
      socketInstance.disconnect()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}
