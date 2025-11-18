import { prisma } from "@/lib/prisma"
import { MessageBody } from "@/types/messages"
import { OBJECT_ID_REGEX } from "@/utils/validators"
import { NotFoundException } from "@/exceptions/not-found-exception"
import { BadRequestException } from "@/exceptions/bad-request-exception"

const MESSAGES_BATCH = 10

class MessagesService {
  async createNew(userId: string, reqBody: MessageBody) {
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: reqBody.conversationId
      }
    })

    if (!conversation) {
      throw new NotFoundException("Cuộc trò chuyện không tồn tại")
    }

    const newMessage = await prisma.message.create({
      data: {
        type: reqBody.type,
        content: reqBody.content,
        attachmentUrl: reqBody.attachmentUrl,
        conversation: {
          connect:  {
            id: reqBody.conversationId
          }
        },
        sender: {
          connect: {
            id: userId
          }
        }
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
      }
    })

    await prisma.conversation.update({
      where: {
        id: reqBody.conversationId
      },
      data: {
        lastMessageAt: new Date()
      }
    })

    return newMessage
  }

  async getMessages(conversationId: string, cursor?: string) {
    if (!conversationId || !OBJECT_ID_REGEX.test(conversationId)) {
      throw new BadRequestException("conversationId invalid")
    }

    let messages = []

    if (cursor) {
      messages = await prisma.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          conversationId
        },
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
        skip: 1,
        cursor: {
          id: cursor
        }
      })
    } else {
      messages = await prisma.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          conversationId
        },
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
        }
      })
    }

    let nextCursor = null
    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id
    }

    return {
      items: messages,
      nextCursor
    }
  }
}

export const messagesService = new MessagesService()
