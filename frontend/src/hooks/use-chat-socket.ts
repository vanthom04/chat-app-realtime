import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"

import type { Message } from "@/features/messages/types"

import { useSocket } from "@/components/providers/socket-provider"

interface Props {
  addKey: string
  updateKey: string
  queryKey: string
}

export const useChatSocket = ({ addKey, updateKey, queryKey }: Props) => {
  const queryClient = useQueryClient()
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket) return

    // Add new message
    socket.on(addKey, (message: Message) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [{ items: [message] }]
          }
        }

        const newData = [...oldData.pages]

        newData[0] = {
          ...newData[0],
          items: [
            message,
            ...newData[0].items
          ]
        }

        return {
          ...oldData,
          pages: newData
        }
      })
    })

    // Update messages
    socket.on(updateKey, (message: any) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData
        }

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: any) => {
              if (item.id === message.id) {
                return message
              }

              return item
            })
          }
        })

        return {
          ...oldData,
          pages: newData
        }
      })
    })

    // Cleanup
    return () => {
      socket.off(addKey)
      socket.off(updateKey)
    }
  }, [socket, addKey, updateKey, queryKey, queryClient])
}
