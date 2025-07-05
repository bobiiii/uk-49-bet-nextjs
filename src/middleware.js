import { NextResponse } from 'next/server';

export function middleware(request) {
    const isLogin = request.cookies.get("isLogin")?.value;
    console.log("isLogin", isLogin);

    // List of routes that require login
    const protectedRoutes = [
        '/admin',
        '/admin/ads-txt',
        '/admin/google-verification',
        '/admin/news',
        '/admin/predictions',

    ];

    // Check if the current request is for a protected route
    const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));
    console.log("isProtectedRoute", isProtectedRoute);

    if (isProtectedRoute && isLogin !== 'true') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Allow the request to proceed
    return NextResponse.next();
}
