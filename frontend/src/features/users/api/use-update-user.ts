import { toast } from "sonner"
import { AxiosError } from "axios"
import { useMutation } from "@tanstack/react-query"

import { api } from "@/lib/api"
import { useAuthStore } from "@/hooks/use-auth-store"

import type { User, UserUpdateValues } from "../types"

export const useUpdateUser = () => {
  return useMutation<User, Error, UserUpdateValues>({
    mutationFn: async ({ id, ...data }: UserUpdateValues) => {
      const res = await api.put(`/api/users/${id}`, data, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      return res as User
    },
    onSuccess: async (user) => {
      useAuthStore.setState({ user })
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data?.message) {
        return toast.error(error.response?.data?.message)
      }

      toast.error(error.message)
    }
  })
}
