import { vi } from "date-fns/locale"
import { TriangleAlertIcon } from "lucide-react"
import { format, isToday, isYesterday } from "date-fns"
import { useCallback, useEffect, useLayoutEffect, useRef } from "react"

import { type MessageWithSender } from "@/features/messages/types"
import { useUserActivity } from "@/features/users/hooks/use-user-activity"

import { Spinner } from "@/components/ui/spinner"
import { useChatQuery } from "@/hooks/use-chat-query"
import { useChatSocket } from "@/hooks/use-chat-socket"
import { useSocket } from "@/components/providers/socket-provider"

import { MessageItem } from "./message-item"

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr)

  if (isToday(date)) return "Hôm nay"
  if (isYesterday(date)) return "Hôm qua"
  return format(date, "EEEE, dd/MM/yyyy", {
    locale: vi
  })
}

interface Props {
  conversationId: string
}

export const MessageList = ({ conversationId }: Props) => {
  const { socket } = useSocket()

  const queryKey = `chat:${conversationId}`
  const addKey = `chat:${conversationId}:messages`
  const updateKey = `chat:${conversationId}:messages:update`

  const chatRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollSnapshotRef = useRef<number | null>(null)

  const { data, status, hasNextPage, isFetchingNextPage, fetchNextPage } = useChatQuery({
    conversationId,
    queryKey
  })

  // --- Hàm xử lý sự kiện cuộn ---
  const handleScroll = useCallback(() => {
    const container = chatRef.current
    if (!container) return

    if (container.scrollTop === 0 && !isFetchingNextPage && hasNextPage) {
      scrollSnapshotRef.current = container.scrollHeight
      fetchNextPage()
    }
  }, [isFetchingNextPage, hasNextPage, fetchNextPage])

  // --- Gắn sự kiện scroll ---
  useEffect(() => {
    const container = chatRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)

      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  // --- Khôi phục vị trí cuộn ---
  useLayoutEffect(() => {
    const container = chatRef.current

    // Kiểm tra xem có snapshot (scrollHeight cũ) không
    if (scrollSnapshotRef.current !== null && container) {
      const newScrollHeight = container.scrollHeight
      const oldScrollHeight = scrollSnapshotRef.current

      // Đặt lại vị trí cuộn
      // Vị trí mới = (chiều cao mới) - (chiều cao cũ)
      // Điều này giữ cho tin nhắn "cũ" (mà user đang thấy) ở đúng vị trí
      container.scrollTop = newScrollHeight - oldScrollHeight

      // Xóa snapshot để không chạy lại
      scrollSnapshotRef.current = null
    }
  }, [data])

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth"
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.pages?.[0]?.items?.length])

  useUserActivity(socket)
  useChatSocket({ queryKey, addKey, updateKey })

  if (status === "pending") {
    return (
      <div className="flex-1 flex items-center flex-col justify-center h-full bg-white dark:bg-slate-800">
        <Spinner className="mb-1" />
        <p className="text-[13px] text-muted-foreground">Đang tải tin nhắn...</p>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-y-1.5 h-full bg-white dark:bg-slate-800">
        <TriangleAlertIcon className="size-4 text-destructive" />
        <p className="text-[13px] text-muted-foreground">Có lỗi xảy ra vui lòng thử lại sau!</p>
      </div>
    )
  }

  if (data?.pages[0].items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-y-1.5 h-full bg-white dark:bg-slate-900">
        <p className="text-sm text-muted-foreground">Chưa có tin nhắn...</p>
      </div>
    )
  }

  const groupedMessages = data?.pages
    .flatMap((page) => page.items)
    .reduce((groups, message) => {
      const dateKey = format(message.createdAt, "yyyy-MM-dd")

      if (!groups[dateKey]) {
        groups[dateKey] = []
      }

      groups[dateKey].unshift(message)
      return groups
    }, {}) as Record<string, MessageWithSender[]>

  return (
    <div
      ref={chatRef}
      className="flex-1 flex flex-col pb-4 bg-white dark:bg-slate-900 px-3 py-2 overflow-y-auto"
    >
      {hasNextPage && (
        <div className="flex items-center justify-center">
          {isFetchingNextPage ? (
            <Spinner className="my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-muted-foreground text-xs my-4 cursor-pointer hover:opacity-80"
            >
              Tải tin nhắn trước đó
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {Object.entries(groupedMessages).map(([dateKey, messages]) => (
          <div key={dateKey} className="space-y-1">
            <div className="flex items-center justify-center my-2">
              <span className="text-xs font-medium px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-700">
                {formatDateLabel(dateKey)}
              </span>
            </div>
            {messages.map((message) => (
              <MessageItem
                key={message.id}
                id={message.id}
                type={message.type}
                content={message.content}
                attachmentUrl={message.attachmentUrl}
                createdAt={message.createdAt}
                updatedAt={message.updatedAt}
                sender={message.sender}
              />
            ))}
          </div>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  )
}
