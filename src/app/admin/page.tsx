'use client';

import { useAuth } from '@/hooks/useAuth';
import { DashboardAdmin } from '@/components/DashboardAdmin';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Not logged in - redirect to login
        console.log('❌ No user, redirecting to login');
        window.location.href = '/login';
      } else if (user.role !== 'admin') {
        // Not admin - redirect to regular dashboard
        console.log('❌ Not admin, redirecting to dashboard');
        window.location.href = '/dashboard';
      } else {
        console.log('✅ Admin user authenticated:', user.nama);
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-600">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-600">Mengalihkan...</p>
        </div>
      </div>
    );
  }

  return <DashboardAdmin />;
}

