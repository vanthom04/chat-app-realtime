import { Request, Response, NextFunction } from "express"
import Joi from "joi"

import { OBJECT_ID_REGEX } from "@/utils/validators"
import { BadRequestException } from "@/exceptions/bad-request-exception"

class ConversationsValidation {
  async createNew(req: Request, res: Response, next: NextFunction) {
    try {
      const correctCondition = Joi.object({
        name: Joi.string().min(1).max(256).trim().strict().required(),
        memberIds: Joi.array().items(
          Joi.string().pattern(OBJECT_ID_REGEX).message("Invalid ID")
        ).required()
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

export const conversationsValidation = new ConversationsValidation()
