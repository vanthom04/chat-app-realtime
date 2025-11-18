import { StatusCodes } from "http-status-codes"
import { Request, Response, NextFunction } from "express"

import { imagekit } from "@/lib/imagekit"
import { authService } from "@/services/auth.service"

class AuthController {
  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const [accessToken, refreshToken] = await authService.signUp(req.body)

      // Set refreshToken cookie
      res.cookie("refreshToken", refreshToken, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        secure: process.env.NODE_ENV === "production"
      })

      res.status(StatusCodes.CREATED).json({ accessToken })
    } catch (error) {
      next(error)
    }
  }

  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const [accessToken, refreshToken] = await authService.signIn(req.body)

      // Set refreshToken cookie
      res.cookie("refreshToken", refreshToken, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        secure: process.env.NODE_ENV === "production"
      })

      res.status(StatusCodes.OK).json({ accessToken })
    } catch (error) {
      next(error)
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.forgotPassword(req.body.email)
      res.status(StatusCodes.OK).json(result)
    } catch (error) {
      next(error)
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.resetPassword(req.body)
      res.status(StatusCodes.OK).json(result)
    } catch (error) {
      next(error)
    }
  }

  async signOut(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.signOut(req.cookies?.refreshToken)
      res.clearCookie("refreshToken")
      res.sendStatus(StatusCodes.NO_CONTENT)
    } catch (error) {
      next(error)
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken
      const accessToken = await authService.refreshToken(refreshToken)
      res.status(StatusCodes.OK).json({ accessToken })
    } catch (error) {
      next(error)
    }
  }

  async imageKit(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, expire, signature } = imagekit.getAuthenticationParameters()
      res.status(StatusCodes.OK).json({
        token,
        expire,
        signature,
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY
      })
    } catch (error) {
      next(error)
    }
  }
}

export const authController = new AuthController()
