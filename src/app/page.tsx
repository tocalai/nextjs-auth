import { authOptions } from '@/lib/auth'
import { Hand } from 'lucide-react'
import { getServerSession } from 'next-auth'

export default async function Home() {
  const session = await getServerSession(authOptions)
  console.log(session)
  if (session?.user) {
    return (
      <div className="container items-center justify-between text-lime-500 text-5xl pt-6"><Hand className=''/> Hello {session?.user.username}, Welcome To Landing Page!</div>
    )
  }
  else {
    return (
      <h2 className="container items-center justify-between text-5xl pt-6"><Hand/> Hello anonymous, Welcome To Landing Page!</h2>
    )
  }
}
