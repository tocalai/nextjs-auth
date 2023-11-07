'use client'
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"


const GoogleSignInButton = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const loginWithGoogle =  async () => {
        const signInData = await signIn('google')
        console.log(signInData)
    }

    return (
        <div>
            <Button onClick={loginWithGoogle} className="w-full">{children}</Button>
        </div>
    )
}

export default GoogleSignInButton