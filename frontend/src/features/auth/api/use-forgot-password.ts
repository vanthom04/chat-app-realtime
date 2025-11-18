import { toast } from "sonner"
import { AxiosError } from "axios"
import { useMutation } from "@tanstack/react-query"

import { api } from "@/lib/api"

import type { ForgotPasswordValues } from "../types"

export const useForgotPassword = () => {
  return useMutation<unknown, Error, ForgotPasswordValues>({
    mutationFn: async (data) => {
      const res = await api.post("/api/auth/forgot-password", data, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      return res
    },
    onSuccess: () => {
      toast.success("Xác minh thành công. Vui lòng kiểm tra email!")
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data?.message) {
        return toast.error(error.response?.data?.message)
      }

      toast.error(error.message)
    }
  })
}
