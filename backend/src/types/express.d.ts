import type { Server } from "socket.io"
import type { JwtPayload } from "jsonwebtoken"
import "express-serve-static-core"

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }

    interface Response {
      io?: Server
    }
  }
}

export {}
