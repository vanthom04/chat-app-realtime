import multer from "multer"
import express from "express"

import { isAuthorized } from "@/middlewares/auth.middleware"
import { usersValidation } from "@/validations/users.validation"
import { usersController } from "@/controllers/users.controller"

const router = express.Router()

router
  .route("/me")
  .get(isAuthorized, usersController.getMe)

router
  .route("/search")
  .get(isAuthorized, usersController.searchUser)

router
  .route("/:id")
  .get(isAuthorized, usersController.getById)
  .put(isAuthorized, usersValidation.updateUser, usersController.updateUser)

router
  .route("/:id/password")
  .patch(isAuthorized, usersValidation.updatePassword, usersController.updatePassword)

// custom field upload avatar
const uploadAvatar = multer({
  limits: {
    fieldSize: 3 * 1024 * 1024 // 3MB
  }
})

router
  .route("/avatar/:id")
  .patch(isAuthorized, uploadAvatar.single("imageFile"), usersController.changeAvatar)

export default router
