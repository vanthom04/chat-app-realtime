import { statusColors } from "@/utils/colors"
import { type UserStatus } from "@/features/users/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Props {
  name: string
  status: UserStatus
  avatarUrl?: string
}

export const AvatarStatus = ({ name, status, avatarUrl }: Props) => {
  return (
    <div className="relative">
      <Avatar className="size-10">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback className="font-semibold">
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div
        style={{ backgroundColor: statusColors[status] }}
        className="absolute bottom-[-1.5px] right-[1px] rounded-full w-3 h-3 border-2 border-white"
      />
    </div>
  )
}
