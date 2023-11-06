import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "./db"
// import { compare } from "bcrypt"
import * as bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
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
                email: { label: "Email", type: "email", placeholder: "jsmith@abc.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                console.log(credentials)
                if (!credentials?.email || !credentials?.password) return null

                const user = await db.user.findUnique({
                    where: { email: credentials.email }
                 })

                if (!user) return null

                const isPasswordMatch = await bcrypt.compare(credentials.password, user.password)

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
    ],
    callbacks: {
        // async signIn({ user, account, profile, email, credentials }) {
        //     if (!user) return false
            
        //     console.log(credentials)
        //     return true
        // },
        // async redirect({ url, baseUrl }) {
        //     return baseUrl
        // },

        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    username: user.username
                }
            }
            return token
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    username: token.username
                }
            }

        }
    }
}