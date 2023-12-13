import { NextRequest, NextResponse } from "next/server";


/**
 * @swagger
 * /api/health:
 *   get:
 *     tags:
 *       - Health Check
 *     summary: Get the current API service health status
 *     responses:
 *       '500':
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export async function GET(req: NextRequest) {
    try {
        const today = new Date()
        return NextResponse.json({ time: today, message: 'API was in ready status.' })
    }
    catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Something went wrong." }, { status: 500 })
    }
}
