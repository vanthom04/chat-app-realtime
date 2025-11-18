import { z } from "zod"

import { forgotPasswordSchema, resetPasswordSchema, signInSchema, signUpSchema } from "./schemas"

export type SignInValues = z.infer<typeof signInSchema>

export type SignUpValues = z.infer<typeof signUpSchema>

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>

export type AuthResponse = {
  accessToken: string
}
