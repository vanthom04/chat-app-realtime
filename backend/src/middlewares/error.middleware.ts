import { Request, Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"

import { HttpException } from "@/exceptions/http-exception"

export const errorHandlerMiddleware = (
  err: HttpException,
  req: Request,
  res: Response,
  // eslint-disable-next-line
  next: NextFunction
) => {
  const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR
  const message = err.message || "INTERNAL SERVER ERROR"

  res.status(status).json({
    status,
    path: req.url,
    message,
    error: process.env.NODE_ENV === "development" ? err.stack : null
  })
}
