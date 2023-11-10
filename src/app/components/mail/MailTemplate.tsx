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
    username: string;
}

const MailTemplate = ({
    username
}: MailTemplateProps) => {
    return (
        <Html>
            <Head />
            <Preview>Hello, {username}, Please verfiy your account.</Preview>
            <Tailwind>
                <Body>
                    <Container>
                        <Section>
                            <Hr />
                            <Text>
                                Welcome to onboard. Please verfiy and active your account.
                            </Text>
                            <Button
                                href="https://dashboard.stripe.com/login"
                            >
                                Verify Your Account
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

export default MailTemplate