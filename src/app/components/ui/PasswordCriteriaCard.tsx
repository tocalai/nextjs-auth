import { Button, ButtonProps } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"


const PasswordCriteriaCard = ({ ...props }: ButtonProps) => {
    return (
        <HoverCard {...props}>
            <HoverCardTrigger asChild>
                <Button variant="link" >(Criteria)</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-120">
                <li>contains at least one lower character</li>
                <li>contains at least one upper character</li>
                <li>contains at least one digit character</li>
                <li>contains at least one special character</li>
                <li>contains at least 8 characters</li>
            </HoverCardContent>
        </HoverCard>
    )
}

export default PasswordCriteriaCard