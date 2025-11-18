import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useAcceptFriendRequest } from "../../api/use-accept-friend-request"
import { useRejectFriendRequest } from "../../api/use-reject-friend-request"

interface Props {
  userId: string
  name: string
  avatarUrl?: string | null
}

export const AcceptedFriendRequestItem = ({ userId, name, avatarUrl }: Props) => {
  const acceptFriendRequest = useAcceptFriendRequest()
  const rejectFriendRequest = useRejectFriendRequest()

  return (
    <div className="flex-1 flex items-center gap-2 bg-accent/75 shadow-xs rounded-md p-2.5">
      <Avatar className="size-10">
        <AvatarImage src={avatarUrl!} />
        <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-medium line-clamp-1">{name}</p>
        <p className="text-[13px] text-muted-foreground line-clamp-1">
          Muốn kết bạn!
        </p>
      </div>
      <div className="flex items-center gap-x-2 ml-auto">
        <Button
          size="sm"
          className="rounded-full px-4"
          onClick={() => acceptFriendRequest.mutate(userId)}
          disabled={acceptFriendRequest.isPending || rejectFriendRequest.isPending}
        >
          Chấp nhận
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => rejectFriendRequest.mutate(userId)}
          disabled={acceptFriendRequest.isPending || rejectFriendRequest.isPending}
          className="rounded-full px-4 hover:bg-background hover:text-destructive"
        >
          Từ chối
        </Button>
      </div>
    </div>
  )
}
