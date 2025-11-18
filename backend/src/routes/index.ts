import express from "express"

import authRoutes from "./auth.routes"
import usersRoutes from "./users.routes"
import friendsRoutes from "./friends.routes"
import messagesRoutes from "./messages.routes"
import conversationsRoutes from "./conversations.routes"

const router = express.Router()

router.use("/auth", authRoutes)
router.use("/users", usersRoutes)
router.use("/friends", friendsRoutes)
router.use("/messages", messagesRoutes)
router.use("/conversations", conversationsRoutes)

export { router as APIsRoutes }
