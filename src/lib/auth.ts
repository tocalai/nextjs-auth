import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "./db"
import { compare } from "bcrypt"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    session: {
        strategy: 'jwt'
    },
    pages: {
      signIn: '/sign-in'       
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) return null
                
                const user = await db.user.findUnique({
                    where: {email: credentials.email}
                })
                if (!user) return null
 
                const isPasswordMatch = await compare(credentials.password, user.password)
              
                if (isPasswordMatch) {
                    return {
                        id: `${user.id}`,
                        username: user.username,
                        email: user.email
                    }
                }

                return null
            
            }
        })
    ]
}