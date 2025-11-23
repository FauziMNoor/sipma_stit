'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect based on role
      if (user.role === 'admin' || user.role === 'staff') {
        router.push('/admin');
      } else if (user.role === 'dosen_pa') {
        router.push('/dosen-pa/dashboard');
      } else if (user.role === 'waket3') {
        router.push('/waket3/dashboard');
      } else if (user.role === 'mahasiswa') {
        router.push('/mahasiswa/dashboard');
      } else {
        // For other unknown roles, redirect to login
        router.push('/login');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-600">Memuat...</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-neutral-600">Mengalihkan ke dashboard...</p>
      </div>
    </div>
  );
}

