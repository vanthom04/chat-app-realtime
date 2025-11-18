import { useParams } from "react-router"

export const useConversationId = () => {
  const params = useParams()
  return params.id as string
}
