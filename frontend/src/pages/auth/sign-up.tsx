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

import { signUpSchema } from "@/features/auth/schemas"

export const SignUpPage = () => {
  const { signUp } = useAuthStore()

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })

  const onSubmit = (values: z.infer<typeof signUpSchema>) => {
    startTransition(async () => await signUp(values))
  }

  return (
    <div className="space-y-2">
      <Card className="p-0 overflow-hidden">
        <CardContent className="p-0 grid md:grid-cols-2">
          <Form {...form}>
            <form className="p-6 md:p-8 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col items-center text-center">
                <img className="size-[50px] object-cover" src="/images/logo.png" alt="Logo" />
                <h1 className="text-2xl font-bold mt-1">Tạo tài khoản</h1>
                <p className="text-muted-foreground text-balance">
                  Vui lòng nhập đủ thông tin để tiếp tục
                </p>
              </div>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        spellCheck="false"
                        disabled={isPending}
                        placeholder="johndoe@example.com"
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
                    <FormLabel>Mật khẩu</FormLabel>
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
                {isPending ? <Spinner /> : "Đăng ký"}
              </Button>
              <div className="text-center text-sm">
                Bạn đã có tài khoản?{" "}
                <Link to="/sign-in" className="underline underline-offset-4">
                  Đăng nhập
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
