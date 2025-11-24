'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface DashboardStats {
  total_pengajuan: number;
  diverifikasi: number;
  pending: number;
  total_mahasiswa_bimbingan: number;
}

interface DosenData {
  id: string;
  nama: string;
  nip: string;
  foto: string | null;
}

export default function DashboardDosenPA() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [dosenData, setDosenData] = useState<DosenData | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/dosen-pa/dashboard/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        setStats(result.data.stats);
        setDosenData(result.data.dosen);
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

  if (isLoading || !stats || !dosenData) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <Icon icon="svg-spinners:ring-resize" className="size-12 text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-4 sm:px-6 py-5 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                alt="Dosen Profile"
                src={dosenData.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(dosenData.nama)}`}
                className="size-11 sm:size-12 rounded-full border-2 border-primary object-cover"
              />
              <div>
                <p className="text-sm sm:text-base font-bold text-foreground">{dosenData.nama}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Dosen Pembimbing Akademik</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center size-10 sm:size-11 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
            >
              <Icon icon="solar:logout-2-bold" className="size-5 sm:size-6 text-destructive" />
            </button>
          </div>
          <div className="bg-destructive/10 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center justify-center size-9 sm:size-10 rounded-xl bg-destructive/20">
                <Icon icon="solar:clock-circle-bold" className="size-4 sm:size-5 text-destructive" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-foreground">Pengajuan Pending</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Memerlukan verifikasi</p>
              </div>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-destructive">{stats.pending}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Statistics */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-3 sm:mb-4 font-heading">
              Statistik Hari Ini
            </h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-border">
                <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2">
                  <div className="flex items-center justify-center size-10 sm:size-12 rounded-xl bg-primary/10">
                    <Icon icon="solar:document-text-bold" className="size-5 sm:size-6 text-primary" />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.total_pengajuan}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Total Pengajuan</p>
                </div>
              </div>
              <div className="bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-border">
                <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2">
                  <div className="flex items-center justify-center size-10 sm:size-12 rounded-xl bg-green-500/10">
                    <Icon icon="solar:check-circle-bold" className="size-5 sm:size-6 text-green-600" />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.diverifikasi}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Diverifikasi</p>
                </div>
              </div>
              <div className="bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-border">
                <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2">
                  <div className="flex items-center justify-center size-10 sm:size-12 rounded-xl bg-accent/20">
                    <Icon icon="solar:clock-circle-bold" className="size-5 sm:size-6 text-accent-foreground" />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.pending}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Utama */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-3 sm:mb-4 font-heading">Menu Utama</h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/dosen-pa/verifikasi')}
                className="w-full"
              >
                <div
                  className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg"
                  style={{
                    background: 'linear-gradient(to bottom right, #8b5cf6, #0ea5e9)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex items-center justify-center size-12 sm:size-14 rounded-xl sm:rounded-2xl bg-white/20">
                        <Icon icon="solar:clipboard-check-bold" className="size-6 sm:size-7 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm sm:text-base font-bold text-white">Verifikasi Kegiatan</p>
                        <p className="text-[10px] sm:text-xs text-white/80">Verifikasi pengajuan mahasiswa</p>
                      </div>
                    </div>
                    <Icon icon="solar:alt-arrow-right-linear" className="size-5 sm:size-6 text-white" />
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push('/dosen-pa/mahasiswa-bimbingan')}
                className="w-full"
              >
                <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex items-center justify-center size-11 sm:size-12 rounded-xl bg-secondary/10">
                        <Icon icon="solar:users-group-rounded-bold" className="size-5 sm:size-6 text-secondary" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs sm:text-sm font-semibold text-foreground">
                          Daftar Mahasiswa Bimbingan
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">{stats.total_mahasiswa_bimbingan} mahasiswa aktif</p>
                      </div>
                    </div>
                    <Icon
                      icon="solar:alt-arrow-right-linear"
                      className="size-4 sm:size-5 text-muted-foreground"
                    />
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push('/dosen-pa/rekap-poin')}
                className="w-full"
              >
                <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex items-center justify-center size-11 sm:size-12 rounded-xl bg-accent/20">
                        <Icon icon="solar:chart-bold" className="size-5 sm:size-6 text-accent-foreground" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs sm:text-sm font-semibold text-foreground">Rekap Poin Mahasiswa</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Lihat statistik poin mahasiswa</p>
                      </div>
                    </div>
                    <Icon
                      icon="solar:alt-arrow-right-linear"
                      className="size-4 sm:size-5 text-muted-foreground"
                    />
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push('/dosen-pa/riwayat-verifikasi')}
                className="w-full"
              >
                <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex items-center justify-center size-11 sm:size-12 rounded-xl bg-primary/10">
                        <Icon icon="solar:history-bold" className="size-5 sm:size-6 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs sm:text-sm font-semibold text-foreground">Riwayat Verifikasi</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Lihat riwayat verifikasi Anda</p>
                      </div>
                    </div>
                    <Icon
                      icon="solar:alt-arrow-right-linear"
                      className="size-4 sm:size-5 text-muted-foreground"
                    />
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="pb-6">
            <div className="bg-gradient-to-r from-accent/20 to-accent/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-accent/30">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex items-center justify-center size-12 sm:size-14 rounded-xl bg-accent/30">
                  <Icon icon="solar:info-circle-bold" className="size-6 sm:size-7 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-foreground">Tips Verifikasi</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    Pastikan bukti kegiatan sesuai dengan ketentuan sebelum memverifikasi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

