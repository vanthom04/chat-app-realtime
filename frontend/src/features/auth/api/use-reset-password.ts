import { toast } from "sonner"
import { AxiosError } from "axios"
import { useMutation } from "@tanstack/react-query"

import { api } from "@/lib/api"
import { useRouter } from "@/hooks/use-router"

import type { ResetPasswordValues } from "../types"

export const useResetPassword = () => {
  const router = useRouter()

  return useMutation<unknown, Error, ResetPasswordValues>({
    mutationFn: async (data) => {
      const res = await api.post("/api/auth/reset-password", data, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      return res
    },
    onSuccess: () => {
      router.push("/")
      toast.success("Đổi mật khẩu thành công. Vui lòng đăng nhập lại!")
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data?.message) {
        return toast.error(error.response?.data?.message)
      }

      toast.error(error.message)
    }
  })
}
