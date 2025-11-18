import { prisma } from "@/lib/prisma"
import { ConflictException } from "@/exceptions/conflict-exception"
import { NotFoundException } from "@/exceptions/not-found-exception"

class FriendsService {
  // Bạn bè của tôi
  async myFriend(userId: string) {
    const results = await prisma.friendship.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ requesterId: userId }, { recipientId: userId }]
      },
      select: {
        requester: true,
        recipient: true
      },
      orderBy: {
        updatedAt: "desc"
      }
    })

    const friends = results.map((f) => {
      const isRequester = f.requester.id === userId
      const friend = isRequester ? f.recipient : f.requester
      return friend
    })

    return friends
  }

  // Đã nhận được yêu cầu kết bạn
  async acceptedFriendRequests(userId: string) {
    const requests = await prisma.friendship.findMany({
      where: {
        status: "PENDING",
        recipientId: userId
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        requester: {
          select: {
            id: true,
            email: true,
            username: true,
            displayName: true,
            avatarUrl: true
          }
        }
      }
    })

    return requests.map((r) => ({ ...r, ...r.requester, userId: r.requester.id }))
  }

  // Đã gửi yêu cầu kết bạn
  async sentFriendRequests(userId: string) {
    const requests = await prisma.friendship.findMany({
      where: {
        status: "PENDING",
        requesterId: userId
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        recipient: {
          select: {
            id: true,
            email: true,
            username: true,
            displayName: true,
            avatarUrl: true
          }
        }
      }
    })

    return requests.map((r) => ({ ...r, ...r.recipient, userId: r.recipient.id }))
  }

  // Gửi yêu cầu kết bạn
  async sendFriendRequest(requesterId: string, recipientId: string) {
    const user = await prisma.user.findFirst({
      where: {
        id: recipientId
      },
      select: {
        id: true
      }
    })

    if (!user) {
      throw new NotFoundException("Không tìm thấy tài khoản")
    }

    if (requesterId === recipientId) {
      throw new NotFoundException("Không thể gửi yêu cầu kết bạn với chính mình")
    }

    const friend = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId, recipientId },
          { recipientId: requesterId, requesterId: recipientId }
        ]
      },
      select: {
        id: true,
        status: true
      }
    })

    if (friend && friend.status === "BLOCKED") {
      throw new ConflictException("Không thể gửi yêu cầu kết bạn")
    }

    if (friend && friend.status === "PENDING") {
      throw new ConflictException("Yêu cầu kết bạn đang chờ xử lý")
    }

    if (friend && friend.status === "ACCEPTED") {
      throw new ConflictException("Hai người đã là bạn bè")
    }

    // Gửi yêu cầu kết bạn
    await prisma.friendship.create({
      data: { requesterId, recipientId }
    })

    return { success: true }
  }

  // Chập nhận yêu cầu kết bạn
  async acceptFriendRequest(requesterId: string, recipientId: string) {
    const request = await prisma.friendship.findFirst({
      where: { requesterId, recipientId },
      select: {
        id: true
      }
    })

    if (!request) {
      throw new NotFoundException("Không tìm thấy yêu cầu kết bạn")
    }

    await prisma.$transaction([
      prisma.friendship.update({
        where: {
          id: request.id
        },
        data: {
          status: "ACCEPTED"
        }
      }),
      prisma.conversation.create({
        data: {
          type: "DIRECT",
          participants: {
            create: [{ userId: requesterId }, { userId: recipientId }]
          }
        }
      })
    ])

    return { success: true }
  }

  // Từ chối yêu cầu kết bạn
  async rejectFriendRequest(requesterId: string, recipientId: string) {
    const request = await prisma.friendship.findFirst({
      where: { requesterId, recipientId },
      select: {
        id: true
      }
    })

    if (!request) {
      throw new NotFoundException("Không tìm thấy yêu cầu kết bạn")
    }

    await prisma.friendship.deleteMany({
      where: { requesterId, recipientId }
    })

    return { success: true }
  }

  // Hủy yêu cầu kết bạn
  async cancelFriendRequest(requesterId: string, recipientId: string) {
    const request = await prisma.friendship.findFirst({
      where: { requesterId, recipientId },
      select: {
        id: true
      }
    })

    if (!request) {
      throw new NotFoundException("Không tìm thấy yêu cầu kết bạn")
    }

    await prisma.friendship.deleteMany({
      where: { requesterId, recipientId }
    })

    return { success: true }
  }

  // Hủy kết bạn
  async unfriend(friendId: string) {
    const friend = await prisma.friendship.findFirst({
      where: { id: friendId },
      select: {
        id: true
      }
    })

    if (!friend) {
      throw new NotFoundException("Không tìm thấy bạn bè")
    }

    await prisma.friendship.deleteMany({
      where: {
        id: friendId
      }
    })

    return { success: true }
  }
}

export const friendsService = new FriendsService()
