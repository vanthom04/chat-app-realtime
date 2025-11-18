import { toast } from "sonner"
import { create } from "zustand"
import { AxiosError } from "axios"

import type { User } from "@/features/users/types"
import type { AuthResponse, SignInValues, SignUpValues } from "@/features/auth/types"

import { api } from "@/lib/api"

interface AuthStore {
  isLoading: boolean
  user: User | null
  accessToken: string | null
  getMe: () => Promise<void>
  setAccessToken: (accessToken: string) => void
  signIn: (data: SignInValues) => Promise<void>
  signUp: (data: SignUpValues) => Promise<void>
  signOut: () => Promise<void>
  refresh: () => Promise<void>
  reset: () => void
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isLoading: true,
  user: null,
  accessToken: null,
  // Get me
  getMe: async () => {
    try {
      set({ isLoading: true })
      const user = await api.get<User>("/api/users/me", {
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (user) set({ user })
    } finally {
      set({ isLoading: false })
    }
  },
  // Sign in method
  signIn: async (data: SignInValues) => {
    try {
      const res = await api.post<AuthResponse>("/api/auth/sign-in", data, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      set({ accessToken: res.accessToken })
      await get().getMe()
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response?.data?.message)
        return
      }

      toast.error((error as Error).message)
    }
  },
  // Sign up method
  signUp: async (data: SignUpValues) => {
    try {
      const res = await api.post<AuthResponse>("/api/auth/sign-up", data, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      set({ accessToken: res.accessToken })
      await get().getMe()
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response?.data?.message)
        return
      }

      toast.error((error as Error).message)
    }
  },
  // Sign out method
  signOut: async () => {
    try {
      await api.post("/api/auth/sign-out", undefined, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      window.location.reload()
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response?.data?.message)
        return
      }

      toast.error((error as Error).message)
    }
  },
  // refresh
  refresh: async () => {
    const { user, getMe, setAccessToken } = get()
    try {
      set({ isLoading: true })
      const res = await api.post<AuthResponse>("/api/auth/refresh-token", undefined, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      setAccessToken(res.accessToken)

      if (!user) {
        await getMe()
      }
    } catch {
      await api.post("/api/auth/sign-out")
    } finally {
      set({ isLoading: false })
    }
  },
  // Set access token method
  setAccessToken: (accessToken) => set({ accessToken }),
  // Clear state
  reset: () => set({ isLoading: false, accessToken: null, user: null }),
}))
