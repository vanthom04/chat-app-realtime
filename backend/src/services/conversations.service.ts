import { prisma } from "@/lib/prisma"
import { deleteFile } from "@/lib/imagekit"
import { ConversationBody } from "@/types/conversations"
import { NotFoundException } from "@/exceptions/not-found-exception"
import { BadRequestException } from "@/exceptions/bad-request-exception"

class ConversationsService {
  async createNew(reqBody: ConversationBody, currentUserId: string) {
    if (reqBody.memberIds.length < 2) {
      throw new BadRequestException("Phải có ít nhất 3 thành viên trong nhóm")
    }

    const newConversation = await prisma.conversation.create({
      data: {
        type: "GROUP",
        name: reqBody.name,
        participants: {
          create: [
            ...reqBody.memberIds.map((memberId) => ({
              userId: memberId
            })),
            {
              role: "ADMIN",
              userId: currentUserId
            }
          ]
        }
      }
    })

    return newConversation
  }

  async getConversations(currentUserId: string) {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId: currentUserId }
        }
      },
      orderBy: {
        lastMessageAt: "desc"
      },
      select: {
        id: true,
        type: true,
        name: true,
        imageUrl: true,
        lastMessageAt: true,
        participants: {
          select: {
            user: true
          }
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc"
          },
          select: {
            id: true,
            type: true,
            content: true,
            attachmentUrl: true,
            createdAt: true,
            updatedAt: true,
            sender: {
              select: {
                id: true,
                username: true,
                displayName: true,
                email: true,
                avatarUrl: true,
                lastSeen: true
              }
            }
          },
        },
        createdAt: true,
        updatedAt: true
      }
    })

    return conversations.map((c) => ({
      ...c,
      participants: c.participants.filter((p) => p.user.id !== currentUserId).map((u) => u.user)
    }))
  }

  async getById(id: string) {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      select: {
        id: true,
        type: true,
        name: true,
        imageUrl: true,
        lastMessageAt: true,
        participants: {
          select: {
            user: true
          }
        },
        createdAt: true,
        updatedAt: true
      }
    })

    if (!conversation) {
      throw new NotFoundException("Không tìm thấy cuộc hội thoại")
    }

    return {
      ...conversation,
      participants: conversation.participants.map((p) => p.user)
    }
  }

  async updateConversation(id: string) {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      select: {
        id: true,
        imageUrl: true
      }
    })

    if (!conversation) {
      throw new NotFoundException("Không tìm thấy cuộc trò chuyện")
    }

    return { success: true }
  }

  async deleteConversation(id: string) {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      select: {
        id: true,
        type: true,
        imageUrl: true
      }
    })

    if (!conversation) {
      throw new NotFoundException("Không tìm thấy cuộc trò chuyện")
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversation.id
      },
      select: {
        id: true,
        type: true,
        attachmentUrl: true
      }
    })

    const imagesDelete = messages
      .map((m) => m.type === "IMAGE" ? m.attachmentUrl : null)
      .filter(Boolean) as string[]

    await Promise.all([imagesDelete.map((url) => deleteFile(url))])

    if (conversation.type === "GROUP") {
      if (conversation.imageUrl?.includes("ik.imagekit.io")) {
        await deleteFile(conversation.imageUrl)
      }

      await prisma.$transaction([
        // delete participants
        prisma.participant.deleteMany({
          where: {
            conversationId: conversation.id
          }
        }),
        // delete messages
        prisma.message.deleteMany({
          where: {
            conversationId: conversation.id
          }
        }),
        // delete read receipt
        prisma.readReceipt.deleteMany({
          where: {
            conversationId: conversation.id
          }
        }),
        // delete conversation
        prisma.conversation.delete({
          where: {
            id: conversation.id
          }
        })
      ])
    } else {
      await prisma.$transaction([
        // delete messages
        prisma.message.deleteMany({
          where: {
            conversationId: conversation.id
          }
        }),
        // delete read receipt
        prisma.readReceipt.deleteMany({
          where: {
            conversationId: conversation.id
          }
        })
      ])
    }

    return conversation
  }
}

export const conversationsService = new ConversationsService()
