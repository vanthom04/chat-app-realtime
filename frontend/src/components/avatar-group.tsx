import { cn, generateGroupAvatar } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface Props {
  name: string
  imageUrl?: string
  className?: string
}

export const AvatarGroup = ({ name, imageUrl, className }: Props) => {
  const { initials, bg } = generateGroupAvatar(name)

  return (
    <Avatar className={cn("size-10", className)}>
      <AvatarImage src={imageUrl} />
      <AvatarFallback style={{ backgroundColor: bg }} className="font-semibold text-sm">
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
