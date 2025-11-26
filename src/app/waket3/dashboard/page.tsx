'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Icon } from '@iconify/react';
import DashboardWaket3 from '@/components/DashboardWaket3';

export default function Waket3DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (!isLoading && user && user.role !== 'waket3') {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Show loading or redirect - let component handle its own loading
  if (isLoading || !user || user.role !== 'waket3') {
    return (
      <div className="flex flex-col h-screen bg-background">
        {/* Header Skeleton */}
        <div className="px-4 sm:px-6 py-5 bg-primary border-b border-border">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-11 sm:size-12 rounded-full bg-white/20 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-white/20 rounded w-32 animate-pulse" />
                  <div className="h-3 bg-white/20 rounded w-24 animate-pulse" />
                </div>
              </div>
              <div className="size-10 sm:size-11 rounded-xl bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Stats Skeleton */}
            <div>
              <div className="h-6 bg-muted rounded w-48 mb-4 animate-pulse" />
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-card rounded-2xl p-4 shadow-sm border border-border">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="size-12 rounded-xl bg-muted animate-pulse" />
                      <div className="h-6 bg-muted rounded w-12 mx-auto animate-pulse" />
                      <div className="h-3 bg-muted rounded w-20 mx-auto animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Menu Utama Skeleton */}
            <div>
              <div className="h-6 bg-muted rounded w-32 mb-4 animate-pulse" />
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-card rounded-3xl p-5 shadow-sm border border-border">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="size-14 rounded-2xl bg-muted animate-pulse" />
                      <div className="space-y-2 w-full">
                        <div className="h-4 bg-muted rounded w-32 mx-auto animate-pulse" />
                        <div className="h-3 bg-muted rounded w-24 mx-auto animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities Skeleton */}
            <div className="pb-6">
              <div className="h-6 bg-muted rounded w-56 mb-4 animate-pulse" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-card rounded-2xl p-5 shadow-sm border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-6 bg-muted rounded-full w-20 animate-pulse" />
                      <div className="h-3 bg-muted rounded w-16 animate-pulse" />
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="size-12 rounded-full bg-muted animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-full animate-pulse" />
                        <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                        <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                      </div>
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

  return <DashboardWaket3 userId={user.id} />;
}

