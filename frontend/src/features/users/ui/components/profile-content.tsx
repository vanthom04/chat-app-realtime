import { z } from "zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { TriangleAlertIcon } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { useAuthStore } from "@/hooks/use-auth-store"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { userUpdateSchema } from "../../schemas"
import { useUpdateUser } from "../../api/use-update-user"
import { ChangeAvatar } from "./change-avatar"

export const ProfileContent = () => {
  const { user, isLoading } = useAuthStore()

  const updateUser = useUpdateUser()

  const form = useForm<z.infer<typeof userUpdateSchema>>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      username: user?.username ?? "",
      displayName: user?.displayName ?? "",
      email: user?.email ?? "",
      bio: user?.bio ?? ""
    }
  })

  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email,
        username: user.username,
        displayName: user.displayName ?? "",
        bio: user.bio ?? ""
      })
    }
  }, [user, form])

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center flex-1 justify-center gap-2">
        <Spinner />
        <p className="text-muted-foreground text-sm">
          Đang tải dữ liệu...
        </p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="h-full flex flex-col items-center flex-1 justify-center gap-2">
        <TriangleAlertIcon className="text-sm text-destructive" />
        <p className="text-sm text-muted-foreground">
          Có lỗi xảy ra. Vui lòng thử lại sau!
        </p>
      </div>
    )
  }

  const onSubmit = (values: z.infer<typeof userUpdateSchema>) => {
    updateUser.mutate({ ...values, id: user.id })
  }

  return (
    <div className="flex-1 h-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
          <div className="flex gap-x-4 h-[calc(100%-50px)]">
            {/* Avatar */}
            <ChangeAvatar
              userId={user.id}
              avatarUrl={user.avatarUrl}
              name={user.displayName || user.username}
            />
            {/* Info */}
            <div className="space-y-3 h-full flex-1 pr-1 overflow-y-auto">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên hiển thị</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        spellCheck="false"
                        autoComplete="off"
                        disabled={updateUser.isPending}
                        placeholder="Nhập tên hiện thị..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={updateUser.isPending}
                        spellCheck="false"
                        autoComplete="off"
                        placeholder="Nhập username..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={updateUser.isPending}
                        spellCheck="false"
                        autoComplete="off"
                        placeholder="Nhập email..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        spellCheck="false"
                        autoComplete="off"
                        className="resize-none"
                        placeholder="Nhập bio..."
                        disabled={updateUser.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex items-center justify-end mt-auto">
            <Button size="sm" type="submit" disabled={updateUser.isPending}>
              Lưu thay đổi
              {updateUser.isPending && <Spinner />}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
