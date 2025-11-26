/**
 * Reusable List/Table Skeleton Loader
 * Dapat digunakan untuk: KelolaMahasiswa, KelolaPengguna, KelolaKegiatan, dll
 */

import { Icon } from '@iconify/react';

interface ListSkeletonProps {
  items?: number; // Number of list items (default: 5)
  showSearch?: boolean; // Show search bar
  showTabs?: boolean; // Show filter tabs
  tabsCount?: number; // Number of tabs (default: 4)
}

export default function ListSkeleton({
  items = 5,
  showSearch = true,
  showTabs = false,
  tabsCount = 4,
}: ListSkeletonProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header Skeleton */}
      <div className="px-4 sm:px-6 py-5 bg-primary">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-1">
            <div className="size-11 bg-white/10 rounded-xl animate-pulse" />
            <div className="h-5 w-32 bg-white/30 rounded-lg animate-pulse" />
            <div className="size-11 bg-white/10 rounded-xl animate-pulse" />
          </div>
          <div className="h-3 w-48 bg-white/20 rounded mx-auto mt-2 animate-pulse" />
        </div>
      </div>

      {/* Search Bar Skeleton */}
      {showSearch && (
        <div className="bg-card border-b border-border px-4 sm:px-6 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="h-12 bg-input rounded-xl border border-border animate-pulse" />
          </div>
        </div>
      )}

      {/* Tabs Skeleton */}
      {showTabs && (
        <div className="bg-card border-b border-border px-4 sm:px-6 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2 overflow-x-auto">
              {Array.from({ length: tabsCount }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-24 bg-muted rounded-xl animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* List Items Skeleton */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
        <div className="max-w-3xl mx-auto space-y-4">
          {Array.from({ length: items }).map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-border"
            >
              <div className="flex gap-3">
                <div className="size-12 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                  <div className="flex gap-2 mt-2">
                    <div className="h-6 w-16 bg-muted rounded-lg animate-pulse" />
                    <div className="h-6 w-16 bg-muted rounded-lg animate-pulse" />
                  </div>
                </div>
                <div className="size-8 bg-muted rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
