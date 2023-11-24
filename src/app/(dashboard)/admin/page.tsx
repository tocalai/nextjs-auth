import { toast } from "@/components/ui/use-toast"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

const page = async () => {
  const session = await getServerSession(authOptions)

  const getUsers = async () => {
    try {
      const usersRes = await fetch(`${process.env.NEXTAUTH_URL}/api/user/admin/read`, {
        method: 'GET'
      })

      if (!usersRes.ok) throw new Error('Retrieved users failed')
    
      const {data} = await usersRes.json()

      console.log(data) 
      return data
    }
    catch (error: any) {
      console.error(error.message)
      toast({
        title: "Get user statistic failed",
        description: `Something went wrong, ${error.message}.`,
        variant: 'destructive'
      })
    }
  }

  await getUsers()
  //console.log(data)
}

export default page