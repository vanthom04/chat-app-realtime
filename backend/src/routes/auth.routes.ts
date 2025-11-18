import express from "express"

import { isAuthorized } from "@/middlewares/auth.middleware"
import { authValidation } from "@/validations/auth.validation"
import { authController } from "@/controllers/auth.controller"

const router = express.Router()

router
  .route("/sign-up")
  .post(authValidation.signUp, authController.signUp)

router
  .route("/sign-in")
  .post(authValidation.signIn, authController.signIn)

router
  .route("/forgot-password")
  .post(authValidation.forgotPassword, authController.forgotPassword)

router
  .route("/reset-password")
  .post(authValidation.resetPassword, authController.resetPassword)

router
  .route("/sign-out")
  .post(authController.signOut)

router
  .route("/refresh-token")
  .post(authController.refreshToken)

router
  .route("/imagekit")
  .post(isAuthorized, authController.imageKit)

export default router
