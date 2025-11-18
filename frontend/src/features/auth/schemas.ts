import { z } from "zod"

import { usernameSchema } from "../users/schemas"

export const identifierSchema = z
  .string({ error: "Vui lòng nhập username hoặc email" })
  .trim()
  .refine((v) => v.length > 0, "Không được để trống")
  .superRefine((v, ctx) => {
    const isEmail = z.string().email().safeParse(v).success
    const isUsername = usernameSchema.safeParse(v).success

    if (!isEmail && !isUsername) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "username hoặc email không hợp lệ"
      })
    }
  })

export const signInSchema = z
  .object({
    identifier: identifierSchema,
    password: z
      .string()
      .min(1, "Vui lòng nhập mật khẩu")
      .min(6, "Mật khẩu tối thiểu 6 ký tự")
      .max(128, "Mật khẩu mới phải ít hơn 128 ký tự")
      .trim()
  })
  .strict()

export const signUpSchema = z
  .object({
    username: usernameSchema,
    email: z.string().email().min(1, "Vui lòng nhập email").trim(),
    password: z
      .string()
      .min(1, "Vui lòng nhập mật khẩu")
      .min(6, "Mật khẩu tối thiểu 6 ký tự")
      .max(128, "Mật khẩu mới phải ít hơn 128 ký tự")
      .trim()
  })
  .strict()

export const forgotPasswordSchema = z.object({
  email: z.string().email().min(1, "Vui lòng nhập email").trim()
})

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    newPassword: z
      .string()
      .min(1, "Vui lòng nhạp mật khẩu mới")
      .min(6, "Mật khẩu mới phải dài hơn 6 ký tự")
      .max(128, "Mật khẩu mới phải ít hơn 128 ký tự"),
    confirmNewPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới")
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Mật khẩu không khớp"
  })
