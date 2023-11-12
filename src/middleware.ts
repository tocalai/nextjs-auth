
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const path = request.nextUrl.pathname

    const isPublicPath = anonymousPaths.find(anonymous => anonymous === path)

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.nextUrl))
    }

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/sign-in', request.nextUrl))
    }
}

const anonymousPaths = [
    '/sign-in',
    '/sign-up',
    '/verify-mail'
]

export const config = {
    matcher: [
        '/admin:path*',
    ]
}