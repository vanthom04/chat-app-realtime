import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

import type { User } from "../types"

interface Props {
  userId: string
}

export const useGetUserById = ({ userId }: Props) => {
  return useQuery({
    queryKey: ["users", { userId }],
    queryFn: async () => {
      return await api.get<User>(`/api/users/${userId}`, {
        headers: {
          "Content-Type": "application/json"
        }
      })
    },
    enabled: !!userId
  })
}
