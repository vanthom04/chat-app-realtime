import { MessageType } from "../../generated/prisma"

export interface MessageBody {
  type: MessageType
  content: string
  conversationId: string
  attachmentUrl?: string
}
