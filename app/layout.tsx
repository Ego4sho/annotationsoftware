import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DeeperEdge - Advanced Movement Classification Platform',
  description: 'DeeperEdge offers cutting-edge movement classification technology for sports and healthcare, revolutionizing performance analysis and injury prevention.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
