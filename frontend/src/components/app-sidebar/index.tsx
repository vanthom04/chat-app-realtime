import { useEffect, useMemo } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { PlusIcon, UserRoundIcon, UserRoundPlusIcon, UsersRoundIcon } from "lucide-react"

import { type Conversation } from "@/features/conversations/types"
import { type FriendStatusChangeData } from "@/features/friends/types"
import { useGetConversations } from "@/features/conversations/api/use-get-conversations"
import { useFriendRequestModal } from "@/features/friends/store/use-friend-request-modal"
import { useNewGroupChatModal } from "@/features/conversations/store/use-new-group-chat-modal"

import { Button } from "@/components/ui/button"
import { Sidebar, SidebarContent } from "@/components/ui/sidebar"
import { useSocket } from "@/components/providers/socket-provider"

import { EmptyState } from "./empty-state"
import { SidebarItem } from "./sidebar-item"
import { AppSidebarHeader } from "./app-sidebar-header"
import { AppSidebarFooter } from "./app-sidebar-footer"

export const AppSidebar = () => {
  const queryClient = useQueryClient()
  const newGroupChatModal = useNewGroupChatModal()
  const friendRequestModal = useFriendRequestModal()

  const { socket } = useSocket()

  const { data: conversations } = useGetConversations()

  useEffect(() => {
    if (!socket) return

    // Lắng nghe sự kiện từ server
    const handleStatusChange = (data: FriendStatusChangeData) => {
      queryClient.setQueryData(["conversations"], (oldData: Conversation[]) => {
        const newData = [...oldData]
        const friendIndex = newData.findIndex(
          (c) => c.type === "DIRECT" && c.participants[0].id === data.userId
        )

        if (friendIndex !== -1) {
          queryClient.invalidateQueries({
            queryKey: ["conversation", { id: newData[friendIndex].id }]
          })

          newData[friendIndex] = {
            ...newData[friendIndex],
            participants: [
              {
                ...newData[friendIndex].participants[0],
                status: data.status
              }
            ]
          }
        }

        return newData
      })
    }

    socket.on("friend:status:change", handleStatusChange)

    return () => {
      socket.off("friend:status:change", handleStatusChange)
    }
  }, [socket, queryClient])

  const groups = useMemo(() => conversations?.filter((c) => c.type === "GROUP"), [conversations])
  const friends = useMemo(() => conversations?.filter((c) => c.type === "DIRECT"), [conversations])

  return (
    <Sidebar collapsible="icon" className="border-none py-2">
      <AppSidebarHeader />
      <SidebarContent className="bg-slate-100 dark:bg-slate-950 px-2 py-4 space-y-4 overflow-y-auto">
        {/* Groups */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium dark:text-[#f9edffcc] uppercase truncate">
              Nhóm chat
            </h3>
            <Button
              size="icon-sm"
              onClick={newGroupChatModal.onOpen}
              className="size-7 text-primary dark:text-[#f9edffcc] shrink-0 bg-transparent hover:bg-accent/70"
            >
              <PlusIcon />
            </Button>
          </div>
          {groups?.map((item) => (
            <SidebarItem key={item.id} conversation={item} />
          ))}
          {groups?.length === 0 && (
            <EmptyState icon={UsersRoundIcon} title="Bạn chưa có nhóm nào" />
          )}
        </div>
        {/* Friends */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium dark:text-[#f9edffcc] uppercase truncate">
              Bạn bè
            </h3>
            <Button
              size="icon-sm"
              onClick={friendRequestModal.onOpen}
              className="size-7 text-primary dark:text-[#f9edffcc] shrink-0 bg-transparent hover:bg-accent/70"
            >
              <UserRoundPlusIcon />
            </Button>
          </div>
          {friends?.map((item) => (
            <SidebarItem key={item.id} conversation={item} />
          ))}
          {friends?.length === 0 && (
            <EmptyState icon={UserRoundIcon} title="Không tìm thấy bạn bè" />
          )}
        </div>
      </SidebarContent>
      <AppSidebarFooter />
    </Sidebar>
  )
}
