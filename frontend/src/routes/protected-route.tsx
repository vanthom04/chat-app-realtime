import { useEffect } from "react"
import { Navigate } from "react-router"

import { Spinner } from "@/components/ui/spinner"
import { useAuthStore } from "@/hooks/use-auth-store"

interface Props {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: Props) => {
  const { user, accessToken, isLoading, getMe, refresh } = useAuthStore()

  useEffect(() => {
    ;(async () => {
      if (!accessToken) {
        await refresh()
      }

      if (accessToken && !user) {
        await getMe()
      }
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="text-muted-foreground dark:text-white lg:size-5" />
      </div>
    )
  }

  return user ? <>{children}</> : <Navigate to="/sign-in" replace />
}
