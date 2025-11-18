import Joi from "joi"

import { Request, Response, NextFunction } from "express"

import { OBJECT_ID_REGEX } from "@/utils/validators"
import { BadRequestException } from "@/exceptions/bad-request-exception"

import { MessageType } from "../../generated/prisma"

class MessagesValidation {
  async createNew(req: Request, res: Response, next: NextFunction) {
    try {
      const correctCondition = Joi.object({
        conversationId: Joi.string().pattern(OBJECT_ID_REGEX).message("Invalid ID").required(),
        type: Joi.string().valid(...Object.values(MessageType)).required(),
        content: Joi.string().max(2048).trim().strict().optional(),
        attachmentUrl: Joi.string().trim().strict().optional()
      })

      // Với abortEarly: true  -> chỉ báo 1 lỗi đầu tiên
      await correctCondition.validateAsync(req.body)
      next()
    } catch (error) {
      if (error instanceof Error) {
        next(new BadRequestException(error.message))
      } else {
        next(new BadRequestException("An unknown error occurred"))
      }
    }
  }
}

export const messagesValidation = new MessagesValidation()
