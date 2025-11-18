import { Routes, Route } from "react-router"

import { HomePage } from "@/pages/home"
import { SignInPage } from "@/pages/auth/sign-in"
import { SignUpPage } from "@/pages/auth/sign-up"
import { PublicRoute } from "@/routes/public-route"
import { ProtectedRoute } from "@/routes/protected-route"
import { ConversationsPage } from "@/pages/conversations"
import { AuthLayout } from "@/components/layouts/auth-layout"
import { MainLayout } from "@/components/layouts/main-layout"
import { ResetPasswordPage } from "@/pages/auth/reset-password"
import { ForgotPasswordPage } from "@/pages/auth/forgot-password"

export const App = () => {
  return (
    <Routes>
      {/* Auth */}
      <Route
        element={
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
        }
      >
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Main */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/conversations/:id" element={<ConversationsPage />} />
      </Route>
    </Routes>
  )
}
