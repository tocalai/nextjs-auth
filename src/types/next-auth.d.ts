import NextAuth from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */

    interface User {
        username: string
        isVerified: boolean
        count: number
    }
    interface Session {
        user: User & {
            // id: string
            // username: string
            // isVerified: boolean
        },
        token: {
            // id: string
            // username: string
            // isVerified: boolean
        }
    }
}