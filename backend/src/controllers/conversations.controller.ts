import { StatusCodes } from "http-status-codes"
import { Request, Response, NextFunction } from "express"

import { conversationsService } from "@/services/conversations.service"

class ConversationsController {
  async createNew(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUserId = req.user?.sub as string
      const conversation = await conversationsService.createNew(req.body, currentUserId)
      res.status(StatusCodes.OK).json(conversation)
    } catch (error) {
      next(error)
    }
  }

  async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUserId = req.user?.sub as string
      const conversations = await conversationsService.getConversations(currentUserId)
      res.status(StatusCodes.OK).json(conversations)
    } catch (error) {
      next(error)
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const conversations = await conversationsService.getById(req.params.id)
      res.status(StatusCodes.OK).json(conversations)
    } catch (error) {
      next(error)
    }
  }

  async updateConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const conversations = await conversationsService.updateConversation(req.params.id)
      res.status(StatusCodes.OK).json(conversations)
    } catch (error) {
      next(error)
    }
  }

  async deleteConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const conversation = await conversationsService.deleteConversation(req.params.id)
      res.status(StatusCodes.OK).json(conversation)
    } catch (error) {
      next(error)
    }
  }
}

export const conversationsController = new ConversationsController()
