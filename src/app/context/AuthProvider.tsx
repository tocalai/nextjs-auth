'use client'

import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"

interface AuthProviderProps {
    children: React.ReactNode
    session: Session
}
export const AuthProvider = ({ children }: AuthProviderProps) => {

    return (<SessionProvider>{children}</SessionProvider>)
}
