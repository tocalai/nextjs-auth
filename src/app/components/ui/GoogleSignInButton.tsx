import { Button } from "@/components/ui/button"


const GoogleSignInButton = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const loginWithGoogle = () => {
        console.log('SSO with google')
    }

    return (
        <div>
            <Button onClick={loginWithGoogle} className="w-full">{children}</Button>
        </div>
    )
}

export default GoogleSignInButton