import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { forgotPasswordSchema } from "@/features/auth/schemas"
import { useForgotPassword } from "@/features/auth/api/use-forgot-password"

import { Input } from "@/components/ui/input"
import { useRouter } from "@/hooks/use-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

export const ForgotPasswordPage = () => {
  const forgotPassword = useForgotPassword()
  const router = useRouter()

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  })

  const onSubmit = (values: z.infer<typeof forgotPasswordSchema>) => {
    forgotPassword.mutate(values)
  }

  return (
    <Card className="overflow-hidden max-w-md mx-auto">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold">Quên mật khẩu</h1>
              <p className="text-muted-foreground text-balance">
                Nhập email của bạn để tiếp tục.
              </p>
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      spellCheck="false"
                      placeholder="email@example.com"
                      disabled={forgotPassword.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={forgotPassword.isPending}>
              Xác nhận
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={forgotPassword.isPending}
              onClick={() => router.push("/sign-in")}
            >
              Quay lại
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
