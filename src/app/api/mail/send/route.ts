
import MailValidationTemplate from '@/app/components/mail/MailValidationTemplate';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import * as bcrypt from 'bcrypt'
import { db } from "@/lib/db"
import ResetPasswordTemplate from '@/app/components/mail/ResetPasswordTemplate';
import { isNullOrUndefined } from '@/lib/utils';

import { EmailType } from '@/types/enums';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * @swagger
 * /api/mail/send:
 *   post:
 *     tags:
 *       - Mail
 *     summary: Sending mail for new account registration process
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               type:
 *                 type: number
 *                 enum:
 *                   - EmailValidation
 *                   - ResetPassword
 *     responses:
 *       '500':
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { userId, type } = body
        const token = await bcrypt.hash(userId, 10)
        const expired = Number(process.env.TOKEN_EXPIRE_LIFE_TIME)

        const user = await db.user.findUnique({
            where: { id: userId }
        })

        if (!user) return NextResponse.json({ message: "User not found." }, { status: 500 })

        const username = user.username
        const sendTo = user.email
        // store token to db
        const newVerificationToken = await db.verificationToken.create({
            data:
            {
                identifier: userId,
                token: token,
                expires: new Date(Date.now() + expired) // expired one hour
            }
        })

        if (!newVerificationToken) return NextResponse.json({ message: "VerificationToken create failed." }, { status: 500 })

        const getMailTemple = (type: EmailType): React.JSX.Element => {
            switch (type) {
                case EmailType.EmailValidation:
                    return (MailValidationTemplate({ id: userId, username: username, token: token }))
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
            from: 'No-relpy <onboarding@ducky-studio.xyz>',
            to: [`${sendTo}`],
            subject: getSubject(type),
            react: getMailTemple(type)
        });


        if (!isNullOrUndefined(result.data)) return NextResponse.json({ result: result, message: 'Mail has been submitted.' });

        return NextResponse.json({ result: result, message: "Send email occurred error." }, { status: 500 })

    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ message: "Something went wrong. " }, { status: 500 })
    }
}