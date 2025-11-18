import { toast } from "sonner"
import { AxiosError } from "axios"
import { useMutation } from "@tanstack/react-query"

import { api } from "@/lib/api"
import type { User } from "../types"

export const useSearchUser = () => {
  return useMutation({
    mutationFn: async ({ identifier }: { identifier: string }) => {
      const res = await api.get<User>("/api/users/search", {
        params: { identifier },
        headers: {
          "Content-Type": "application/json"
        }
      })

      return res
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data?.message) {
        return toast.error(error.response?.data?.message)
      }

      toast.error(error.message)
    }
  })
}
