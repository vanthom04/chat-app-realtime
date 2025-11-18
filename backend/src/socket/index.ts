import { Server } from "socket.io"
import { Server as HttpServer } from "http"
import jwt, { JwtPayload } from "jsonwebtoken"

import { corsOptions } from "@/lib/cors-options"
import { usersService } from "@/services/users.service"
import { presenceService } from "@/services/presence.service"
import { notificationsService } from "@/services/notifications.service"
import { UnauthorizedException } from "@/exceptions/unauthorized-exception"

export const createIO = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: corsOptions
  })

  // Middleware xác thực
  io.use((socket, next) => {
    const accessToken = socket.handshake.auth.accessToken
    if (!accessToken || typeof accessToken !== "string") {
      return next(new UnauthorizedException("Unauthorized! (Token not found)"))
    }

    try {
      const payload = jwt.verify(accessToken, process.env.JWT_SECRET!) as JwtPayload
      socket.data.user = payload
      next()
    } catch (error) {
      if (error instanceof Error && error.name === "TokenExpiredError") {
        return next(new Error("TOKEN_EXPIRED"))
      }

      return next(new Error("TOKEN_INVALID"))
    }
  })

  io.on("connection", async (socket) => {
    const userId = socket.data.user.sub as string

    // Thêm user và cập nhật trạng thái ONLINE
    presenceService.addUser(userId, socket.id)
    await usersService.updateStatus(userId, "ONLINE")
    await notificationsService.notifyFriendStatus(userId, "ONLINE", io)

    // Cập nhật trạng thái AWAY
    socket.on("user:inactive", async () => {
      await usersService.updateStatus(userId, "AWAY")
      await notificationsService.notifyFriendStatus(userId, "AWAY", io)
    })

    socket.on("user:active", async () => {
      await usersService.updateStatus(userId, "ONLINE")
      await notificationsService.notifyFriendStatus(userId, "AWAY", io)
    })

    socket.on("disconnect", async () => {
      // Xóa user và cập nhật trạng thái OFFLINE
      presenceService.removeUser(userId)
      await usersService.updateStatus(userId, "OFFLINE")
      await notificationsService.notifyFriendStatus(userId, "OFFLINE", io)
    })
  })

  return io
}
