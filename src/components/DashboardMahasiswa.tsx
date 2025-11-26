'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface Mahasiswa {
  id: string;
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
  semester: number;
  foto: string | null;
}

interface PoinSummary {
  total_poin: number;
  total_poin_positif: number;
  total_poin_negatif: number;
  total_akademik: number;
  total_dakwah: number;
  total_sosial: number;
  total_adab: number;
  total_pelanggaran: number;
}

interface StatusKelulusan {
  kategori: string;
  status: string;
  warna: string;
  progress: number;
}

interface DashboardData {
  mahasiswa: Mahasiswa;
  total_poin: number;
  total_poin_positif: number;
  total_poin_negatif: number;
  total_akademik: number;
  total_dakwah: number;
  total_sosial: number;
  total_adab: number;
  total_pelanggaran: number;
  status_kelulusan: string;
  progress_percentage: number;
  aktivitas: any[];
  pending_count: number;
}

export default function DashboardMahasiswa() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData(user.id);
    }
  }, [user]);

  const fetchDashboardData = async (mahasiswaId: string) => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/mahasiswa/dashboard/${mahasiswaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        console.error('Error fetching dashboard data:', result.error);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm('Apakah Anda yakin ingin logout?')) return;

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        localStorage.removeItem('auth-token');
        router.push('/login');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="flex flex-col h-full bg-background">
        {/* Header Skeleton */}
        <div className="px-6 py-5 bg-card border-b border-border">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-full bg-muted animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-32 animate-pulse" />
                <div className="h-3 bg-muted rounded w-24 animate-pulse" />
              </div>
            </div>
            <div className="size-11 rounded-xl bg-muted animate-pulse" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="overflow-y-auto space-y-6 p-6 pb-24">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Poin Card Skeleton */}
            <div className="rounded-3xl p-6 shadow-lg bg-muted animate-pulse">
              <div className="space-y-4">
                <div className="text-center space-y-3">
                  <div className="h-4 bg-background/50 rounded w-32 mx-auto" />
                  <div className="h-12 bg-background/50 rounded w-40 mx-auto" />
                </div>
                <div className="bg-background/30 rounded-xl px-4 py-3">
                  <div className="h-4 bg-background/50 rounded w-48 mx-auto" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-3 bg-background/50 rounded w-32" />
                    <div className="h-3 bg-background/50 rounded w-12" />
                  </div>
                  <div className="h-3 bg-background/50 rounded-full" />
                </div>
              </div>
            </div>

            {/* Kategori Poin Skeleton */}
            <div>
              <div className="h-6 bg-muted rounded w-40 mb-4 animate-pulse" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-card rounded-2xl p-5 shadow-sm border border-border">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="size-14 rounded-2xl bg-muted animate-pulse" />
                      <div className="space-y-2 w-full">
                        <div className="h-4 bg-muted rounded w-24 mx-auto animate-pulse" />
                        <div className="h-3 bg-muted rounded w-16 mx-auto animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Button Skeleton */}
            <div className="pb-6">
              <div className="h-14 bg-muted rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>

        {/* Bottom Navigation Skeleton */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-3">
          <div className="max-w-3xl mx-auto flex items-center justify-around">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1 py-2 px-4">
                <div className="size-6 rounded bg-muted animate-pulse" />
                <div className="h-3 bg-muted rounded w-12 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { mahasiswa } = data;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-6 py-5 bg-card border-b border-border">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              alt="Profile"
              src={mahasiswa.foto || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(mahasiswa.nama)}
              className="size-11 rounded-full border-2 border-primary object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-foreground">{mahasiswa.nama}</p>
              <p className="text-xs text-muted-foreground">NIM: {mahasiswa.nim}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center size-11 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          >
            <Icon icon="solar:logout-2-bold" className="size-6 text-destructive" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto space-y-6 p-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-6">
        {/* Poin Card */}
        <div
          style={{ background: 'linear-gradient(135deg, #0059A8 0%, #009EE3 100%)' }}
          className="rounded-3xl p-6 shadow-lg"
        >
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-white/90 mb-2">Total Poin Anda</p>
              <h2 className="text-5xl font-bold text-white font-heading">
                {data.total_poin.toLocaleString('id-ID')} Poin
              </h2>
            </div>
            <div className="bg-white/20 rounded-xl px-4 py-3 text-center">
              <p className="text-sm font-semibold text-white">Status: {data.status_kelulusan}</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-white/90">
                <span>Progress Kelulusan</span>
                <span>{data.progress_percentage}%</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  style={{ width: `${data.progress_percentage}%` }}
                  className="h-full bg-accent rounded-full transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Kategori Poin */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4 font-heading">Kategori Poin</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/mahasiswa/poin/akademik')}
              className="bg-card rounded-2xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center size-14 rounded-2xl bg-primary/10">
                  <span className="text-3xl">🎓</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Akademik</p>
                  <p className="text-xs text-primary font-bold mt-1">
                    {data.total_akademik} poin
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push('/mahasiswa/poin/dakwah')}
              className="bg-card rounded-2xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center size-14 rounded-2xl bg-secondary/10">
                  <span className="text-3xl">🕌</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Dakwah & Keagamaan</p>
                  <p className="text-xs text-secondary font-bold mt-1">
                    {data.total_dakwah} poin
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push('/mahasiswa/poin/sosial')}
              className="bg-card rounded-2xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center size-14 rounded-2xl bg-chart-2/10">
                  <span className="text-3xl">🤝</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Sosial & Kepemimpinan</p>
                  <p className="text-xs text-chart-2 font-bold mt-1">
                    {data.total_sosial} poin
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push('/mahasiswa/poin/adab')}
              className="bg-card rounded-2xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center size-14 rounded-2xl bg-green-500/10">
                  <span className="text-3xl">🌿</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Adab & Akhlak</p>
                  <p className="text-xs text-green-600 font-bold mt-1">
                    {data.total_adab} poin
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push('/mahasiswa/poin/pelanggaran')}
              className="bg-card rounded-2xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center size-14 rounded-2xl bg-destructive/10">
                  <span className="text-3xl">🚫</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Pelanggaran</p>
                  <p className="text-xs text-destructive font-bold mt-1">
                    {data.total_pelanggaran} poin
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push('/mahasiswa/riwayat')}
              className="bg-card rounded-2xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center size-14 rounded-2xl bg-muted">
                  <span className="text-3xl">📜</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Riwayat Poin</p>
                  <p className="text-xs text-muted-foreground font-bold mt-1">
                    Lihat semua
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Input Kegiatan Button */}
        <div className="pb-6">
          <button
            onClick={() => router.push('/mahasiswa/input-kegiatan')}
            className="w-full py-5 px-6 rounded-2xl font-semibold text-lg shadow-lg bg-accent text-accent-foreground flex items-center justify-center gap-3 hover:bg-accent/90 transition-colors"
          >
            <Icon icon="solar:camera-bold" className="size-6" />
            <span>+ Input Kegiatan</span>
          </button>
        </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-around">
          <button className="flex flex-col items-center gap-1 py-2 px-4">
            <Icon icon="solar:home-2-bold" className="size-6 text-accent" />
            <span className="text-xs font-semibold text-accent">Home</span>
          </button>
          <button
            onClick={() => router.push('/mahasiswa/kegiatan')}
            className="flex flex-col items-center gap-1 py-2 px-4"
          >
            <Icon icon="solar:calendar-bold" className="size-6 text-primary" />
            <span className="text-xs font-medium text-primary">Kegiatan</span>
          </button>
          <button
            onClick={() => router.push('/mahasiswa/profil')}
            className="flex flex-col items-center gap-1 py-2 px-4"
          >
            <Icon icon="solar:user-bold" className="size-6 text-primary" />
            <span className="text-xs font-medium text-primary">Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
}

