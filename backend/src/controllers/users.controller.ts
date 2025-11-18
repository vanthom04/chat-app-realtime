import { StatusCodes } from "http-status-codes"
import { Request, Response, NextFunction } from "express"

import { usersService } from "@/services/users.service"

class UsersController {
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub as string
      const user = await usersService.getById(userId)
      res.status(StatusCodes.OK).json(user)
    } catch (error) {
      next(error)
    }
  }

  async searchUser(req: Request, res: Response, next: NextFunction) {
    try {
      const identifier = req.query.identifier as string
      const user = await usersService.searchByUsernameOrEmail(identifier)
      res.status(StatusCodes.OK).json(user)
    } catch (error) {
      next(error)
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id as string
      const user = await usersService.getById(userId)
      res.status(StatusCodes.OK).json(user)
    } catch (error) {
      next(error)
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id as string
      const user = await usersService.updateUser(userId, req.body)
      res.status(StatusCodes.OK).json(user)
    } catch (error) {
      next(error)
    }
  }

  async changeAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id as string
      const user = await usersService.changeAvatar(userId, req.file)
      res.status(StatusCodes.OK).json(user)
    } catch (error) {
      next(error)
    }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id as string
      const user = await usersService.updatePassword(userId, req.body)
      res.status(StatusCodes.OK).json(user)
    } catch (error) {
      next(error)
    }
  }
}

export const usersController = new UsersController()
