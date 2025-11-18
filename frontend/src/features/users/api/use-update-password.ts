import { toast } from "sonner"
import { AxiosError } from "axios"
import { useMutation } from "@tanstack/react-query"

import { api } from "@/lib/api"
import { useAuthStore } from "@/hooks/use-auth-store"

import type { User, UpdatePasswordValues } from "../types"

export const useUpdatePassword = () => {
  return useMutation<User, Error, UpdatePasswordValues>({
    mutationFn: async ({ id, ...data }) => {
      const res = await api.patch(`/api/users/${id}/password`, data, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      return res as User
    },
    onSuccess: (user) => {
      useAuthStore.setState({ user })
      toast.success("Mật khẩu của bạn đã được thay đổi.")
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data?.message) {
        return toast.error(error.response?.data?.message)
      }

      toast.error(error.message)
    }
  })
}
