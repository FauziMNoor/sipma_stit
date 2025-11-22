import { cookies } from 'next/headers';
import { verifyJWT, type JWTPayload } from './auth';

const COOKIE_NAME = 'auth-token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
};

/**
 * Set auth token in cookie
 */
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, COOKIE_OPTIONS);
}

/**
 * Get auth token from cookie or localStorage (fallback for Next.js 16 bug)
 */
export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(COOKIE_NAME)?.value;

  // If no cookie, try to get from request headers (set by middleware from localStorage)
  if (!cookieToken && typeof window !== 'undefined') {
    return localStorage.getItem(COOKIE_NAME) || undefined;
  }

  return cookieToken;
}

/**
 * Remove auth token from cookie
 */
export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Get current user from session
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
  try {
    const token = await getAuthCookie();
    console.log('🍪 Getting auth cookie:', { hasToken: !!token, tokenLength: token?.length });

    if (!token) {
      console.log('❌ No token found in cookie');
      return null;
    }

    const payload = verifyJWT(token);
    console.log('✅ JWT verified:', { userId: payload.userId, role: payload.role });
    return payload;
  } catch (error) {
    console.log('❌ JWT verification failed:', error);
    return null;
  }
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(): Promise<JWTPayload> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

/**
 * Require specific role - throws if user doesn't have required role
 */
export async function requireRole(allowedRoles: string[]): Promise<JWTPayload> {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden: Insufficient permissions');
  }
  return user;
}

