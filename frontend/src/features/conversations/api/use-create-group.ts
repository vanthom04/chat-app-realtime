import { toast } from "sonner"
import { AxiosError } from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api"
import { useRouter } from "@/hooks/use-router"

import type { Conversation, CreateGroupValues } from "../types"

export const useCreateGroup = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: CreateGroupValues) => {
      const res = await api.post<Conversation>("/api/conversations", data, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      return res
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["conversations"] })
      router.push(`/conversations/${data.id}`)
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data?.message) {
        return toast.error(error.response?.data?.message)
      }

      toast.error(error.message)
    }
  })
}
