import { SendIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { useEffect, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"

import { createMessageSchema } from "@/features/messages/schemas"
import { type CreateMessageValues } from "@/features/messages/types"
import { useCreateMessage } from "@/features/messages/api/use-create-message"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form"

import { ImageUpload } from "./image-upload"

interface Props {
  conversationId: string
}

export const ChatInput = ({ conversationId }: Props) => {
  const createMessage = useCreateMessage()

  const timeoutRef = useRef<number>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const form = useForm<CreateMessageValues>({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      conversationId,
      content: "",
      type: "TEXT",
      attachmentUrl: undefined
    }
  })

  useEffect(() => {
    form.reset({
      conversationId,
      type: "TEXT",
      content: ""
    })
  }, [conversationId, form])

  const onSubmit = (values: CreateMessageValues) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (!values.content) return

    createMessage.mutate(values, {
      onSuccess: () => {
        form.reset()

        // Focus input
        timeoutRef.current = setTimeout(() => {
          inputRef.current?.focus()
        }, 0)
      }
    })
  }

  return (
    <div className="px-3 py-2 bg-white dark:bg-slate-800 border-t items-center justify-center flex gap-2">
      <ImageUpload
        onUploaded={(data) => {
          createMessage.mutate({
            conversationId,
            type: "IMAGE",
            content: undefined,
            attachmentUrl: data.url
          })
        }}
      />
      <Form {...form}>
        <form className="flex-1 flex items-center gap-2" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    {...field}
                    ref={inputRef}
                    spellCheck="false"
                    autoComplete="off"
                    className="rounded-lg"
                    value={field.value ?? ""}
                    placeholder="Nhập tin nhắn..."
                    disabled={createMessage.isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="icon-sm"
            disabled={createMessage.isPending || !form.watch("content")}
          >
            <SendIcon />
          </Button>
        </form>
      </Form>
    </div>
  )
}
