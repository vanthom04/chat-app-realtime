import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

import type { User } from "@/features/users/types"

export const useGetMyFriends = () => {
  return useQuery({
    queryKey: ["my-friends"],
    queryFn: async () => {
      const res = await api.get<User[]>("/api/friends", {
        headers: {
          "Content-Type": "application/json"
        }
      })

      return res
    }
  })
}
