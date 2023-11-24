import { Button, ButtonProps } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { CheckCircle } from "lucide-react"


const PasswordCriteriaCard = ({ ...props }: ButtonProps) => {
    return (
        <>
            <HoverCard {...props}>
                <HoverCardTrigger asChild>
                    <Button variant="link">(Criteria)</Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-120">
                    <div className="flex justify-start">
                        <CheckCircle size={20} /><div>contains at least one lower character</div>
                    </div>
                    <div className="flex justify-start">
                        <CheckCircle size={20} /><div>contains at least one upper character</div>
                    </div>
                    <div className="flex justify-start">
                        <CheckCircle size={20} /><div>contains at least one digit character</div>
                    </div>
                    <div className="flex justify-start">
                        <CheckCircle size={20} /><div>contains at least one special character</div>
                    </div>
                    <div className="flex justify-start">
                        <CheckCircle size={20} /><div>contains at least 8 characters</div>
                    </div>
                </HoverCardContent>

            </HoverCard>
        </>
    )
}

export default PasswordCriteriaCard