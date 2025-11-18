import { MoreHorizontalIcon, TriangleAlertIcon } from "lucide-react"

import { useConversationId } from "@/features/conversations/hooks/use-conversation-id"
import { useGetConversationById } from "@/features/conversations/api/use-get-conversation-by-id"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import { Header } from "./components/header"
import { ChatInput } from "./components/chat-input"
import { MessageList } from "./components/message-list"

export const ConversationsPage = () => {
  const conversationId = useConversationId()

  const { data, isLoading } = useGetConversationById(conversationId)

  if (isLoading) {
    return <ConversationLoading />
  }

  if (!data) {
    return <ConversationError />
  }

  return (
    <div className="h-full flex flex-col">
      <Header conversation={data} />
      <MessageList conversationId={conversationId} />
      <ChatInput conversationId={conversationId} />
    </div>
  )
}

const ConversationLoading = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Header Skeleton */}
      <div className="bg-white dark:bg-slate-600 border-b flex items-center px-3 py-2">
        <div className="flex items-center gap-x-2">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-5 w-[200px]" />
            <Skeleton className="h-3 w-[80px]" />
          </div>
        </div>
        <div className="flex items-center gap-x-2 ml-auto">
          <Button size="icon" variant="ghost">
            <MoreHorizontalIcon />
          </Button>
        </div>
      </div>
      {/* Message List Skeleton */}
      <div className="h-full bg-white dark:bg-slate-900 flex-1 flex flex-col gap-3 px-3 py-2">
        <div className="flex items-start gap-x-2">
          <Skeleton className="size-8 rounded-full" />
          <div className="flex flex-col gap-y-1.5">
            <Skeleton className="h-6 w-[150px] lg:w-[250px]" />
            <Skeleton className="h-16 w-[260px] lg:w-[520px]" />
            <Skeleton className="h-6 w-[80px] lg:w-[150px]" />
          </div>
        </div>
        <div className="flex items-start justify-end gap-x-2">
          <div className="flex flex-col items-end gap-y-1.5">
            <Skeleton className="h-6 w-[200px] lg:w-[500px]" />
            <Skeleton className="h-6 w-[100px]" />
          </div>
          <Skeleton className="size-8 rounded-full" />
        </div>
        <div className="flex items-start gap-x-2">
          <Skeleton className="size-8 rounded-full" />
          <div className="flex flex-col gap-y-1.5">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-6 w-[100px]" />
          </div>
        </div>
        <div className="flex items-start justify-end gap-x-2">
          <div className="flex flex-col items-end gap-y-1.5">
            <Skeleton className="h-20 w-[260px] lg:w-[520px]" />
            <Skeleton className="h-6 w-[100px]" />
          </div>
          <Skeleton className="size-8 rounded-full" />
        </div>
        <div className="flex items-start gap-x-2">
          <Skeleton className="size-8 rounded-full" />
          <div className="flex flex-col gap-y-1.5">
            <Skeleton className="h-6 w-[80px]" />
            <Skeleton className="h-6 w-[180px]" />
          </div>
        </div>
      </div>
      {/* Chat Input */}
      <ChatInput conversationId="loading" />
    </div>
  )
}

const ConversationError = () => {
  return (
    <div className="bg-white flex-1 h-full flex flex-col items-center justify-center gap-2">
      <TriangleAlertIcon className="size-8 text-destructive" />
      <p className="text-muted-foreground text-[15px]">
        Có lỗi xảy xa. Vui lòng thử lại sau!
      </p>
    </div>
  )
}
