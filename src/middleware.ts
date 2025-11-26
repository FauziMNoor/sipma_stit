import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/admin',
  '/aktivitas',
  '/verifikasi',
  '/mahasiswa',
  '/kategori',
  '/leaderboard',
  '/profile',
  '/waket3',
  '/musyrif',
  '/dosen-pa',
];

// Routes that are only accessible when not authenticated
const authRoutes = ['/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Try to get token from cookie first, then from Authorization header (localStorage fallback)
  let token = request.cookies.get('auth-token')?.value;

  if (!token) {
    // Check Authorization header (sent by client with localStorage token)
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing auth route with valid token, redirect based on role
  if (isAuthRoute && token) {
    try {
      const payload = verifyJWT(token);

      // Redirect based on role
      const redirectPath = payload.role === 'admin' ? '/admin' : '/dashboard';
      return NextResponse.redirect(new URL(redirectPath, request.url));
    } catch (error) {
      // Token invalid, allow access to auth route
      return NextResponse.next();
    }
  }

  // If accessing protected route with token, verify and add user info to headers
  if (isProtectedRoute && token) {
    try {
      const payload = verifyJWT(token);
      
      // Add user info to request headers for API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.userId);
      requestHeaders.set('x-user-email', payload.email);
      requestHeaders.set('x-user-role', payload.role);
      requestHeaders.set('x-user-nama', payload.nama);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      // Token invalid, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('auth-token');
      return response;
    }
  }

  return NextResponse.next();
}

// Configure middleware to run on specific routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

