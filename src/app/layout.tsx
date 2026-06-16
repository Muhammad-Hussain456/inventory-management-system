import type { Metadata } from "next"
import { ThemeProvider } from "@/lib/theme"

export const metadata: Metadata = {
  title: "StockFlow",
  description: "Smart Inventory Management",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ background: '#0a0a0a' }}>
      <body style={{ margin: 0, background: '#0a0a0a' }}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}