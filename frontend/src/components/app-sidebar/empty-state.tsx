import { type LucideIcon } from "lucide-react"

interface Props {
  icon: LucideIcon
  title: string
}

export const EmptyState = ({ icon: Icon, title }: Props) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 p-2">
      <Icon className="size-5" />
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  )
}
