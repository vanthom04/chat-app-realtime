import { format } from "date-fns"

import type { User } from "@/features/users/types"
import type { MessageType } from "@/features/messages/types"

import { cn } from "@/lib/utils"
import { useAuthStore } from "@/hooks/use-auth-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Props {
  id: string
  type: MessageType
  content: string
  attachmentUrl?: string | null
  createdAt: Date
  updatedAt: Date
  sender: User
}

export const MessageItem = ({
  type,
  content,
  attachmentUrl,
  createdAt,
  sender
}: Props) => {
  const { user } = useAuthStore()

  const isOwn = user?.id === sender.id

  return (
    <div className={cn("flex gap-2 py-2", isOwn && "justify-end")}>
      <Avatar className={cn("size-8", isOwn && "order-2")}>
        <AvatarImage src={sender.avatarUrl} />
        <AvatarFallback className="text-xs font-medium">
          {(sender.displayName || sender.username).charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className={cn("flex flex-col gap-y-1", isOwn && "items-end")}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500 dark:text-gray-200">
            {sender.displayName || sender.username}
          </div>
          <div className="text-xs text-gray-400">
            {format(new Date(createdAt), "HH:mm")}
          </div>
        </div>
        {type === "TEXT" && (
          <div
            className={cn(
              "w-fit text-[15px] rounded-xl py-2 px-3 max-w-64 md:max-w-[320px] lg:max-w-[520px]",
              isOwn ? "bg-primary/90 text-white" : "bg-gray-200/80 dark:bg-gray-600"
            )}
          >
            <p>{content}</p>
          </div>
        )}
        {type === "IMAGE" && (
          <div className="w-fit max-w-md rounded-md overflow-hidden border">
            <img
              src={attachmentUrl!}
              alt="Image cover"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </div>
  )
}
