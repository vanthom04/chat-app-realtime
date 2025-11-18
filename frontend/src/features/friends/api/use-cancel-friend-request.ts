import { toast } from "sonner"
import { AxiosError } from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"

export const useCancelFriendRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (recipientId: string) => {
      const res = await api.delete(`/api/friends/cancel-request/${recipientId}`, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      return res
    },
    onSuccess: async () => {
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
