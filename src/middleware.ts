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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Try to get token from cookie
  const token = request.cookies.get('auth-token')?.value;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // If accessing protected route with valid token, add user info to headers
  // This is ONLY for adding headers, NOT for redirecting
  if (isProtectedRoute && token) {
    try {
      const payload = verifyJWT(token);

      // Add user info to request headers for server components/API routes
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
      // Token invalid - just delete cookie and let client-side handle redirect
      // DO NOT redirect from middleware to avoid race conditions
      console.log('🔄 Middleware: Invalid token, clearing cookie');
      const response = NextResponse.next();
      response.cookies.delete('auth-token');
      return response;
    }
  }

  // For all other cases, just pass through
  // Client-side ProtectedRoute will handle auth checks
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

