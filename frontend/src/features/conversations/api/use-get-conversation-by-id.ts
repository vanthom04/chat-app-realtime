import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"
import type { Conversation } from "../types"

export const useGetConversationById = (id: string) => {
  return useQuery({
    queryKey: ["conversation", { id }],
    queryFn: async () => {
      const res = await api.get<Conversation>(`/api/conversations/${id}`, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      return res
    }
  })
}
