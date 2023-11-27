import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const limit = searchParams?.get("limit") ?? process.env.USER_STATISTICS_TABLE_ROWS_PER_PAGE
        const offset = searchParams?.get("offset") ?? "0"

        const allUsers = db.user.findMany({
            skip: Number(offset),
            take: Number(limit),
            select: {
                email: true,
                username: true,
                isVerified: true,
                count: true,
                lastLogon: true,
                createdAt: true
            },
            orderBy: [{
                lastLogon: {
                    sort: 'desc', nulls: 'last'
                }
            }]
        })
        const totals = await db.user.count()

        return NextResponse.json({ data: JSON.stringify((await allUsers).map(u => u)), totals: totals })

    }
    catch (error: any) {
        console.error(error.message)
        return NextResponse.json({ message: "Something went wrong." }, { status: 500 })
    }
}