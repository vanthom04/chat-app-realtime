import Joi from "joi"

import { Request, Response, NextFunction } from "express"

import { USERNAME_REGEX } from "@/utils/validators"
import { BadRequestException } from "@/exceptions/bad-request-exception"

class AuthValidation {
  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const correctCondition = Joi.object({
        username: Joi
          .string()
          .max(16)
          .pattern(USERNAME_REGEX)
          .message("Username không hợp lệ")
          .trim()
          .strict()
          .required(),
        email: Joi.string().email().max(30).trim().strict().required(),
        password: Joi.string().min(6).max(128).trim().strict().required()
      })

      // Với abortEarly: true  -> chỉ báo 1 lỗi đầu tiên
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

  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const correctCondition = Joi.object({
        identifier: Joi.alternatives().try(
          Joi
            .string()
            .email({ tlds: { allow: false } })
            .max(50)
            .trim()
            .strict()
            .lowercase(),
          Joi
            .string()
            .max(16)
            .pattern(USERNAME_REGEX)
            .trim()
            .strict()
            .lowercase()
        ).messages({
          "alternatives.match":
            "identifier phải là email hợp lệ hoặc username 3-24 ký tự (a-z, 0-9, ., _, -).",
          "string.email": "Email không hợp lệ.",
          "string.pattern.base":
            "Username phải 3-24 ký tự, chỉ chứa a-z, 0-9, ., _, - và không bắt đầu/kết thúc bằng ký tự đặc biệt."
        }),
        password: Joi.string().min(6).max(128).trim().strict().required()
      })

      // Với abortEarly: true -> chỉ báo 1 lỗi đầu tiên
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

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const correctCondition = Joi.object({
        email: Joi.string().email().max(30).trim().strict().required()
      })

      // Với abortEarly: true  -> chỉ báo 1 lỗi đầu tiên
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

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const correctCondition = Joi.object({
        token: Joi.string().trim().strict().required(),
        newPassword: Joi.string().min(6).max(128).trim().strict().required(),
        confirmNewPassword: Joi.string().min(6).max(128).trim().strict().required()
      })

      // Với abortEarly: true  -> chỉ báo 1 lỗi đầu tiên
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

export const authValidation = new AuthValidation()
