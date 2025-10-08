import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Beyond - Study Abroad Platform',
  description: 'Your gateway to global education opportunities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
