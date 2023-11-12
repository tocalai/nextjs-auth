'use client'
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { useState } from "react"
import SpinnerButton from "./SpinnerButton "


const GoogleSignInButton = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const loginWithGoogle =  async () => {
        setIsSubmitting(true)
        try {
            const signInData = await signIn('google', {callbackUrl: "/admin"})
            console.log(signInData)
        }catch (error : any) {
            console.error(error)
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