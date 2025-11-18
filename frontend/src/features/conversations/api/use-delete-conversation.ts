import { toast } from "sonner"
import { AxiosError } from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api"
import { useRouter } from "@/hooks/use-router"

export const useDeleteConversation = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/conversations/${id}`, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      return res
    },
    onSuccess: async (data: any) => {
      router.push("/")
      await queryClient.invalidateQueries({ queryKey: ["conversations"] })
      queryClient.setQueryData([`chat:${data.id}`], () => {
        return {
          pages: [{ items: [], nextCursor: null }],
          pageParams: [undefined]
        }
      })
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data?.message) {
        return toast.error(error.response?.data?.message)
      }

      toast.error(error.message)
    }
  })
}
