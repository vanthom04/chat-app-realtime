export class HttpException extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "HttpException"
    this.status = status
    this.message = message
    Error.captureStackTrace(this, this.constructor)
  }
}
