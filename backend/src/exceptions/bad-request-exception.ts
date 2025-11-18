import { StatusCodes } from "http-status-codes"

import { HttpException } from "./http-exception"

export class BadRequestException extends HttpException {
  constructor(message: string = "Bad Request Exception") {
    super(StatusCodes.BAD_REQUEST, message)
  }
}
