import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

const COOKIE_NAME = 'admin_token';
const ADMIN_LOGIN_URL = '/admin/login';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Get cookie and secret
  const cookie = request.cookies.get(COOKIE_NAME);
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error("JWT_SECRET is not set in middleware.");
    // For API routes, return a 500 error
    if (pathname.startsWith('/api/')) {
        return NextResponse.json({ success: false, error: 'Internal server configuration error' }, { status: 500 });
    }
    // For pages, redirect to login
    return NextResponse.redirect(new URL(ADMIN_LOGIN_URL, request.url));
  }

  const secretKey = new TextEncoder().encode(jwtSecret);
  
  // 2. Try to verify the token and check for admin
  let isAdmin = false;
  if (cookie) {
    try {
      const { payload } = await jose.jwtVerify(cookie.value, secretKey);
      if (payload.isAdmin === true) {
        isAdmin = true;
      }
    } catch (err) {
      // Token is invalid (expired, wrong signature, etc.)
      console.log("Token verification failed:", err);
    }
  }

  // 3. --- NEW LOGIC FOR PROTECTED API ROUTES ---
  const protectedApiRoutes = ['/api/bonus', '/api/banlist'];
  
  if (protectedApiRoutes.some(route => pathname.startsWith(route))) {
    if (isAdmin) {
      // User is admin, let API request proceed
      return NextResponse.next();
    } else {
      // User is not admin, return 401 Unauthorized JSON response
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  // 4. Logic for admin pages (excluding the login page itself)
  if (pathname.startsWith('/admin') && pathname !== ADMIN_LOGIN_URL) {
    if (isAdmin) {
      // User is admin, let them proceed
      return NextResponse.next();
    } else {
      // User is not admin, redirect to login
      return NextResponse.redirect(new URL(ADMIN_LOGIN_URL, request.url));
    }
  }

  // 5. Logic for the login page (redirects away if already logged in)
  if (pathname === ADMIN_LOGIN_URL) {
    if (isAdmin) {
      // User is already logged in, redirect to admin dashboard
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    // Not logged in, show the login page
    return NextResponse.next();
  }

  // 6. Allow all other requests to pass
  return NextResponse.next();
}

// 7. --- UPDATED MATCHER ---
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. _next/static (static files)
     * 2. _next/image (image optimization files)
     * 3. favicon.ico (favicon file)
     * 4. Public files (images, etc. under /public)
     *
     * This will run the middleware on ALL pages and API routes
     * by default, which is simpler to manage.
     */
    '/((?!_next/static|_next/image|favicon.ico|logo.svg|leaderboard/.*|fonts/.*).*)',
  ],
};