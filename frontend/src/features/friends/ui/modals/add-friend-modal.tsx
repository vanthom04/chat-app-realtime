import { z } from "zod"
import { useForm } from "react-hook-form"
import { UserRoundPlusIcon } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"

import { useSearchUser } from "@/features/users/api/use-search-user"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Form, FormField, FormControl, FormItem, FormLabel } from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { getFriendSchema } from "../../schemas"
import { useSendFriendRequest } from "../../api/use-send-friend-request"
import { useFriendRequestModal } from "../../store/use-friend-request-modal"

export const AddFriendModal = () => {
  const { open, onClose } = useFriendRequestModal()

  const searchUser = useSearchUser()
  const sendFriendRequest = useSendFriendRequest()

  const form = useForm<z.infer<typeof getFriendSchema>>({
    resolver: zodResolver(getFriendSchema),
    defaultValues: {
      identifier: ""
    }
  })

  const onSubmit = (values: z.infer<typeof getFriendSchema>) => {
    searchUser.mutate(values)
  }

  const handleClose = () => {
    onClose()
    searchUser.reset()
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent aria-describedby={undefined} className="outline-none">
        <DialogHeader>
          <DialogTitle>Thêm bạn</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username hoặc Email</FormLabel>
                    <FormControl>
                      <div className="flex-1 flex items-center gap-x-2">
                        <Input
                          {...field}
                          spellCheck="false"
                          autoComplete="off"
                          disabled={searchUser.isPending}
                          placeholder="Nhập username hoặc email để tìm bạn bè"
                          className={cn(
                            form.formState.errors.identifier && "focus-visible:!border-destructive placeholder:!text-destructive"
                          )}
                        />
                        <Button type="submit" disabled={searchUser.isPending}>
                          Tìm kiếm
                        </Button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
          {searchUser.isPending && (
            <div className="flex-1 flex items-center justify-center p-4">
              <Spinner className="text-muted-foreground" />
            </div>
          )}
          {searchUser.data && (
            <div className="flex-1 flex items-center gap-x-2 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg shadow-xs">
              <Avatar className="size-16">
                <AvatarImage src={searchUser.data.avatarUrl} />
                <AvatarFallback className="text-2xl">
                  {searchUser.data.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-0.5">
                <p className="text-sm line-clamp-1">
                  {searchUser.data.username}{" "}
                  {searchUser.data.displayName && (
                    <>({searchUser.data.displayName})</>
                  )}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {searchUser.data.email}
                </p>
                <p className="text-[13px] text-muted-foreground line-clamp-1">
                  {searchUser.data.bio}
                </p>
              </div>
              <Button
                size="icon-lg"
                variant="ghost"
                onClick={() => sendFriendRequest.mutate({ userId: searchUser.data.id })}
              >
                <UserRoundPlusIcon />
              </Button>
            </div>
          )}
          {searchUser.data === null && (
            <div className="flex-1 flex items-center justify-center p-4">
              <p className="text-sm text-muted-foreground">Không tìm thấy tài khoản</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
