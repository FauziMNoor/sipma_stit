'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function DosenPALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['dosen_pa']}>
      {children}
    </ProtectedRoute>
  );
}
