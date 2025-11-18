import { toast } from "sonner"
import { AxiosError } from "axios"
import { useMutation } from "@tanstack/react-query"

import { api } from "@/lib/api"

export const useUnfriend = () => {
  return useMutation({
    mutationFn: async (friendId: string) => {
      const res = await api.delete(`/api/friends/${friendId}`, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      return res
    },
    onSuccess: async () => {},
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data?.message) {
        return toast.error(error.response?.data?.message)
      }

      toast.error(error.message)
    }
  })
}
