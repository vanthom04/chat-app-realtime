import { StatusCodes } from "http-status-codes"
import { Request, Response, NextFunction } from "express"

import { messagesService } from "@/services/messages.service"

class MessagesController {
  async createNew(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub as string
      const message = await messagesService.createNew(userId, req.body)

      // Add new message socket
      res.io?.emit(`chat:${req.body.conversationId}:messages`, message)

      return res.status(StatusCodes.OK).json({ success: true })
    } catch (error) {
      next(error)
    }
  }

  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const cursor = req.query.cursor as string | undefined
      const conversationId = req.query.conversationId as string
      const messages = await messagesService.getMessages(conversationId, cursor)
      return res.status(StatusCodes.OK).json(messages)
    } catch (error) {
      next(error)
    }
  }

  async updateMessage(req: Request, res: Response, next: NextFunction) {
    try {
      // Logic
    } catch (error) {
      next(error)
    }
  }

  async deleteMessage(req: Request, res: Response, next: NextFunction) {
    try {
      // Logic
    } catch (error) {
      next(error)
    }
  }
}

export const messagesController = new MessagesController()
