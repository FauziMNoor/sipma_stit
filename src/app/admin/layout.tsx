'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Not logged in - redirect to login
        console.log('🔒 Admin Layout: No user, redirecting to login');
        window.location.href = '/login';
      } else if (user.role !== 'admin') {
        // Not admin - redirect to regular dashboard
        console.log('🔒 Admin Layout: Not admin, redirecting to dashboard');
        window.location.href = '/dashboard';
      } else {
        console.log('✅ Admin Layout: Admin user authenticated:', user.nama);
      }
    }
  }, [user, isLoading, router]);

  // Show skeleton loader while checking auth
  if (isLoading || !user || user.role !== 'admin') {
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
            {/* Profile Header Skeleton */}
            <div className="rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-4 sm:py-6 shadow-lg bg-muted animate-pulse">
              <div className="flex items-center justify-between gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="size-12 sm:size-14 rounded-full bg-background/50 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 bg-background/50 rounded w-32 animate-pulse" />
                    <div className="h-3 bg-background/50 rounded w-24 animate-pulse" />
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="size-12 sm:size-14 rounded-xl bg-background/50 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 bg-background/50 rounded w-40 animate-pulse" />
                    <div className="h-3 bg-background/50 rounded w-24 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Cards Skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-border">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="size-10 sm:size-11 rounded-xl bg-muted animate-pulse" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="h-3 bg-muted rounded w-20 animate-pulse" />
                      <div className="h-5 bg-muted rounded w-16 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Menu Management Skeleton */}
            <div>
              <div className="h-6 bg-muted rounded w-40 mb-4 animate-pulse" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border border-border">
                    <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                      <div className="size-12 sm:size-16 rounded-xl sm:rounded-2xl bg-muted animate-pulse" />
                      <div className="h-4 bg-muted rounded w-24 mx-auto animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and is admin - render children
  return <>{children}</>;
}

