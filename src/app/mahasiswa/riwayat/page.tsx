'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import RiwayatPoin from '@/components/RiwayatPoin';
import { Icon } from '@iconify/react';

export default function RiwayatPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-background">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
          <div className="max-w-3xl mx-auto w-full flex items-center justify-between">
            <div className="size-11 rounded bg-muted animate-pulse" />
            <div className="h-5 bg-muted rounded w-32 animate-pulse" />
            <div className="size-11" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
            {/* Summary Card Skeleton */}
            <div className="rounded-3xl p-6 shadow-lg bg-muted animate-pulse">
              <div className="space-y-4">
                <div className="text-center space-y-3">
                  <div className="h-4 bg-background/50 rounded w-24 mx-auto" />
                  <div className="h-12 bg-background/50 rounded w-32 mx-auto" />
                </div>
                <div className="bg-background/30 rounded-xl px-4 py-3">
                  <div className="h-4 bg-background/50 rounded w-48 mx-auto" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-3 bg-background/50 rounded w-32" />
                    <div className="h-3 bg-background/50 rounded w-12" />
                  </div>
                  <div className="h-3 bg-background/50 rounded-full" />
                </div>
              </div>
            </div>

            {/* Filter Tabs Skeleton */}
            <div className="flex gap-2 p-1 bg-muted rounded-2xl">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1 h-10 bg-background rounded-xl animate-pulse" />
              ))}
            </div>

            {/* Timeline Aktivitas Skeleton */}
            <div>
              <div className="h-5 bg-muted rounded w-40 mb-4 animate-pulse" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center space-y-1">
                      <div className="h-4 bg-muted rounded w-12 animate-pulse" />
                      <div className="h-3 bg-muted rounded w-10 animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
                        <div className="flex items-start gap-3">
                          <div className="size-10 rounded-xl bg-muted animate-pulse" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                            <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                            <div className="h-3 bg-muted rounded w-full animate-pulse" />
                            <div className="flex items-center justify-between mt-2">
                              <div className="h-6 bg-muted rounded w-12 animate-pulse" />
                              <div className="h-6 bg-muted rounded-full w-20 animate-pulse" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Download Button Skeleton */}
            <div className="pb-6">
              <div className="h-14 bg-muted rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <RiwayatPoin userId={user.id} />;
}

