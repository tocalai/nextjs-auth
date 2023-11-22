import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import Navbar from './components/ui/Navbar'
import { Toaster } from '@/components/ui/toaster'
import { Session } from 'next-auth'
import { AuthProvider } from './context/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Auth App',
  description: 'Created@ Danny Lai',
}

const getSession = async (cookie: string): Promise<Session> => {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`, {
    headers: {
      cookie,
    },
  });

  const session = await response.json();

  return Object.keys(session).length > 0 ? session : null;
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getSession(new Headers().get('cookie') ?? '')
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
