import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { UserStatistic } from "@/types/user"


export async function GET(req: NextRequest) {
    try {
        
        const searchParams = req.nextUrl.searchParams
        const shift = searchParams?.get("shift") ?? "7"
        const totals = await db.user.count()
     
        const today = new Date()
        let last0Day = new Date(`${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()} 00:00:00`)
        let last7Day = new Date(new Date().setDate(today.getDate() - Number(shift)))
        
        const activeUsersToday = await db.user.findMany({
            where: { lastLogon: 
                {
                    lte: today,
                    gte : last0Day 
                } 
            }
        })
        // console.log(activeUsersToday)
        const activeUserslast7Day = await db.user.findMany({
            where: { lastLogon: 
                {
                    lte: today,
                    gte : last7Day 
                } 
            }
        })
   
        // console.log(activeUserslast7Day)
        let statistics = {} as UserStatistic
        statistics.totalSignedUpUsers = totals
        statistics.totalActiveSessionToday = activeUsersToday.length
        statistics.averageSessionInLast7Days = activeUserslast7Day.length / Number(shift)

        // console.log(statistics)
        return NextResponse.json(statistics)
    }
    catch (error: any) {
        console.error(error)
        return NextResponse.json({ message: "Something went wrong." }, { status: 500 })
    }
}