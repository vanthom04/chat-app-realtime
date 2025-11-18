import { z } from "zod"

export const usernameSchema = z
  .string()
  .min(3, "username tối thiểu 3 ký tự")
  .max(30, "username tối đa 30 ký tự")
  .regex(/^[a-zA-Z0-9._]+$/, "username chỉ được chứa chữ, số, dấu chấm và gạch dưới")
  .regex(
    /^(?![._])(?!.*[._]{2})[a-zA-Z0-9._]+(?<![._])$/,
    "username không được bắt đầu/kết thúc bằng . hoặc _ , và không có ký tự đặc biệt lặp"
  )

export const userUpdateSchema = z.object({
  displayName: z
    .string()
    .min(1, "Tên hiện thị không được rỗng")
    .max(50, "Tên hiện thị tối đa 50 ký tự")
    .trim()
    .optional(),
  username: usernameSchema.optional(),
  email: z.string().email("Email không hợp lệ").trim().optional(),
  bio: z.string().max(512, "Bio tối đa 512 ký tự").optional()
})

export const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Vui lòng nhập mật khẩu hiện tại")
      .min(8, "Mật khẩu hiện tại phải dài hơn 8 ký tự")
      .max(128, "Mật khẩu hiện tại phải ít hơn 128 ký tự"),
    newPassword: z
      .string()
      .min(1, "Vui lòng nhạp mật khẩu mới")
      .min(8, "Mật khẩu mới phải dài hơn 8 ký tự")
      .max(128, "Mật khẩu mới phải ít hơn 128 ký tự"),
    confirmNewPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới")
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Mật khẩu không khớp"
  })
