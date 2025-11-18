import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000, // 30s
        gcTime: 5 * 60000, // 5m
        refetchOnWindowFocus: false
      }
    }
  })
}

let browserQueryClient: QueryClient | undefined

const getQueryClient = () => {
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()
  }

  return browserQueryClient
}

export const ReactQueryClientProvider = ({ children }: React.PropsWithChildren) => {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
