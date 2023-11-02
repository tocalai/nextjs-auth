import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import Navbar from './components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Auth App',
  description: 'Created@ Danny Lai',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <main className='h-screen flex flex-col justify-center items-center'>
        <Navbar />
        {children}
      </main>
      </body>
    </html>
  )
}
