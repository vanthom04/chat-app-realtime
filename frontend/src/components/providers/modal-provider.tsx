import { useState, useEffect } from "react"

import { AccountModal } from "@/features/users/ui/modals/account-modal"
import { UserInfoModal } from "@/features/users/ui/modals/user-info-modal"
import { AddFriendModal } from "@/features/friends/ui/modals/add-friend-modal"
import { NewGroupChatModal } from "@/features/conversations/ui/modals/new-group-chat-modal"
import { FriendInvitationModal } from "@/features/friends/ui/modals/friend-invitation-modal"

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <AccountModal />
      <UserInfoModal />
      <FriendInvitationModal />
      <AddFriendModal />
      <NewGroupChatModal />
    </>
  )
}
