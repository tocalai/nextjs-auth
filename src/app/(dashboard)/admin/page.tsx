import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

const page = async () => {
  const session = await getServerSession(authOptions)

   if (session?.user) {
    return (
      <div>Welcome to Dashboard {session?.user.username}</div>
    )
   }

}

export default page