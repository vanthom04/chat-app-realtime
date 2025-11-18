import type { Socket } from "socket.io-client"
import { useEffect, useRef, useState } from "react"

const INACTIVITY_TIMEOUT = 3 * 60 * 1000 // 3 minutes

export const useUserActivity = (socket?: Socket | null) => {
  const [isAway, setIsAway] = useState(false)

  const inactivityTimer = useRef<number | null>(null)

  useEffect(() => {
    if (!socket) return

    const startInactivityTimer = () => {
      if (inactivityTimer.current !== null) {
        clearTimeout(inactivityTimer.current)
      }

      inactivityTimer.current = setTimeout(() => {
        // Hết giờ -> Gửi sự kiện inactive và cập nhật state
        setIsAway(true)
        socket.emit("user:inactive")
      }, INACTIVITY_TIMEOUT)
    }

    const handleUserActivity = () => {
      // Khi có hoạt động, reset timer
      startInactivityTimer()

      if (isAway) {
        setIsAway(false)
        socket.emit("user:active")
      }
    }

    // Bắt đầu timer ngay khi hook được sử dụng
    startInactivityTimer()

    // Lắng nghe các sự kiện hoạt động của user
    const events = ["mousemove", "keydown", "click", "scroll"]
    events.forEach((event) => window.addEventListener(event, handleUserActivity))

    return () => {
      // Dọn dẹp khi component unmount hoặc socket thay đổi
      if (inactivityTimer.current !== null) {
        clearTimeout(inactivityTimer.current)
      }

      events.forEach((event) => window.removeEventListener(event, handleUserActivity))
    }
  }, [socket, isAway])
}
