import { StatusCodes } from "http-status-codes"

import { HttpException } from "./http-exception"

export class NotFoundException extends HttpException {
  constructor(message: string = "Not Found Exception") {
    super(StatusCodes.NOT_FOUND, message)
  }
}
