import type { CorsOptions } from "cors"

export const corsOptions: CorsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  optionsSuccessStatus: 200,
  credentials: true
}
