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

interface MailTemplateProps {
    username: string
    token: string
}

const MailValidationTemplate = ({
    username,
    token
}: MailTemplateProps) => {
    const verifyUri = `${process.env.NEXTAUTH_URL}/verify-mail?token=${token}`
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
                                Welcome to onboard. Click below button to verfiy and active your account.
                            </Text>
                            <Button
                                href={verifyUri}
                            >
                                Verify Your Email
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

export default MailValidationTemplate