import { NextResponse } from 'next/server';
import { serialize } from 'cookie';
import * as jose from 'jose';

// Define the name of our cookie
const COOKIE_NAME = 'admin_token';
const MAX_AGE_SECONDS = 60 * 60 * 24; // 1 day in seconds

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // 1. Get secrets from environment variables
    const adminUser = process.env.ADMIN_USERNAME;
    const adminPass = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminUser || !adminPass || !jwtSecret) {
      console.error("Missing admin credentials or JWT secret in .env.local");
      return NextResponse.json({ success: false, error: "Server configuration error." }, { status: 500 });
    }

    // 2. Validate credentials
    if (username !== adminUser || password !== adminPass) {
      return NextResponse.json({ success: false, error: "Invalid username or password" }, { status: 401 });
    }

    // 3. Credentials are valid. Create a secure token (JWT).
    const secretKey = new TextEncoder().encode(jwtSecret);
    const token = await new jose.SignJWT({ isAdmin: true, user: username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d') // 1 day expiration
      .sign(secretKey);

    // 4. Set the token in a secure, httpOnly cookie
    const cookie = serialize(COOKIE_NAME, token, {
      httpOnly: true, // Prevents client-side JS from reading the cookie
      secure: process.env.NODE_ENV === 'production', // Use 'secure' in production
      maxAge: MAX_AGE_SECONDS,
      path: '/', // Available for all paths
      sameSite: 'lax', // Protects against CSRF
    });

    return NextResponse.json(
      { success: true },
      { headers: { 'Set-Cookie': cookie } }
    );

  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ success: false, error: "An internal server error occurred." }, { status: 500 });
  }
}