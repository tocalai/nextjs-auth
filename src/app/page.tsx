import { authOptions } from '@/lib/auth'
import { Hand } from 'lucide-react'
import { getServerSession } from 'next-auth'

export default async function Home() {
  const session = await getServerSession(authOptions)
  if (session?.user) {
    return (
      <div className="text-lime-500 text-5xl"><Hand/> Hello {session?.user.username}, Welcome To Landing Page</div>
    )
  }
  else {
    return (
      <h2 className="text-5xl"><Hand/> Hello anonymous, Welcome To Landing Page</h2>
    )
  }
}
