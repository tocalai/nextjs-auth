import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/db"
import * as bcrypt from "bcrypt"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { id, oldPassword, newPassword } = body

        const user = await db.user.findUnique({
            where: {id: id}
        })

        if (!user) return NextResponse.json({ message: "User not found." }, { status: 500 })

        const hashOldPassword = await bcrypt.hash(oldPassword, 10)
        const isPasswordMatch = await bcrypt.compare(hashOldPassword, user.password)

        if (!isPasswordMatch) return NextResponse.json({ message: "Old passwrod not match." }, { status: 500 })

        const hashedPassword = await bcrypt.hash(newPassword, 10)

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