import { z } from "zod"

import type { User } from "../users/types"
import type { createMessageSchema } from "./schemas"

export type CreateMessageValues = z.infer<typeof createMessageSchema>

export type MessageType = "TEXT" | "IMAGE" | "VIDEO" | "FILE" | "SYSTEM"

export interface Message {
  id: string
  content: string
  type: MessageType
  attachmentUrl?: string
  createdAt: Date
  updatedAt: Date
  sender: User
}

export type MessageWithSender = Message & {
  sender: User
}
