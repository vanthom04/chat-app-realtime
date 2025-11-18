import { toast } from "sonner"
import { AxiosError } from "axios"
import { useMutation } from "@tanstack/react-query"

import { api } from "@/lib/api"
import { useAuthStore } from "@/hooks/use-auth-store"

import type { User } from "../types"

export const useChangeAvatar = () => {
  return useMutation<User, Error, FormData>({
    mutationFn: async (data: FormData) => {
      const userId = data.get("userId")
      const res = await api.patch(`/api/users/avatar/${userId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data"
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
