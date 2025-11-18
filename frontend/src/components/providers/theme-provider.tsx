import { ThemeProvider as NextThemesProvider } from "next-themes"

interface ThemeProviderProps extends React.ComponentProps<typeof NextThemesProvider> {}

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
