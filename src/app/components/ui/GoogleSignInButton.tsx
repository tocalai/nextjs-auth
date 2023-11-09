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
        const signInData = await signIn('google', {callbackUrl: "/admin"})
        console.log(signInData)
        setIsSubmitting(false)
    }

    return (
        <div>
            {/* <Button onClick={loginWithGoogle} className="w-full">{children}</Button> */}
            <SpinnerButton onClick={loginWithGoogle} name={children as string} state={isSubmitting} disabled={isSubmitting} className='w-full' />
        </div>
    )
}

export default GoogleSignInButton