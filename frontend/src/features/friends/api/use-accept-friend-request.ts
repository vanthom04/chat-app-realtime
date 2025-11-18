import { toast } from "sonner"
import { AxiosError } from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api"

export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await api.post("/api/friends/accept-request", { userId }, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      return res
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-friends"] })
      await queryClient.invalidateQueries({ queryKey: ["conversations"] })
      await queryClient.invalidateQueries({ queryKey: ["accepted-friend-requests"] })
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data?.message) {
        return toast.error(error.response?.data?.message)
      }

      toast.error(error.message)
    }
  })
}
