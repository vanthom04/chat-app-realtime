import "dotenv/config"
import http from "http"
import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"

import { createIO } from "@/socket"
import { APIsRoutes } from "@/routes"
import { corsOptions } from "@/lib/cors-options"
import { apiKeyMiddleware } from "@/middlewares/api-key.middleware"
import { errorHandlerMiddleware } from "@/middlewares/error.middleware"

const app = express()
const server = http.createServer(app)
const io = createIO(server)
const port = process.env.PORT ?? 5100

// Config middleware
app.use(helmet())
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json({ limit: "3mb" }))
app.use(express.urlencoded({ extended: true, limit: "3mb" }))
app.use(compression({ level: 6, threshold: 1024 }))

// Middleware IO
app.use((req, res, next) => {
  res.io = io
  next()
})

// Config routes
app.use("/api", apiKeyMiddleware, APIsRoutes)

// Handle middleware error
app.use(errorHandlerMiddleware)

server.listen(port, () => {
  console.info(`Server listening on ${port}`)
})
