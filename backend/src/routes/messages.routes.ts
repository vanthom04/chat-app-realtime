import express from "express"

import { isAuthorized } from "@/middlewares/auth.middleware"
import { messagesValidation } from "@/validations/messages.validation"
import { messagesController } from "@/controllers/messages.controller"

const router = express.Router()

router
  .route("/")
  .get(isAuthorized, messagesController.getMessages)
  .post(isAuthorized, messagesValidation.createNew, messagesController.createNew)

export default router
