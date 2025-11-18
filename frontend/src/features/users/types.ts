import { z } from "zod"

import { updatePasswordSchema, userUpdateSchema } from "./schemas"

export type UserUpdateValues = z.infer<typeof userUpdateSchema> & {
  id: string
}

export type UpdatePasswordValues = z.infer<typeof updatePasswordSchema> & {
  id: string
}

export type UserStatus = "ONLINE" | "OFFLINE" | "AWAY"

export interface User {
  id: string
  username: string
  email: string
  displayName?: string
  avatarUrl?: string
  bio?: string
  status: UserStatus
  passwordUpdatedAt: Date
  lastSeen: Date
  createdAt: Date
  updatedAt: Date
}
