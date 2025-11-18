import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { SentFriendRequests } from "../components/sent-friend-requests"
import { AcceptedFriendRequests } from "../components/accepted-friend-requests"
import { useFriendInvitationModal } from "../../store/use-friend-invitation-modal"

export const FriendInvitationModal = () => {
  const { open, onClose } = useFriendInvitationModal()

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Lời mời kết bạn</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="accepted-friend-request">
          <TabsList className="w-full h-10">
            <TabsTrigger value="accepted-friend-request">Đã nhận</TabsTrigger>
            <TabsTrigger value="sent-friend-request">Đã gửi</TabsTrigger>
          </TabsList>
          <TabsContent value="accepted-friend-request">
            <AcceptedFriendRequests />
          </TabsContent>
          <TabsContent value="sent-friend-request">
            <SentFriendRequests />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
