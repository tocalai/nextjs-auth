
import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/db"

/**
 * @swagger
 * /api/mail/verify:
 *   post:
 *     tags:
 *       - Mail
 *     summary: Verify user mail content accroding token
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
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
        const { token } = body
        console.log('Token', token)
        const verificationToken = await db.verificationToken.findUnique({
            where: { token: token, expires: { gte: new Date() } }
        })

        console.log('verificationToken:', verificationToken)
        if (!verificationToken) return NextResponse.json({ message: "Token not found or expired."}, { status: 500 })

        const userFromToken = await db.user.findUnique({
            where: { id: verificationToken.identifier }
        })

        console.log('userFromToken:', userFromToken)
        if (!userFromToken) return NextResponse.json({ message: "User not found."}, { status: 500 })

        const updateUser = await db.user.update({
            where: { id: verificationToken.identifier },
            data: {
                isVerified: true,
                emailVerified: new Date(),
                updatedAt: new Date()
            }
        })

        console.log('updateUser:', updateUser)
        if (!updateUser) return NextResponse.json({ message: "Updated user failed." }, { status: 500 })

        return NextResponse.json({ message: 'Email verified successfully.' })

    }
    catch (error: any) {
        console.error(error)
        return NextResponse.json({ message: "Something went wrong." }, { status: 500 })
    }
}