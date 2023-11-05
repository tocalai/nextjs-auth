
'use clinet'

import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

const UserAccountNav = () => {
  return (
    <Button  onClick ={() => signOut({
        redirect:  true,
        callbackUrl: `${window.location.origin}/sign-in`
    })} variant='outline'>Sign Out</Button>
  )
}

export default UserAccountNav