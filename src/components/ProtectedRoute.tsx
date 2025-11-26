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

  // Show skeleton loader while checking auth
  if (isLoading || !user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return (
      <div className="flex flex-col h-screen bg-background">
        {/* Header Skeleton */}
        <div className="px-4 sm:px-6 py-5 bg-card border-b border-border">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="h-6 bg-muted rounded w-40 animate-pulse" />
            <div className="size-10 sm:size-11 rounded-xl bg-muted animate-pulse" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Content Skeleton */}
            <div className="rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-4 sm:py-6 shadow-lg bg-muted animate-pulse h-32" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-border h-20 animate-pulse" />
              ))}
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border border-border h-24 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and authorized - render children
  return <>{children}</>;
}
