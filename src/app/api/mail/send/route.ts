
import MailValidationTemplate from '@/app/components/mail/MailValidationTemplate';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import * as bcrypt from 'bcrypt'
import { db } from "@/lib/db"
import ResetPasswordTemplate from '@/app/components/mail/ResetPasswordTemplate';
import { EmailType } from '@/types/enums';

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
                expires: new Date(Date.now() + 360000) // expired one hour
            }
        })

        if (!newVerificationToken) return NextResponse.json({ message: "VerificationToken create failed.", status: 500 })

        const getMailTemple = (type: EmailType): React.JSX.Element => {
            switch (type) {
                case EmailType.EmailValidation:
                    return (MailValidationTemplate({ username: username, token: token }))
                case EmailType.ResetPassword:
                    return (ResetPasswordTemplate({ username: username, token: token }))
                default:
                    throw new Error('Mail template not found.')
            }
        }

        const getSubject = (type: EmailType): string => {
            switch (type) {
                case EmailType.EmailValidation:
                    return 'Verify Your Mail'
                case EmailType.ResetPassword:
                    return 'Reset Your Password'
                default:
                    throw new Error('Mail template not found.')
            }
        }

        const result = await resend.emails.send({
            from: 'No-relpy <onboarding@resend.dev>',
            to: [`${sendTo}`],
            subject: getSubject(type),
            react: getMailTemple(type)
        });

        if (!result.error)  return NextResponse.json({result: result, message: 'Mail has been submitted.', status: 201});

        return NextResponse.json({result:result, message: "Send email failed.", status: 500 })
       
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ message: "Something went wrong", status: 500 })
    }
}