import { statusColors } from "@/utils/colors"
import { Spinner } from "@/components/ui/spinner"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { useGetUserById } from "../../api/use-get-user-by-id"
import { useUserInfoModal } from "../../store/use-user-info-modal"

export const UserInfoModal = () => {
  const { open, userId, onClose } = useUserInfoModal()
  const { data: user, isLoading } = useGetUserById({ userId })

  if (isLoading || !user) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Thông tin cá nhân</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-y-1 min-h-32">
            {(isLoading && !user) && (
              <>
                <Spinner className="size-5 text-muted-foreground" />
                <p className="text-[13px] text-muted-foreground">
                  Đang tải dữ liệu...
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Thông tin cá nhân</DialogTitle>
        </DialogHeader>
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-x-2">
            <div className="relative">
              <Avatar className="size-[72px]">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback className="text-3xl">
                  {(user.displayName || user.username).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div
                style={{ backgroundColor: statusColors[user.status] }}
                className="absolute bottom-[-1.5px] right-[6.5px] rounded-full size-3.5 border-2 border-white"
              />
            </div>
            <div className="flex-1">
              {user.displayName && (
                <p className="text-[15px] font-medium">{user.displayName}</p>
              )}
              <p className="text-[15px] font-medium">{user.username}</p>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {user.email}
              </p>
            </div>
          </div>
          <Separator orientation="horizontal" />
          <div className="flex-1">
            <p className="text-[15px] font-medium">Bio</p>
            <p className="text-sm text-muted-foreground">
              {user.bio || "Không có dữ liệu"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
