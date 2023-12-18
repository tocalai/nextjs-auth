import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export const dynamic = 'force-dynamic'
/**
 * @swagger
 * /api/user/admin/read:
 *   get:
 *     tags:
 *       - User
 *     summary: Read user information
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
*       - in: query
 *         name: offset
 *         schema:
 *           type: integer
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
 *                $ref: '#/components/schemas/User'
 * 
 * components:
 *   schemas:
 *     User:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        username:
 *          type: string
 *        isVerified:
 *          type: boolean
 *        count:
 *          type: integer
 *        lastLogon:
 *          type: string
 *          format: date-time
 *        createAt:
 *          type: string
 *          format: date-time
 * 
 */

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const limit = searchParams?.get("limit") ?? process.env.NEXT_PUBLIC_USER_STATISTICS_TABLE_ROWS_PER_PAGE
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