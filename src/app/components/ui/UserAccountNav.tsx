
'use client'

import { Button } from "@/components/ui/button"
import { Separator } from "@radix-ui/react-separator"
import { signOut } from "next-auth/react"
import ResetPasswordDialog from "./ResetPasswordDialog"

const UserAccountNav = () => {
  return (
    <>
      <ResetPasswordDialog/>
      {/* <Separator orientation="vertical"/> */}
      <Button onClick={() => signOut({
        redirect: true,
        callbackUrl: `${window.location.origin}/sign-in`
      })} variant='default'>Sign Out</Button>
    </>
  )
}

export default UserAccountNav