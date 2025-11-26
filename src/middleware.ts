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
  const { pathname, searchParams } = request.nextUrl;

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

  // Skip middleware check if this is a client-side navigation (has referer from same origin)
  const referer = request.headers.get('referer');
  const isClientNavigation = referer && new URL(referer).origin === new URL(request.url).origin;

  // If accessing protected route without token
  if (isProtectedRoute && !token) {
    // Check if this is a post-login navigation (has _auth query param)
    const authBypass = searchParams.get('_auth');
    if (authBypass === '1') {
      console.log('🔄 Middleware: Post-login navigation detected, bypassing auth check once');
      // Remove the query param and let the request through
      const url = request.nextUrl.clone();
      url.searchParams.delete('_auth');
      return NextResponse.rewrite(url);
    }

    // Redirect to login
    console.log('🔒 Middleware: No token found for protected route, redirecting to login');
    console.log('   Path:', pathname);
    console.log('   Has cookie:', !!request.cookies.get('auth-token'));
    console.log('   Referer:', referer || 'none');
    
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing auth route with valid token, let client-side handle redirect
  // Don't redirect here to avoid race condition with cookie setting
  if (isAuthRoute && token) {
    // Just verify token is valid, but don't redirect
    // Client-side useEffect in login page will handle the redirect
    return NextResponse.next();
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

