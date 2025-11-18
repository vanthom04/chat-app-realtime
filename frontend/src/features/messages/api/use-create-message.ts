import { toast } from "sonner"
import { AxiosError } from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api"

import type { CreateMessageValues } from "../types"

export const useCreateMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateMessageValues) => {
      const res = await api.post("/api/messages", data, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      return res
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["conversations"] })
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data?.message) {
        return toast.error(error.response?.data?.message)
      }

      toast.error(error.message)
    }
  })
}
