import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "./db"
import * as bcrypt from 'bcrypt'
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google"

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
                const isVerified = user.emailVerified ? true : false
                
                if (isPasswordMatch) {                    
                    return {
                        id: `${user.id}`,
                        username: user.username,
                        email: user.email,
                        isVerified: isVerified
                    }
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
                    isVerified: profile.email_verified
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            console.log('Sign-in', user)
            // console.log('Profile', profile)
            return Promise.resolve(true); // Return true to allow sign-in
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