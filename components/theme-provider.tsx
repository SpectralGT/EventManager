"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useTheme } from "next-themes"
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {

    const { setTheme } = useTheme()
    setTheme("light")
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
