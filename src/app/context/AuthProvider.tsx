'use client'

import refreshSession from "@/lib/utils"
import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import { useEffect } from "react"

interface AuthProviderProps {
    children: React.ReactNode
    session: Session
}
export const AuthProvider = ({ children, session }: AuthProviderProps) => {

    useEffect(() => {
        refreshSession() 
    }, [session]);

    return (
        <>
            <SessionProvider refetchInterval={5 * 60}>{children}</SessionProvider>
        </>
    )
}
