import { StatusCodes } from "http-status-codes"

import { HttpException } from "./http-exception"

export class ConflictException extends HttpException {
  constructor(message: string = "Conflict Exception") {
    super(StatusCodes.CONFLICT, message)
  }
}
