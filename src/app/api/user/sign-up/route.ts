
import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcrypt"
import * as z from 'zod'
import { db } from "@/lib/db"

const userSchema = z.object({
    username: z.string().min(1, "Username is reqired."),
    email: z.string().min(1, "Email is reqired.").email('Ivalid email.'),
    password: z.string().min(1, 'Password is required.'),
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { email, username, password } = userSchema.parse(body)
        // check if email already existed
        const userByEmail = await db.user.findUnique({
            where: { email: email }
        })

        if (userByEmail) {
            return NextResponse.json({ user: null, message: 'Email with the user already existed.' }, { status: 409 })
        }

        // store user info into db       
        const hashedPassword = await hash(password, 10)
        const newUser = await db.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        })

        if (!newUser) return NextResponse.json({ message: "User create failed." }, { status: 500 })

// This code snippet extracts the password from the newUser object and assigns it to the newUserPassword variable. It then creates a new object called userWithoutPassword that contains all the properties of newUser except for the password. Finally, it returns a JSON response with the
        const { password: newUserPassword, ...userWithoutPassword } = newUser
        return NextResponse.json({ user: userWithoutPassword, message: 'User created successfully.' })

    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ message: "Something went wrong." }, { status: 500 })
    }
}