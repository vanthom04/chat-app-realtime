import express from "express"

import { isAuthorized } from "@/middlewares/auth.middleware"
import { conversationsController } from "@/controllers/conversations.controller"
import { conversationsValidation } from "@/validations/conversations.validation"

const router = express.Router()

router
  .route("/")
  .get(isAuthorized, conversationsController.getConversations)
  .post(isAuthorized, conversationsValidation.createNew, conversationsController.createNew)

router
  .route("/:id")
  .get(isAuthorized, conversationsController.getById)
  .put(isAuthorized, conversationsController.updateConversation)
  .delete(isAuthorized, conversationsController.deleteConversation)

export default router
