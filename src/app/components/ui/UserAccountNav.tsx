
'use client'

import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import ResetPasswordDialog from "./ResetPasswordDialog"
import { Separator } from "@/components/ui/separator"
import ProfileSheet from "./ProfileSheet"

const UserAccountNav = () => {
  return (
    <>
      <ProfileSheet />
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