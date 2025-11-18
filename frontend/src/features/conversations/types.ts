import { z } from "zod"

import type { User } from "../users/types"
import type { createGroupSchema } from "./schemas"
import type { Message } from "../messages/types"

export type CreateGroupValues = z.infer<typeof createGroupSchema>

export interface Conversation {
  id: string
  name?: string
  type: "DIRECT" | "GROUP"
  imageUrl?: string
  lastMessageAt: Date
  participants: User[]
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}
