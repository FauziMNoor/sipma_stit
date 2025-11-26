'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  fallbackPath?: string;
}

/**
 * Client-side route protection component
 * CRITICAL: This is the primary auth check since middleware bypasses client-side navigation
 * due to cookie persistence issues in Vercel Edge Runtime
 */
export function ProtectedRoute({
  children,
  allowedRoles,
  fallbackPath = '/login'
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    console.log('🔍 ProtectedRoute check:', { isLoading, hasUser: !!user, userRole: user?.role, allowedRoles });

    if (!isLoading) {
      if (!user) {
        // Not logged in - redirect to login
        console.log('🔒 ProtectedRoute: No user, redirecting to login');
        window.location.href = fallbackPath;
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Not authorized - redirect to dashboard
        console.log('🔒 ProtectedRoute: User not authorized, role:', user.role, 'required:', allowedRoles);
        window.location.href = '/dashboard';
      } else {
        console.log('✅ ProtectedRoute: User authorized:', { role: user.role, nama: user.nama });
      }
    }
  }, [user, isLoading, allowedRoles, fallbackPath]);

  // Show loading state while checking auth
  if (isLoading) {
    console.log('⏳ ProtectedRoute: Loading...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Render children if authorized
  return <>{children}</>;
}
