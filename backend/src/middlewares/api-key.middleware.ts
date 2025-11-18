import { Request, Response, NextFunction } from "express"
import { UnauthorizedException } from "@/exceptions/unauthorized-exception"

export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-api-key"] as string | undefined

  if (!apiKey || apiKey !== process.env.API_KEY) {
    throw new UnauthorizedException("Invalid API Key")
  }

  next()
}
