import { ChevronsUpDownIcon, LogOutIcon, UserRoundIcon, UserRoundPlusIcon } from "lucide-react"

import { useAccountModal } from "@/features/users/store/use-account-modal"
import { useFriendInvitationModal } from "@/features/friends/store/use-friend-invitation-modal"

import { Skeleton } from "@/components/ui/skeleton"
import { useAuthStore } from "@/hooks/use-auth-store"
import { SidebarFooter, SidebarMenuButton } from "@/components/ui/sidebar"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

export const AppSidebarFooter = () => {
  const accountModal = useAccountModal()
  const friendInvitationModal = useFriendInvitationModal()

  const { user, isLoading, signOut } = useAuthStore()

  if (isLoading) {
    return <Skeleton className="h-[62px] w-full rounded-md" />
  }

  return (
    <SidebarFooter className="p-0 rounded-lg dark:bg-slate-950 outline-none! mx-2">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton className="h-auto p-1.5 border bg-accent cursor-pointer">
            <Avatar className="size-10 rounded-md">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback className="text-lg rounded-md">
                {(user?.displayName || user?.username)?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {user?.displayName || user?.username}
              </span>
              <span className="truncate text-xs">{user?.email}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-5" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="right" className="min-w-56">
          <div className="flex items-center gap-2 px-1 py-1.5 justify-end">
            <Avatar className="size-9 rounded-md">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback className="rounded-md">
                {(user?.displayName || user?.username)?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm line-clamp-1">{user?.displayName || user?.username}</p>
              <p className="text-xs text-muted-foreground line-clamp-1 tracking-wide">
                {user?.email}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={accountModal.onOpen}>
            <UserRoundIcon />
            Tài khoản
          </DropdownMenuItem>
          <DropdownMenuItem onClick={friendInvitationModal.onOpen}>
            <UserRoundPlusIcon />
            Lời mời kết bạn
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="hover:!text-destructive"
            onClick={async () => await signOut()}
          >
            <LogOutIcon />
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarFooter>
  )
}
