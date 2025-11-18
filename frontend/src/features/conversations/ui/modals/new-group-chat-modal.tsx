import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription
} from "@/components/ui/dialog"

import { createGroupSchema } from "../../schemas"
import { type CreateGroupValues } from "../../types"
import { useCreateGroup } from "../../api/use-create-group"
import { useNewGroupChatModal } from "../../store/use-new-group-chat-modal"
import { MultiSelectUser } from "../components/multi-select-user"

export const NewGroupChatModal = () => {
  const { open, onClose } = useNewGroupChatModal()

  const createGroup = useCreateGroup()

  const form = useForm<CreateGroupValues>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
      memberIds: []
    }
  })

  const onSubmit = (values: CreateGroupValues) => {
    createGroup.mutate(values, {
      onSuccess: () => {
        handleClose()
      }
    })
  }

  const handleClose = () => {
    onClose()
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader className="gap-1">
          <DialogTitle>Tạo một nhóm mới</DialogTitle>
          <DialogDescription>Tạo một cuộc trò chuyện với nhiều hơn 2 người</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên nhóm</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      spellCheck="false"
                      className="h-[40px]"
                      disabled={createGroup.isPending}
                      placeholder="Nhập tên nhóm của bạn..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="memberIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thành viên nhóm</FormLabel>
                  <FormControl>
                    <MultiSelectUser
                      disabled={createGroup.isPending}
                      onChange={(otps) => field.onChange(otps.map((o) => o.value))}
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
                disabled={createGroup.isPending}
                onClick={handleClose}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={createGroup.isPending}>
                Xác nhận
                {createGroup.isPending && <Spinner />}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
