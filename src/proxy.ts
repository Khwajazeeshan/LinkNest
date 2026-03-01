import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname.toLowerCase();

    const publicPaths = [
        "/auth/login",
        "/auth/signup",
        "/auth/checkemail",
        "/auth/verifyemail",
        "/auth/newpassword",
    ];

    const isPublicPath = publicPaths.includes(path);
    const token = request.cookies.get("Accesstoken")?.value || "";

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL("/auth/profile", request.url))
    }

    if (!isPublicPath && !token ) {
        // Allow static files and api routes to pass through if they are not in the matcher
        // but specifically redirect auth-guarded pages to login
        return NextResponse.redirect(new URL("/auth/login", request.url))
    }
}

export const config = {
    matcher: [
        '/auth/profile/:path*',
        '/auth/login',
        '/auth/signup',
        '/auth/checkemail',
        '/auth/verifyemail',
        '/auth/newpassword',
        '/generate',
        "/mylinks"
    ]
}

