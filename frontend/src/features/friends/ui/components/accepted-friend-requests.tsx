import { InboxIcon } from "lucide-react"

import { Spinner } from "@/components/ui/spinner"

import { AcceptedFriendRequestItem } from "./accepted-friend-request-item"
import { useGetAcceptedFriendRequests } from "../../api/use-get-accepted-friend-requests"

export const AcceptedFriendRequests = () => {
  const { data, isLoading } = useGetAcceptedFriendRequests()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 min-h-[250px]">
        <Spinner />
        <p className="text-sm text-muted-foreground">
          Đang tải dữ liệu...
        </p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 min-h-[250px]">
        <InboxIcon className="size-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Không có yêu cầu kết bạn.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2 min-h-[250px] max-h-[300px] overflow-y-auto">
      {data.map((friend) => (
        <AcceptedFriendRequestItem
          key={friend.id}
          userId={friend.userId}
          name={friend.displayName || friend.username}
          avatarUrl={friend.avatarUrl}
        />
      ))}
    </div>
  )
}
