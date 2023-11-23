import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import Navbar from './components/ui/Navbar'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from './context/AuthProvider'
import { AppContext } from 'next/app'
import { getSession } from 'next-auth/react'
import { Session, getServerSession } from 'next-auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Auth App',
  description: 'Created@ Danny Lai',
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  
  const session = await getServerSession() as Session

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider session={session}>
          <main className='h-screen flex flex-col justify-center items-center'>
            <Navbar />
            {children}
          </main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
