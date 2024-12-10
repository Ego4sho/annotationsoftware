import { Inter } from 'next/font/google'
import './globals.css'
import { Metadata } from 'next'
import { AuthProvider } from '@/lib/context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
