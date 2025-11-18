import { z } from "zod"

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(3, "Tên nhóm phải có ít nhất 3 ký tự")
    .max(256, "Tên nhóm không được vượt quá 256 ký tự")
    .trim(),
  memberIds: z.array(z.string().min(24).max(24).trim()).min(2, "Phải có ít nhất 2 thành viên")
})
