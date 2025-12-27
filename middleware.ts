import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Cookie name used by the app (kept in sync with app/lib/auth.ts)
const AUTH_COOKIE_NAME = 'auth_token';

// Paths that the middleware should NOT block even though they match /api
const PUBLIC_API_PATHS = ['/api/auth/login', '/api/auth/register', '/api/auth/me'];

async function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('Missing JWT_SECRET in environment');

  // jose expects a KeyLike; for HS256 we can use the raw secret bytes
  const key = new TextEncoder().encode(secret);
  const { payload } = await jwtVerify(token, key);
  return payload;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /dashboard and /api/* (matcher also limits where middleware runs)
  const isApi = pathname.startsWith('/api');
  const isDashboard = pathname === '/dashboard' || pathname.startsWith('/dashboard/');

  if (!isApi && !isDashboard) {
    return NextResponse.next();
  }

  // Allow public auth APIs
  if (isApi && PUBLIC_API_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    if (isApi) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      });
    }

    // For page routes redirect to login and preserve return url
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnTo', request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  try {
    await verifyToken(token);
    return NextResponse.next();
  } catch (err) {
    if (isApi) {
      return new NextResponse(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      });
    }

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnTo', request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  // Run middleware for dashboard pages and all API routes
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
