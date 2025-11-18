import { StatusCodes } from "http-status-codes"
import { Request, Response, NextFunction } from "express"

import { friendsService } from "@/services/friends.service"

class FriendsController {
  // Bạn bè của tôi
  async myFriend(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub as string
      const friends = await friendsService.myFriend(userId)
      res.status(StatusCodes.OK).json(friends)
    } catch (error) {
      next(error)
    }
  }

  // Đã nhận được yêu cầu kết bạn
  async acceptedFriendRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub as string
      const result = await friendsService.acceptedFriendRequests(userId)
      res.status(StatusCodes.OK).json(result)
    } catch (error) {
      next(error)
    }
  }

  // Đã gửi yêu cầu kết bạn
  async sentFriendRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub as string
      const result = await friendsService.sentFriendRequests(userId)
      res.status(StatusCodes.OK).json(result)
    } catch (error) {
      next(error)
    }
  }

  // Gửi yêu cầu kết bạn
  async sendFriendRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const requesterId = req.user?.sub as string
      const recipientId = req.body.userId as string
      const result = await friendsService.sendFriendRequest(requesterId, recipientId)
      res.status(StatusCodes.OK).json(result)
    } catch (error) {
      next(error)
    }
  }

  // Chập nhận yêu cầu kết bạn
  async acceptFriendRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const recipientId = req.user?.sub as string
      const requesterId = req.body.userId as string
      const result = await friendsService.acceptFriendRequest(requesterId, recipientId)
      res.status(StatusCodes.OK).json(result)
    } catch (error) {
      next(error)
    }
  }

  // Từ chối yêu cầu kết bạn
  async rejectFriendRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const recipientId = req.user?.sub as string
      const requesterId = req.params.requesterId as string
      const result = await friendsService.rejectFriendRequest(requesterId, recipientId)
      res.status(StatusCodes.OK).json(result)
    } catch (error) {
      next(error)
    }
  }

  // Hủy yêu cầu kết bạn
  async cancelFriendRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const requesterId = req.user?.sub as string
      const recipientId = req.params.recipientId as string
      const result = await friendsService.cancelFriendRequest(requesterId, recipientId)
      res.status(StatusCodes.OK).json(result)
    } catch (error) {
      next(error)
    }
  }

  // Hủy kết bạn
  async unfriend(req: Request, res: Response, next: NextFunction) {
    try {
      const friendId = req.params.friendId as string
      const result = await friendsService.unfriend(friendId)
      res.status(StatusCodes.OK).json(result)
    } catch (error) {
      next(error)
    }
  }
}

export const friendsController = new FriendsController()
