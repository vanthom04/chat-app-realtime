import Joi from "joi"

import { Request, Response, NextFunction } from "express"

import { BadRequestException } from "@/exceptions/bad-request-exception"
import { USERNAME_REGEX } from "@/utils/validators"

class UsersValidation {
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const correctCondition = Joi.object({
        displayName: Joi.string().min(3).max(50).trim().strict(),
        username: Joi.string().max(16).pattern(USERNAME_REGEX).trim().strict().required(),
        email: Joi.string().email().max(30).trim().strict().required(),
        bio: Joi.string().max(512).trim().strict().allow("", null).optional()
      })

      await correctCondition.validateAsync(req.body, { abortEarly: true })
      next()
    } catch (error) {
      if (error instanceof Error) {
        next(new BadRequestException(error.message))
      } else {
        next(new BadRequestException("An unknown error occurred"))
      }
    }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const correctCondition = Joi.object({
        currentPassword: Joi.string().min(6).max(30).trim().strict().required(),
        newPassword: Joi.string().min(6).max(30).trim().strict().required(),
        confirmNewPassword: Joi.string().min(6).max(30).trim().strict().required(),
      })

      await correctCondition.validateAsync(req.body, { abortEarly: true })
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

export const usersValidation = new UsersValidation()
