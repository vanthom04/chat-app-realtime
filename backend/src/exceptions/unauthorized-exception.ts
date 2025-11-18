import { StatusCodes } from "http-status-codes"

import { HttpException } from "./http-exception"

export class UnauthorizedException extends HttpException {
  constructor(message: string = "Unauthorized Exception") {
    super(StatusCodes.UNAUTHORIZED, message)
  }
}
