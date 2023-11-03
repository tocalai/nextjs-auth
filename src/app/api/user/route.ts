
import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import * as z from 'zod'

const userSchema = z.object({
    username: z.string().min(1, "Username is reqired."),
    email: z.string().min(1, "Email is reqired.").email('Ivalid email.'),
    password: z.string().min(1, 'Password is required.'),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, username, password } = userSchema.parse(body)

        const hashedPassword = await hash(password, 20)
        // check if email already existed


        // write data to db 

        return NextResponse.json(body)

    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ message: "something went wrong", status: 500 })
    }
}