/**
 * Reusable Dashboard Skeleton Loader
 * Dapat digunakan untuk: DashboardMahasiswa, DashboardDosenPA, DashboardMusyrif, DashboardWaket3, DashboardAdmin
 */

import { Icon } from '@iconify/react';

interface DashboardSkeletonProps {
  showStats?: boolean; // Show stats cards (4 cards)
  showProfile?: boolean; // Show profile header
  showMenuGrid?: boolean; // Show menu grid
  menuGridItems?: number; // Number of menu items (default: 6)
}

export default function DashboardSkeleton({
  showStats = true,
  showProfile = true,
  showMenuGrid = true,
  menuGridItems = 6,
}: DashboardSkeletonProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header Skeleton */}
      <div className="px-4 sm:px-6 py-5 bg-card border-b border-border">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="h-6 w-40 bg-muted rounded-lg animate-pulse" />
          <div className="size-11 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Profile Header Skeleton */}
          {showProfile && (
            <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-4 sm:py-6 shadow-lg">
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="size-12 sm:size-14 rounded-full bg-white/30 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-white/30 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-white/20 rounded animate-pulse" />
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="size-12 sm:size-14 rounded-xl bg-white/20 animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-3 w-20 bg-white/20 rounded animate-pulse" />
                    <div className="h-2 w-16 bg-white/20 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards Skeleton */}
          {showStats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-border"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="size-10 sm:size-11 rounded-xl bg-muted animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-muted rounded w-20 animate-pulse" />
                      <div className="h-5 bg-muted rounded w-16 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Menu Grid Skeleton */}
          {showMenuGrid && (
            <div>
              <div className="h-5 w-40 bg-muted rounded mb-3 sm:mb-4 animate-pulse" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {Array.from({ length: menuGridItems }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border border-border"
                  >
                    <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                      <div className="size-12 sm:size-16 rounded-xl sm:rounded-2xl bg-muted animate-pulse" />
                      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
