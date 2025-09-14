import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LEGACY',
  description: 'LEGACY - Premium Fashion Experience',
  generator: 'LEGACY',
  icons: {
    icon: '/legacy.png',
    shortcut: '/legacy.png',
    apple: '/legacy.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-mono">
        {children}
      </body>
    </html>
  )
}
