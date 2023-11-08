import { Loader2 } from "lucide-react"
import { Button, ButtonProps } from "@/components/ui/button"

interface SpinnerButtonProps extends ButtonProps {
    state: boolean
    name: string
}

const SpinnerButton = ({
    state,
    name,
    ...props
}: SpinnerButtonProps) => {
    return (
        <Button {...props}>
            {state ? (
                <>
                    <Loader2 className="mr6 h-5 w-5 animate-spin" />
                    Please wait...
                </>
            ) : (
                <span>{name}</span>
            )}
        </Button>
    )
}

export default SpinnerButton 