import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "StockFlow",
  description: "Simple Inventory Management",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#F9FAFB' }}>
        {children}
      </body>
    </html>
  )
}