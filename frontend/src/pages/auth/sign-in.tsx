import { z } from "zod"
import { Link } from "react-router"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useAuthStore } from "@/hooks/use-auth-store"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { signInSchema } from "@/features/auth/schemas"

export const SignInPage = () => {
  const { signIn } = useAuthStore()

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  })

  const onSubmit = (values: z.infer<typeof signInSchema>) => {
    startTransition(async () => await signIn(values))
  }

  return (
    <div className="space-y-2">
      <Card className="p-0 overflow-hidden">
        <CardContent className="p-0 grid md:grid-cols-2">
          <Form {...form}>
            <form className="p-6 md:p-8 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col items-center text-center">
                <img className="size-[50px] object-cover" src="/images/logo.png" alt="Logo" />
                <h1 className="text-2xl font-bold mt-1">Chào mừng quay lại</h1>
                <p className="text-muted-foreground text-balance">
                  Đăng nhập vào tài khoản Chatio của bạn
                </p>
              </div>
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username hoặc Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        spellCheck="false"
                        disabled={isPending}
                        placeholder="john_doe"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Mật khẩu</FormLabel>
                      <Link to="/forgot-password" className="text-sm font-medium" tabIndex={-1}>
                        Quên mật khẩu?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        spellCheck="false"
                        disabled={isPending}
                        placeholder="**********"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Spinner /> : "Đăng nhập"}
              </Button>
              <div className="text-center text-sm">
                Bạn chưa có tài khoản?{" "}
                <Link to="/sign-up" className="underline underline-offset-4">
                  Đăng ký
                </Link>
              </div>
            </form>
          </Form>
          <div className="bg-accent items-center justify-center hidden md:flex">
            <img src="/images/auth.png" alt="Auth" className="w-[380px]" />
          </div>
        </CardContent>
      </Card>
      <div className="text-slate-600 *:[a]:hover:text-slate-900 text-center font-medium text-xs px-8 md:px-0 md:text-balance *:[a]:underline *:[a]:underline-offset-4">
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a> và{" "}
        <a href="#">Chính sách bảo mật</a> của chúng tôi.
      </div>
    </div>
  )
}
