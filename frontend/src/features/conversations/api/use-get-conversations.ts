import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"
import type { Conversation } from "../types"

export const useGetConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await api.get<Conversation[]>("/api/conversations", {
        headers: {
          "Content-Type": "application/json"
        }
      })

      return res
    }
  })
}
