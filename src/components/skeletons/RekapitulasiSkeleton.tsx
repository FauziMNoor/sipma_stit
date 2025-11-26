/**
 * Reusable Rekapitulasi/Stats Skeleton Loader
 * Dapat digunakan untuk: RekapPoin, Rekapitulasi, LaporanStatistik
 */

import { Icon } from '@iconify/react';

interface RekapitulasiSkeletonProps {
  items?: number; // Number of card items (default: 5)
  showSearch?: boolean; // Show search bar
  showChart?: boolean; // Show chart placeholder
}

export default function RekapitulasiSkeleton({
  items = 5,
  showSearch = true,
  showChart = false,
}: RekapitulasiSkeletonProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header Skeleton */}
      <div className="px-6 py-5 bg-primary border-b border-border">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-11 bg-white/10 rounded-xl animate-pulse" />
            <div className="h-6 w-40 bg-white/30 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      {/* Search Skeleton */}
      {showSearch && (
        <div className="px-6 py-4 bg-card border-b border-border">
          <div className="max-w-3xl mx-auto">
            <div className="h-12 bg-input rounded-xl border border-border animate-pulse" />
          </div>
        </div>
      )}

      {/* Chart Skeleton */}
      {showChart && (
        <div className="px-6 py-4 bg-card border-b border-border">
          <div className="max-w-3xl mx-auto">
            <div className="h-64 bg-muted rounded-2xl animate-pulse" />
          </div>
        </div>
      )}

      {/* List Skeleton */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="max-w-3xl mx-auto space-y-4">
          {Array.from({ length: items }).map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl p-4 shadow-sm border border-border"
            >
              {/* Profile row */}
              <div className="flex gap-3 mb-3">
                <div className="size-12 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                </div>
                <div className="text-right space-y-1">
                  <div className="h-8 w-16 bg-muted rounded mx-auto animate-pulse" />
                  <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                </div>
              </div>
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="text-center space-y-1">
                    <div className="h-6 w-12 bg-muted rounded mx-auto animate-pulse" />
                    <div className="h-3 w-16 bg-muted rounded mx-auto animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
