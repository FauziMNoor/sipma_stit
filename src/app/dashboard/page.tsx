'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && user.role === 'admin') {
      // Redirect admin to admin dashboard
      router.push('/admin');
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

  if (!user) {
    return null;
  }

  // Don't render if user is admin (will be redirected)
  if (user.role === 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-neutral-900">SIPMA</h1>
              <p className="text-xs text-neutral-500">Sistem Poin Mahasiswa</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-neutral-900">{user.nama}</p>
                <p className="text-xs text-neutral-500 capitalize">{user.role.replace('_', ' ')}</p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-danger-600 hover:bg-danger-50 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Selamat Datang, {user.nama}! 👋
          </h2>
          <p className="text-neutral-600 mb-4">
            Anda login sebagai <span className="font-semibold capitalize">{user.role.replace('_', ' ')}</span>
          </p>
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <p className="text-sm text-primary-800">
              <strong>Status:</strong> Dashboard sedang dalam pengembangan. Fitur lengkap akan segera tersedia.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

