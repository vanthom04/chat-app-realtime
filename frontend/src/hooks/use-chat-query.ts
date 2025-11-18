import { useInfiniteQuery } from "@tanstack/react-query"

import { useSocket } from "@/components/providers/socket-provider"

import { api } from "@/lib/api"

interface Props {
  queryKey: string
  conversationId: string
}

export const useChatQuery = ({ queryKey, conversationId }: Props) => {
  const { isConnected } = useSocket()

  const fetchMessages = async ({ pageParam = undefined }) => {
    const res = await api.get<any>("/api/messages", {
      params: {
        conversationId,
        cursor: pageParam
      },
      headers: {
        "Content-Type": "application/json"
      }
    })

    return res
  }

  const { data, status, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    initialPageParam: undefined,
    refetchInterval: isConnected ? false : 1000,
    getNextPageParam: (lastPage) => lastPage?.nextCursor
  })

  return { data, status, hasNextPage, isFetchingNextPage, fetchNextPage }
}
