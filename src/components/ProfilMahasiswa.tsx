'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface MahasiswaProfile {
  mahasiswa: {
    id: string;
    nim: string;
    nama: string;
    prodi: string;
    angkatan: number;
    foto: string | null;
  };
  total_poin: number;
  total_poin_positif: number;
  total_poin_negatif: number;
  status_kelulusan: string;
}

export default function ProfilMahasiswa() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mahasiswa, setMahasiswa] = useState<MahasiswaProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/mahasiswa/dashboard/${user?.id}`);
      const result = await response.json();

      if (result.success) {
        setMahasiswa(result.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      await logout();
      router.push('/login');
    }
  };

  const getStatusColor = (status: string) => {
    if (status?.toLowerCase().includes('layak lulus') || status?.toLowerCase().includes('aktif')) {
      return 'bg-green-500/10 border-green-500/20 text-green-700';
    } else if (status?.toLowerCase().includes('cukup')) {
      return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700';
    } else {
      return 'bg-red-500/10 border-red-500/20 text-red-700';
    }
  };

  const getStatusLabel = (status: string) => {
    return status || 'Belum Memenuhi Syarat';
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <div className="flex-1 overflow-y-auto pb-24">
          {/* Profile Header Skeleton */}
          <div className="bg-card px-6 pt-8 pb-6 border-b border-border">
            <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-4">
              <div className="size-28 rounded-full bg-muted animate-pulse" />
              <div className="space-y-2 w-full">
                <div className="h-6 bg-muted rounded-lg w-48 mx-auto animate-pulse" />
                <div className="h-4 bg-muted rounded w-32 mx-auto animate-pulse" />
              </div>
              <div className="h-8 bg-muted rounded-full w-40 animate-pulse" />
            </div>
          </div>

          {/* Total Poin Card Skeleton */}
          <div className="px-6 py-6 space-y-6">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="rounded-3xl p-6 shadow-lg bg-muted animate-pulse">
                <div className="text-center space-y-3">
                  <div className="h-4 bg-background/50 rounded w-32 mx-auto" />
                  <div className="h-12 bg-background/50 rounded w-24 mx-auto" />
                  <div className="h-3 bg-background/50 rounded w-16 mx-auto" />
                </div>
              </div>

              {/* Menu Items Skeleton */}
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-card rounded-2xl p-4 border border-border flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-xl bg-muted animate-pulse" />
                      <div className="h-5 bg-muted rounded w-32 animate-pulse" />
                    </div>
                    <div className="size-5 rounded bg-muted animate-pulse" />
                  </div>
                ))}

                {/* Poin per Kategori Skeleton */}
                <div className="bg-card rounded-2xl p-4 border border-border">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="size-12 rounded-xl bg-muted animate-pulse" />
                    <div className="h-5 bg-muted rounded w-40 animate-pulse" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex flex-col items-center space-y-2 p-2">
                        <div className="size-12 rounded-xl bg-muted animate-pulse" />
                        <div className="h-3 bg-muted rounded w-16 animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
          <div className="max-w-3xl mx-auto flex items-center justify-around py-3 px-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                <div className="size-6 rounded bg-muted animate-pulse" />
                <div className="h-3 bg-muted rounded w-12 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Profile Header */}
        <div className="bg-card px-6 pt-8 pb-6 border-b border-border">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-4">
            <img
              alt="Student Profile"
              src={mahasiswa?.mahasiswa?.foto || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(mahasiswa?.mahasiswa?.nama || 'User')}
              className="size-28 rounded-full border-4 border-primary shadow-lg object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-foreground font-heading">{mahasiswa?.mahasiswa?.nama}</h1>
              <p className="text-sm text-muted-foreground mt-1">NIM: {mahasiswa?.mahasiswa?.nim}</p>
            </div>
            <div className={`inline-flex items-center px-4 py-2 rounded-full border ${getStatusColor(mahasiswa?.status_kelulusan || '')}`}>
              <span className="size-2 rounded-full bg-green-500 mr-2" />
              <span className="text-sm font-semibold">
                {getStatusLabel(mahasiswa?.status_kelulusan || '')}
              </span>
            </div>
          </div>
        </div>

        {/* Total Poin Card */}
        <div className="px-6 py-6 space-y-6">
          <div className="max-w-3xl mx-auto space-y-6">
          <div
            className="rounded-3xl p-6 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #0059a8 0%, #009ee3 100%)' }}
          >
            <div className="text-center space-y-2">
              <p className="text-sm text-white/90">Total Poin Terkumpul</p>
              <h2 className="text-5xl font-bold text-white font-heading">
                {mahasiswa?.total_poin || 0}
              </h2>
              <p className="text-xs text-white/80 mt-1">Poin</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-3">
            {/* Edit Profil */}
            <button
              onClick={() => router.push('/mahasiswa/profil/edit')}
              className="bg-card rounded-2xl p-4 border border-border flex items-center justify-between w-full hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10">
                  <Icon icon="solar:user-bold" className="size-6 text-primary" />
                </div>
                <span className="text-base font-semibold text-foreground">Edit Profil</span>
              </div>
              <Icon icon="solar:arrow-right-linear" className="size-5 text-muted-foreground" />
            </button>

            {/* Riwayat Kegiatan */}
            <button
              onClick={() => router.push('/mahasiswa/riwayat')}
              className="bg-card rounded-2xl p-4 border border-border flex items-center justify-between w-full hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center size-12 rounded-xl bg-secondary/10">
                  <Icon icon="solar:history-bold" className="size-6 text-secondary" />
                </div>
                <span className="text-base font-semibold text-foreground">Riwayat Kegiatan</span>
              </div>
              <Icon icon="solar:arrow-right-linear" className="size-5 text-muted-foreground" />
            </button>

            {/* Poin per Kategori */}
            <div className="bg-card rounded-2xl p-4 border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center size-12 rounded-xl bg-accent/10">
                    <Icon icon="solar:chart-bold" className="size-6 text-accent-foreground" />
                  </div>
                  <span className="text-base font-semibold text-foreground">Poin per Kategori</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => router.push('/mahasiswa/poin/akademik')}
                  className="flex flex-col items-center space-y-2 p-2 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <span className="text-xs text-muted-foreground text-center">Akademik</span>
                </button>
                <button
                  onClick={() => router.push('/mahasiswa/poin/dakwah')}
                  className="flex flex-col items-center space-y-2 p-2 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-center size-12 rounded-xl bg-secondary/10">
                    <span className="text-2xl">🕌</span>
                  </div>
                  <span className="text-xs text-muted-foreground text-center">Dakwah</span>
                </button>
                <button
                  onClick={() => router.push('/mahasiswa/poin/sosial')}
                  className="flex flex-col items-center space-y-2 p-2 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-center size-12 rounded-xl bg-chart-2/10">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <span className="text-xs text-muted-foreground text-center">Sosial</span>
                </button>
                <button
                  onClick={() => router.push('/mahasiswa/poin/adab')}
                  className="flex flex-col items-center space-y-2 p-2 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-center size-12 rounded-xl bg-green-500/10">
                    <span className="text-2xl">🌿</span>
                  </div>
                  <span className="text-xs text-muted-foreground text-center">Adab</span>
                </button>
                <button
                  onClick={() => router.push('/mahasiswa/poin/pelanggaran')}
                  className="flex flex-col items-center space-y-2 p-2 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-center size-12 rounded-xl bg-destructive/10">
                    <span className="text-2xl">🚫</span>
                  </div>
                  <span className="text-xs text-muted-foreground text-center">Pelanggaran</span>
                </button>
              </div>
            </div>

            {/* Kebijakan Kampus - Coming Soon */}
            <div className="bg-card rounded-2xl p-4 border border-border flex items-center justify-between opacity-50">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center size-12 rounded-xl bg-muted">
                  <Icon icon="solar:document-bold" className="size-6 text-foreground" />
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">Kebijakan Kampus</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Lihat PDF</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">Coming Soon</span>
            </div>
          </div>

          {/* Logout Button */}
          <div className="pb-8">
            <button
              onClick={handleLogout}
              className="w-full py-4 px-6 rounded-2xl font-semibold bg-destructive text-white flex items-center justify-center gap-3 hover:bg-destructive/90 transition-colors"
            >
              <Icon icon="solar:logout-2-bold" className="size-6" />
              <span>Keluar dari Akun</span>
            </button>
          </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-3xl mx-auto flex items-center justify-around py-3 px-6">
          <button
            onClick={() => router.push('/mahasiswa/dashboard')}
            className="flex flex-col items-center gap-1.5 flex-1"
          >
            <Icon icon="solar:home-2-bold" className="size-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Home</span>
          </button>
          <button
            onClick={() => router.push('/mahasiswa/kegiatan')}
            className="flex flex-col items-center gap-1.5 flex-1"
          >
            <Icon icon="solar:calendar-bold" className="size-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Kegiatan</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 flex-1">
            <Icon icon="solar:user-bold" className="size-6 text-primary" />
            <span className="text-xs text-primary font-semibold">Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
}

