
import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import * as z from 'zod'
import { db } from "@/lib/db"

const userSchema = z.object({
    username: z.string().min(1, "Username is reqired."),
    email: z.string().min(1, "Email is reqired.").email('Ivalid email.'),
    password: z.string().min(1, 'Password is required.'),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, username, password } = userSchema.parse(body)
        // check if email already existed
        const userByEmail = await db.user.findUnique({
            where: {email: email}
        })
        
        if(userByEmail) {
            return NextResponse.json({user: null, message: 'Email with the user already existed.', status: 409})
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

        const {password: newUserPassword, ...userWithoutPassword} = newUser
        return NextResponse.json({user: userWithoutPassword, message: 'User created successfully.', status: 201})

    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ message: "something went wrong", status: 500 })
    }
}