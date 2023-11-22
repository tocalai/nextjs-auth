import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { id, username, count, lastLogon } = body
        
        const user = await db.user.findUnique({
            where: {id: id}
        })
       
        if (!user) return NextResponse.json({ message: `Can not found the user by id: ${id}.` }, { status: 500 })
        const addCount = user.count + 1
        const updateUser = await db.user.update({
            where: { id: id },
            data: {
                ...(username && { username }),
                ...(count && { addCount }),
                ...(lastLogon && { lastLogon }),
                updatedAt: new Date()
            }
        })

        if (!updateUser) return NextResponse.json({ message: "Updated user failed." }, { status: 500 })

        return NextResponse.json({ message: 'Upate user successfully.' });

    }
    catch (error: any) {
        console.error(error)
        return NextResponse.json({ message: "Something went wrong." }, { status: 500 })
    }
}