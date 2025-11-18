import { useState } from "react"
import { MoreHorizontalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AvatarGroup } from "@/components/avatar-group"
import { AvatarStatus } from "@/components/avatar-status"
import { type Conversation } from "@/features/conversations/types"
import { useOtherUser } from "@/features/users/hooks/use-other-user"
import { useUserInfoModal } from "@/features/users/store/use-user-info-modal"

import { ProfileSheet } from "./profile-sheet"

interface Props {
  conversation: Conversation
}

export const Header = ({ conversation }: Props) => {
  const otherUser = useOtherUser(conversation)
  const userInfoModal = useUserInfoModal()

  const [isOpenProfile, setIsOpenProfile] = useState(false)

  if (conversation.type === "DIRECT") {
    return (
      <>
        <ProfileSheet
          isOpen={isOpenProfile}
          conversation={conversation}
          onClose={() => setIsOpenProfile(false)}
        />
        <div className="bg-white dark:bg-slate-800 flex items-center px-3 py-2 border-b">
          <div
            onClick={() => userInfoModal.onOpen(otherUser.id)}
            className="flex items-center gap-x-2 cursor-pointer"
          >
            <AvatarStatus
              status={otherUser.status}
              avatarUrl={otherUser.avatarUrl}
              name={otherUser.displayName || otherUser.username}
            />
            <div className="flex-1 flex flex-col">
              <h5 className="font-medium line-clamp-1">
                {otherUser.displayName || otherUser.username}
              </h5>
              <p className="text-xs text-muted-foreground capitalize line-clamp-1">
                {otherUser.status.toLowerCase()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-x-2 ml-auto">
            <Button size="icon" variant="ghost" onClick={() => setIsOpenProfile(true)}>
              <MoreHorizontalIcon />
            </Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <ProfileSheet
        isOpen={isOpenProfile}
        conversation={conversation}
        onClose={() => setIsOpenProfile(false)}
      />
      <div className="bg-white dark:bg-slate-800 flex items-center px-3 py-2 border-b">
        <div className="flex items-center gap-x-2">
          <AvatarGroup
            name={conversation.name!}
            imageUrl={conversation.imageUrl}
          />
          <div className="flex-1 flex flex-col">
            <h5 className="font-medium line-clamp-1">{conversation.name}</h5>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {conversation.participants.length} Thành viên
            </p>
          </div>
        </div>
        <div className="flex items-center gap-x-2 ml-auto">
          <Button size="icon" variant="ghost" onClick={() => setIsOpenProfile(true)}>
            <MoreHorizontalIcon />
          </Button>
        </div>
      </div>
    </>
  )
}
