import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { FirebaseProvider } from '@/components/firebase-provider'
import { ThemeProvider } from '@/components/theme-provider'
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
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <FirebaseProvider>
            {children}
            <Analytics />
          </FirebaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
