import { useMemo } from "react"
import { format } from "date-fns"
import { NavLink } from "react-router"

import { type Conversation } from "@/features/conversations/types"
import { useOtherUser } from "@/features/users/hooks/use-other-user"

import { cn } from "@/lib/utils"
import { useAuthStore } from "@/hooks/use-auth-store"
import { AvatarGroup } from "@/components/avatar-group"
import { AvatarStatus } from "@/components/avatar-status"

interface Props {
  conversation: Conversation
}

export const SidebarItem = ({ conversation }: Props) => {
  const otherUser = useOtherUser(conversation)
  const { user } = useAuthStore()

  const lastMessage = useMemo(() => {
    return conversation.messages[conversation.messages.length - 1]
  }, [conversation.messages])

  const lastMessageText = useMemo(() => {
    if (!lastMessage) {
      return "Bắt đầu cuộc trò chuyện"
    }

    const isOwn = user?.id === lastMessage.sender.id
    const name = lastMessage.sender.displayName || lastMessage.sender.username

    if (lastMessage.type === "IMAGE") {
      return `${isOwn ? "Bạn" : name}: [Hình ảnh]`
    }

    if (lastMessage.content) {
      return `${name}: ${lastMessage.content}`
    }
  }, [user, lastMessage])

  if (conversation.type === "DIRECT") {
    return (
      <NavLink
        to={`/conversations/${conversation.id}`}
        className={({ isActive }) => cn(
          "w-full bg-accent p-2 rounded-lg flex items-center border-2 border-primary/10",
          isActive && "border-primary"
        )}
      >
        <AvatarStatus
          status={otherUser.status}
          avatarUrl={otherUser.avatarUrl}
          name={otherUser.displayName || otherUser.username}
        />
        <div className="ml-2">
          <p className="text-[15px] font-medium line-clamp-1">
            {otherUser.displayName || otherUser.username}
          </p>
          <p className="text-[13px] text-muted-foreground line-clamp-1">{lastMessageText}</p>
        </div>
        <div className="ml-auto">
          {lastMessage?.createdAt && (
            <span className="text-xs text-muted-foreground">
              {format(lastMessage.createdAt, "HH:mm")}
            </span>
          )}
        </div>
      </NavLink>
    )
  }

  return (
    <NavLink
      to={`/conversations/${conversation.id}`}
      className={({ isActive }) => cn(
        "w-full bg-accent p-2 rounded-lg flex items-center border-2 border-primary/10",
        isActive && "border-primary"
      )}
    >
      <AvatarGroup
        name={conversation.name!}
        imageUrl={conversation.imageUrl}
      />
      <div className="ml-2">
        <p className="text-[15px] font-medium line-clamp-1">{conversation.name}</p>
        <p className="text-[13px] text-muted-foreground line-clamp-1">{lastMessageText}</p>
      </div>
      <div className="ml-auto">
        {lastMessage?.createdAt && (
          <span className="text-xs text-muted-foreground">
            {format(lastMessage.createdAt, "HH:mm")}
          </span>
        )}
      </div>
    </NavLink>
  )
}
