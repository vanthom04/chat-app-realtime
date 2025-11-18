import { z } from "zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useSearchParams } from "react-router"
import { zodResolver } from "@hookform/resolvers/zod"

import { resetPasswordSchema } from "@/features/auth/schemas"
import { useResetPassword } from "@/features/auth/api/use-reset-password"

import { Input } from "@/components/ui/input"
import { useRouter } from "@/hooks/use-router"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams()

  const router = useRouter()
  const resetPassword = useResetPassword()

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: "",
      newPassword: "",
      confirmNewPassword: ""
    }
  })

  useEffect(() => {
    const token = searchParams.get("token")

    if (token) {
      form.reset({
        token,
        newPassword: "",
        confirmNewPassword: ""
      })
    }
  }, [searchParams, form])

  const onSubmit = (values: z.infer<typeof resetPasswordSchema>) => {
    resetPassword.mutate(values)
  }

  return (
    <Card className="overflow-hidden max-w-md mx-auto">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold">Khôi phục mật khẩu</h1>
              <p className="text-muted-foreground text-balance">
                Nhập email của bạn để tiếp tục.
              </p>
            </div>
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      spellCheck="false"
                      autoComplete="off"
                      placeholder="************"
                      disabled={resetPassword.isPending}
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
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      spellCheck="false"
                      autoComplete="off"
                      placeholder="************"
                      disabled={resetPassword.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={resetPassword.isPending}>
              Xác nhận
              {resetPassword.isPending && <Spinner />}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={resetPassword.isPending}
              onClick={() => router.push("/sign-in")}
            >
              Quay lại trang đăng nhập
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
