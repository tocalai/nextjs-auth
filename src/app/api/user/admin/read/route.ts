import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
    try {
        const allUsers = db.user.findMany()
        // console.log(JSON.stringify((await allUsers).map(u => u)))
        return NextResponse.json({ data: JSON.stringify((await allUsers).map(u => u) )})

    }
    catch(error : any) {
        console.error(error.message)
        return NextResponse.json({ message: "Something went wrong." }, { status: 500 })
    }
}