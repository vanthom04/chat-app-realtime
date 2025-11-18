import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

import type { FriendRequestResponse } from "../types"

export const useGetAcceptedFriendRequests = () => {
  return useQuery({
    queryKey: ["accepted-friend-requests"],
    queryFn: async () => {
      const res = await api.get<FriendRequestResponse[]>("/api/friends/accepted-requests", {
        headers: {
          "Content-Type": "application/json"
        }
      })

      return res
    }
  })
}
