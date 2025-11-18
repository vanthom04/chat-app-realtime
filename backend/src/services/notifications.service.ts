import { Server } from "socket.io"

import { prisma } from "@/lib/prisma"
import { UserStatus } from "generated/prisma"

import { presenceService } from "./presence.service"

class NotificationsService {
  async notifyFriendStatus(userId: string, status: UserStatus, io: Server) {
    const friendships = await prisma.friendship.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ requesterId: userId }, { recipientId: userId }]
      }
    })

    const friendIds = friendships.map((f) =>
      f.requesterId === userId ? f.recipientId : f.requesterId
    )

    for (const friendId of friendIds) {
      const friendSocketId = presenceService.getSocketId(friendId)

      if (friendSocketId) {
        io.to(friendSocketId).emit("friend:status:change", { userId, status })
      }
    }
  }
}

export const notificationsService = new NotificationsService()
