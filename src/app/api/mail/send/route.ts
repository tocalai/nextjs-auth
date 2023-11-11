
import MailValidationTemplate from '@/app/components/mail/MailValidationTemplate';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import * as bcrypt from 'bcrypt'
import { db } from "@/lib/db"
import ResetPasswordTemplate from '@/app/components/mail/ResetPasswordTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { username, sendTo, userId, type } = body
        const token = await bcrypt.hash(userId, 10)

        // store token to db
        const newVerificationToken = await db.verificationToken.create({
            data:
            {
                identifier: userId,
                token: token,
                expires: new Date(Date.now() + (60 * 60 * 1000)) // expired one hour
            }
        })

        if (!newVerificationToken) return NextResponse.json({ message: "VerificationToken create failed.", status: 500 })

        var subject = ''
        const getMailTemple = (type: emailType): React.JSX.Element => {
            switch (type) {
                case emailType.emailValidation:
                    subject = 'Verify Your Mail'
                    return (MailValidationTemplate({ username: username, token: token }))
                case emailType.resetPassword:
                    subject = 'Reset Your Password'
                    return (ResetPasswordTemplate({ username: username, token: token }))
                default:
                    throw new Error('Mail template not found.')
            }
        }

        const result = await resend.emails.send({
            from: 'No-relpy <onboarding@resend.dev>',
            to: [`${sendTo}`],
            subject: subject,
            react: getMailTemple(type)
        });

        return NextResponse.json({result: result, message: 'Mail has been submitted.', status: 201});
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ message: "Something went wrong", status: 500 })
    }
}