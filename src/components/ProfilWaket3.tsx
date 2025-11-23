'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

interface ProfilData {
  id: string;
  nama: string;
  nip: string | null;
  email: string;
  foto: string | null;
  stats: {
    total_verified: number;
    total_approved: number;
    total_rejected: number;
  };
}

interface ProfilWaket3Props {
  userId: string;
}

export default function ProfilWaket3({ userId }: ProfilWaket3Props) {
  const router = useRouter();
  const [data, setData] = useState<ProfilData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/waket3/profile/${userId}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch profile');
      }

      setData(result.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      localStorage.removeItem('token');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <Icon icon="svg-spinners:ring-resize" className="size-12 text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <Icon icon="solar:danger-circle-bold" className="size-12 text-destructive mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">{error || 'Data tidak ditemukan'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-6 py-5 bg-primary border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center size-11 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
            >
              <Icon icon="solar:arrow-left-linear" className="size-6 text-primary-foreground" />
            </button>
            <h1 className="text-xl font-bold text-primary-foreground font-heading">Profil Saya</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="flex flex-col items-center text-center mb-6">
            <img
              alt="Profile"
              src={data.foto || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.nama)}
              className="size-24 rounded-full border-4 border-primary object-cover mb-4"
            />
            <h2 className="text-xl font-bold text-foreground">{data.nama}</h2>
            <p className="text-sm text-muted-foreground mt-1">{data.nip || 'NIP belum diisi'}</p>
            <p className="text-sm text-muted-foreground">{data.email}</p>
            <span className="inline-block mt-3 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              Wakil Ketua III
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{data.stats.total_verified}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Verifikasi</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{data.stats.total_approved}</p>
              <p className="text-xs text-muted-foreground mt-1">Disetujui</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-destructive">{data.stats.total_rejected}</p>
              <p className="text-xs text-muted-foreground mt-1">Ditolak</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="space-y-3">
          <button
            onClick={() => router.push('/waket3/dashboard')}
            className="w-full bg-card rounded-2xl p-4 shadow-sm border border-border hover:border-primary transition-colors flex items-center gap-4"
          >
            <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10">
              <Icon icon="solar:home-2-bold" className="size-6 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-foreground">Dashboard</p>
              <p className="text-xs text-muted-foreground">Kembali ke dashboard</p>
            </div>
            <Icon icon="solar:alt-arrow-right-linear" className="size-5 text-muted-foreground" />
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-card rounded-2xl p-4 shadow-sm border border-destructive/20 hover:border-destructive transition-colors flex items-center gap-4"
          >
            <div className="flex items-center justify-center size-12 rounded-xl bg-destructive/10">
              <Icon icon="solar:logout-2-bold" className="size-6 text-destructive" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-destructive">Keluar</p>
              <p className="text-xs text-muted-foreground">Logout dari aplikasi</p>
            </div>
            <Icon icon="solar:alt-arrow-right-linear" className="size-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}

