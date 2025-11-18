import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios"

import { useAuthStore } from "@/hooks/use-auth-store"
import type { AuthResponse } from "@/features/auth/types"

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30_000, // 30s
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "x-api-key": import.meta.env.VITE_API_KEY
  }
})

let isRefreshing = false
let queue: Array<(ok: boolean) => void> = []

const flushQueue = (ok: boolean) => {
  queue.forEach((cb) => cb(ok))
  queue = []
}

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState()

    // Set accessToken to cookie
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Nếu status không phải 401 hoặc đã retry thì trả về luôn
    const status = error.response?.status
    if (status !== 401 || originalRequest?._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (!isRefreshing) {
      isRefreshing = true

      try {
        const res = await axiosInstance.post<AuthResponse>("/api/auth/refresh-token", undefined, {
          headers: {
            "Content-Type": "application/json"
          }
        })

        useAuthStore.getState().setAccessToken(res.data.accessToken)
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`
        isRefreshing = false
        flushQueue(true)
        return axiosInstance.request(originalRequest)
      } catch {
        flushQueue(false)
        isRefreshing = false
        await useAuthStore.getState().signOut()
        return Promise.reject(error)
      }
    }

    // Nếu đang refresh: đợi kết quả rồi retry
    return new Promise((resolve, reject) => {
      queue.push((ok) => {
        if (!ok) reject(error)
        resolve(axiosInstance.request(originalRequest))
      })
    })
  }
)

export const api = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.get<T>(url, config).then((response) => response.data)
  },
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.post<T>(url, data, config).then((response) => response.data)
  },
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.put<T>(url, data, config).then((response) => response.data)
  },
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.patch<T>(url, data, config).then((response) => response.data)
  },
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.delete<T>(url, config).then((response) => response.data)
  }
}
