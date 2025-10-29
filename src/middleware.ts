import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

const COOKIE_NAME = 'admin_token';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Get the cookie from the request
  const cookie = request.cookies.get(COOKIE_NAME);
  
  // 2. Get the JWT secret from environment
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("JWT_SECRET is not set in middleware.");
    // This is a server error, but we'll redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const secretKey = new TextEncoder().encode(jwtSecret);
  
  // 3. Try to verify the cookie token
  let tokenPayload = null;
  if (cookie) {
    try {
      const { payload } = await jose.jwtVerify(cookie.value, secretKey);
      if (payload.isAdmin) {
        tokenPayload = payload;
      }
    } catch (err) {
      // Token is invalid (expired, wrong signature, etc.)
      console.log("Token verification failed:", err);
    }
  }

  // 4. Logic for admin pages
  if (pathname.startsWith('/admin')) {
    if (tokenPayload) {
      // User is authenticated and an admin, let them proceed
      return NextResponse.next();
    } else {
      // User is not authenticated, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Allow all other requests to pass
  return NextResponse.next();
}

// 6. This "matcher" configures which paths the middleware runs on
export const config = {
  matcher: [
    '/admin', // Protect all routes under /admin
    '/login',        // Run on the login page (to redirect logged-in users)
  ],
};