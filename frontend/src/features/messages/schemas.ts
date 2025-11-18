import { z } from "zod"

import { OBJECT_ID_REGEX } from "@/utils/constants"

export const createMessageSchema = z.object({
  conversationId: z.string().regex(OBJECT_ID_REGEX, "conversationId phải là ObjectId"),
  type: z.enum(["TEXT", "IMAGE", "VIDEO", "FILE", "SYSTEM"]),
  content: z.string().trim().min(1, "Nội dung không được rỗng").nullish(),
  attachmentUrl: z.string().url().nullish()
})
