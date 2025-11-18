import { z } from "zod"
import { useState } from "react"
import { vi } from "date-fns/locale"
import { useForm } from "react-hook-form"
import { PencilIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { zodResolver } from "@hookform/resolvers/zod"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useAuthStore } from "@/hooks/use-auth-store"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { updatePasswordSchema } from "../../schemas"
import { useUpdatePassword } from "../../api/use-update-password"

export const ChangePassword = () => {
  const { user } = useAuthStore()

  const [isEditing, setIsEditing] = useState(false)

  const updatePassword = useUpdatePassword()

  const form = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: ""
    }
  })

  const onSubmit = (values: z.infer<typeof updatePasswordSchema>) => {
    updatePassword.mutate({ ...values, id: user?.id as string }, {
      onSuccess: () => {
        setIsEditing(false)
        form.reset()
      }
    })
  }

  const toggleEdit = () => setIsEditing((prev) => !prev)

  if (!user) return null

  return (
    <div className="space-y-2">
      <h3 className="text-[15px] font-medium">Đổi mật khẩu</h3>
      <div className="border bg-accent/30 rounded-md p-4">
        {!isEditing && (
          <div className="flex items-center justify-between">
            <p className="text-sm">
              {user.createdAt === user.passwordUpdatedAt ? (
                <>Chưa thay đổi mật khẩu.</>
              ) : (
                formatDistanceToNow(user.passwordUpdatedAt, {
                  addSuffix: true,
                  locale: vi
                })
              )}
            </p>
            <Button size="icon-sm" variant="ghost" onClick={toggleEdit}>
              <PencilIcon />
            </Button>
          </div>
        )}
        {isEditing && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu hiện tại</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        spellCheck="false"
                        autoComplete="off"
                        className="bg-background"
                        disabled={updatePassword.isPending}
                        placeholder="Nhập mật khẩu hiện tại..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        spellCheck="false"
                        autoComplete="off"
                        className="bg-background"
                        disabled={updatePassword.isPending}
                        placeholder="Nhập mật khẩu mới..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        spellCheck="false"
                        autoComplete="off"
                        className="bg-background"
                        disabled={updatePassword.isPending}
                        placeholder="Nhập lại mật khẩu mới..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-end gap-x-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={updatePassword.isPending}
                  onClick={toggleEdit}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={updatePassword.isPending}>
                  Xác nhận
                  {updatePassword.isPending && <Spinner />}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  )
}
