import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Content Idea Manager',
  description: 'Manage your content ideas efficiently',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif' }}>{children}</body>
    </html>
  )
}
