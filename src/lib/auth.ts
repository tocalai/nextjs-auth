import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "./db"
import * as bcrypt from 'bcrypt'
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google"
// import { Prisma, PrismaClient } from "@prisma/client"

const customAdapter = PrismaAdapter(db);
// @ts-ignore
customAdapter.createUser = (data: any) => {
    console.log("Data: ", data);

    return db.user.create({
        data: {
            ...data,
            count: 1,
            lastLogon: new Date()
        }
    })

}

export const authOptions: NextAuthOptions = {
    adapter: customAdapter,
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/sign-in'
    },
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "jsmith@abc.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                console.log('authroized', credentials)
                if (!credentials?.email || !credentials?.password) return null

                const user = await db.user.findUnique({
                    where: { email: credentials.email }
                })

                if (!user) return null

                const isPasswordMatch = await bcrypt.compare(credentials.password, user.password)

                if (isPasswordMatch) {
                    return user
                    // return {
                    //     id: `${user.id}`,
                    //     username: user.username,
                    //     email: user.email,
                    //     isVerified: isVerified
                    // }
                }

                return null

            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            },
            async profile(profile: GoogleProfile) {

                const hashPassword = await bcrypt.hash('password', 10)
                return {
                    id: profile.sub,
                    email: profile.email,
                    image: profile.avatar_url,
                    username: profile.name,
                    password: hashPassword,
                    isVerified: profile.email_verified,
                    count: 0
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            console.log('Sign-in', user)
            try {
                const userCount = await db.user.count({
                    where: { email: user.email as string }
                })

                if (userCount > 0 && user && user.isVerified) {
                    const updateUser = await db.user.update({
                        where: { email: user.email as string },
                        data: {
                            count: user.count + 1,
                            lastLogon: new Date()
                        }
                    })

                    if (!updateUser) throw new Error('Update failed', updateUser)
                }

                return Promise.resolve(true)
            }
            catch (error: any) {
                console.error('Sign in failed', error.mesage)
                return Promise.resolve(false)
            }

            // return Promise.resolve(true); // Return true to allow sign-in
        },
        // async redirect({ url, baseUrl }) {
        //     return baseUrl
        // },
        async jwt({ token, user, profile }) {
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    username: user.username,
                    isVerified: user.isVerified
                }
            }

            return token
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    username: token.username,
                    isVerified: token.isVerified
                }
            }


        }
    },
    debug: process.env.NODE_ENV === 'development'
}