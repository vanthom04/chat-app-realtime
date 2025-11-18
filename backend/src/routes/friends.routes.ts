import express from "express"

import { isAuthorized } from "@/middlewares/auth.middleware"
import { friendsController } from "@/controllers/friends.controller"

const router = express.Router()

router
  .route("/")
  .get(isAuthorized, friendsController.myFriend)

router
  .route("/accepted-requests")
  .get(isAuthorized, friendsController.acceptedFriendRequests)

router
  .route("/sent-requests")
  .get(isAuthorized, friendsController.sentFriendRequests)

router
  .route("/send-request")
  .post(isAuthorized, friendsController.sendFriendRequest)

router
  .route("/accept-request")
  .post(isAuthorized, friendsController.acceptFriendRequest)

router
  .route("/reject-request/:requesterId")
  .delete(isAuthorized, friendsController.rejectFriendRequest)

router
  .route("/cancel-request/:recipientId")
  .delete(isAuthorized, friendsController.cancelFriendRequest)

router
  .route("/:friendId")
  .delete(isAuthorized, friendsController.unfriend)

export default router
