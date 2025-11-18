import { useMemo } from "react"

import type { Conversation } from "@/features/conversations/types"

import { useAuthStore } from "@/hooks/use-auth-store"

export const useOtherUser = (conversation: Conversation) => {
  const { user } = useAuthStore()

  const otherUser = useMemo(() => {
    return conversation.participants.filter((p) => p.id !== user?.id)[0]
  }, [user?.id, conversation.participants])

  return otherUser
}
