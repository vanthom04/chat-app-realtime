import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useCancelFriendRequest } from "../../api/use-cancel-friend-request"

interface Props {
  userId: string
  name: string
  avatarUrl?: string | null
}

export const SentFriendRequestItem = ({ userId, name, avatarUrl }: Props) => {
  const cancelFriendRequest = useCancelFriendRequest()

  return (
    <div className="flex-1 flex items-center gap-2 bg-accent/75 shadow-xs rounded-md p-2.5">
      <Avatar className="size-10">
        <AvatarImage src={avatarUrl!} />
        <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-medium line-clamp-1">{name}</p>
        <p className="text-[13px] text-muted-foreground line-clamp-1">
          Đang chờ phản hồi...
        </p>
      </div>
      <Button
        size="sm"
        variant="outline"
        disabled={cancelFriendRequest.isPending}
        onClick={() => cancelFriendRequest.mutate(userId)}
        className="ml-auto rounded-full px-4 hover:bg-background hover:text-destructive"
      >
        Hủy yêu cầu
      </Button>
    </div>
  )
}
