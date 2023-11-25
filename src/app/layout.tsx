import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/ui/Navbar'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from './context/AuthProvider'
import { Session, getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'
import { headers } from 'next/headers' 

// const inter = Inter({ subsets: ['latin'] })

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
      {/* <body className={inter.className}> */}
      <body>
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
