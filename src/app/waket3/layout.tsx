'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Waket3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['waket3']}>
      {children}
    </ProtectedRoute>
  );
}
