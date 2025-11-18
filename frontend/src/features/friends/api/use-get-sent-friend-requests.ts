import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

import type { FriendRequestResponse } from "../types"

export const useGetSentFriendRequests = () => {
  return useQuery({
    queryKey: ["sent-friend-requests"],
    queryFn: async () => {
      const res = await api.get<FriendRequestResponse[]>("/api/friends/sent-requests", {
        headers: {
          "Content-Type": "application/json"
        }
      })

      return res
    }
  })
}
