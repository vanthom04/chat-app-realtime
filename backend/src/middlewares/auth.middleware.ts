import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"

import { UnauthorizedException } from "@/exceptions/unauthorized-exception"

export const isAuthorized = async (req: Request, res: Response, next: NextFunction) => {
  const accessTokenFromHeader = req.headers["authorization"]
  const accessToken = accessTokenFromHeader && accessTokenFromHeader.split(" ")[1]

  if (!accessToken) {
    throw new UnauthorizedException("Unauthorized! (Token not found)")
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as JwtPayload
    req.user = decoded
    next()
  } catch (error) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      throw new UnauthorizedException("Access token expired")
    }

    throw new UnauthorizedException("Unauthorized")
  }
}
