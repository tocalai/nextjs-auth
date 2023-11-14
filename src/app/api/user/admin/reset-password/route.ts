import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/db"
import { hash } from "bcrypt"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { id, newPassword } = body

        const hashedPassword = await hash(newPassword, 10)

        const updateUser = await db.user.update({
            where: { id: id },
            data: {
                password: hashedPassword,
                updatedAt: new Date()
            }
        })

        if(!updateUser) return NextResponse.json({ message: "Updated user failed." }, { status: 500 })

        return NextResponse.json({ message: 'Reset password successfully.' });

    }
    catch (error: any) {
        console.error(error)
        return NextResponse.json({ message: "Something went wrong." }, { status: 500 })
    }
}