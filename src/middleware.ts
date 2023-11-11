
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const path = request.nextUrl.pathname

    const isPublicPath = path === '/sign-in' || path === '/sign-up' || path === '/verify-mail'

    //const token = request.cookies.get('token')?.value || ''
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


export const config = {
    matcher: [
        '/admin:path*',
    ]
}