
'use client'

import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import ResetPasswordDialog from "./ResetPasswordDialog"
import { Separator } from "@/components/ui/separator"

const UserAccountNav = () => {
  return (
    <>
      <div>Profie</div>
      <ResetPasswordDialog/>
      <Separator orientation="vertical"/>
      <Button onClick={() => signOut({
        redirect: true,
        callbackUrl: `${window.location.origin}/sign-in`
      })} variant='default'>Sign Out</Button>
    </>
  )
}

export default UserAccountNav