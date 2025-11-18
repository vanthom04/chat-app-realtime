import { useMemo } from "react"
import { format } from "date-fns"
import { Trash2Icon } from "lucide-react"

import { type Conversation } from "@/features/conversations/types"
import { useOtherUser } from "@/features/users/hooks/use-other-user"
import { useDeleteConversation } from "@/features/conversations/api/use-delete-conversation"

import { Button } from "@/components/ui/button"
import { useConfirm } from "@/hooks/use-confirm"
import { Separator } from "@/components/ui/separator"
import { AvatarGroup } from "@/components/avatar-group"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Props {
  conversation: Conversation
  isOpen: boolean
  onClose: () => void
}

export const ProfileSheet = ({ conversation, isOpen, onClose }: Props) => {
  const otherUser = useOtherUser(conversation)

  const deleteConversation = useDeleteConversation()

  const [DialogConfirm, confirm] = useConfirm({
    title: "Bạn có chắc không?",
    message: "Hành động này sẽ xóa cuộc hội thoại. Bạn có chắc!"
  })

  const joinedDate = useMemo(() => {
    return format(new Date(otherUser.createdAt), "p")
  }, [otherUser.createdAt])

  const title = useMemo(() => {
    return conversation.name || otherUser.displayName || otherUser.username
  }, [conversation.name, otherUser.displayName, otherUser.username])

  const statusText = useMemo(() => {
    if (conversation.type === "GROUP") {
      return `${conversation.participants.length} thành viên`
    }

    return "Active"
  }, [conversation])

  const onDeleteConversation = async () => {
    const ok = await confirm()

    if (ok) {
      deleteConversation.mutate(conversation.id)
    }
  }

  return (
    <>
      <DialogConfirm />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent aria-describedby={undefined}>
          <SheetTitle className="sr-only">Profile</SheetTitle>
          <div className="p-4 flex flex-col gap-1.5 overflow-y-auto h-full">
            <div className="flex flex-col items-center mt-6">
              <div className="mb-2">
                {conversation.type === "GROUP" ? (
                  <AvatarGroup name={title} imageUrl={conversation.imageUrl} className="size-20" />
                ) : (
                  <Avatar className="size-20">
                    <AvatarImage src={otherUser.avatarUrl} />
                    <AvatarFallback className="text-3xl font-medium">
                      {(otherUser.displayName || otherUser.username).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
              <div className="font-medium">{title}</div>
              <div className="text-sm text-gray-500">{statusText}</div>
              <div className="w-full pb-5 pt-5">
                <div className="space-y-8 px-4 sm:space-y-4">
                  {!(conversation.type === "GROUP") && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                        Email
                      </dt>
                      <dd className="mt-1 text-sm tex-gray-900 sm:col-span-2">{otherUser.email}</dd>
                    </div>
                  )}
                  {!(conversation.type === "GROUP") && (
                    <>
                      <Separator />
                      <div>
                        <dt className="text-sm text-gray-500 font-medium sm:w-40 sm:flex-shrink-0">
                          Đã tham gia
                        </dt>
                        <dd className="mt-1 text-sm tex-gray-900 sm:col-span-2">
                          <time dateTime={joinedDate}>{joinedDate}</time>
                        </dd>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-auto">
              <Button
                size="lg"
                variant="outline"
                onClick={onDeleteConversation}
                disabled={deleteConversation.isPending}
                className="w-full hover:text-rose-500"
              >
                <Trash2Icon />
                Delete
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
