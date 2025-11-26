'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function MusyrifLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['musyrif']}>
      {children}
    </ProtectedRoute>
  );
}
