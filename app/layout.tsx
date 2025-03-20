import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/ui/theming/theme-provider"

export const metadata = {
  title: "Sandro Gromen-Hayes - Film & Photo",
  description: "High Altitudes and Hostile Environment",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'