import React from 'react'
import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

interface ResetPasswordTemplateProps {
    username: string
    token: string
}

const ResetPasswordTemplate = ({
    username,
    token
}: ResetPasswordTemplateProps) => {
    const resetUri = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`
    return (
        <Html>
            <Head />
            <Preview>Hello, {username}, Please verfiy your email.</Preview>
            <Tailwind>
                <Body>
                    <Container>
                        <Section>
                            <Hr />
                            <Text>
                                Click below button to reset your password.
                            </Text>
                            <Button
                                href={resetUri}
                            >
                                Reset Your Password
                            </Button>
                            <Hr />
                            <Text>
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default ResetPasswordTemplate