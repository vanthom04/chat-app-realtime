import { toast } from "sonner"
import { AxiosError } from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api"

import type { FriendResponse, SendFriendRequestData } from "../types"

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: SendFriendRequestData) => {
      const res = await api.post<FriendResponse>("/api/friends/send-request", data, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      return res
    },
    onSuccess: async () => {
      toast.success("Yêu cầu kết bạn đã được gửi")
      await queryClient.invalidateQueries({ queryKey: ["sent-friend-requests"] })
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data?.message) {
        return toast.error(error.response?.data?.message)
      }

      toast.error(error.message)
    }
  })
}
