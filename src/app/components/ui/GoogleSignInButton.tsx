'use client'

import { signIn } from "next-auth/react"
import { useState } from "react"
import SpinnerButton from "./SpinnerButton "
import { toast } from "@/components/ui/use-toast"


const GoogleSignInButton = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const loginWithGoogle =  async () => {
        setIsSubmitting(true)
        try {
            const signInData = await signIn('google', {callbackUrl: "/admin/user"})
            // console.log(signInData)
        }catch (error : any) {
            console.error(error)
            toast({
                title: "Google Oauth failed",
                description: `Something went wrong, ${error.message}.`,
                variant: 'destructive'
              })
        } 
        setIsSubmitting(false)
    }

    return (
        <div>
            <SpinnerButton onClick={loginWithGoogle} name={children as string} state={isSubmitting} disabled={isSubmitting} className='w-full' />
        </div>
    )
}

export default GoogleSignInButton