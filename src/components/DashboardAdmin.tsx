'use client';

import { Icon } from "@iconify/react";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface DashboardStats {
  totalMahasiswa: number;
  totalKegiatan: number;
  pendingVerifikasi: number;
  totalPoin: number;
}

export function DashboardAdmin() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalMahasiswa: 0,
    totalKegiatan: 0,
    pendingVerifikasi: 0,
    totalPoin: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/dashboard/stats', {
        credentials: 'include',
      });
      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      } else {
        console.error('Error fetching stats:', result.error);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
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
        // Clear localStorage
        localStorage.removeItem('auth-token');
        // Redirect to login
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Gagal logout. Silakan coba lagi.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="px-6 py-5 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground font-heading">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center size-11 rounded-xl bg-muted hover:bg-destructive/10 transition-colors"
            title="Logout"
          >
            <Icon icon="solar:logout-2-bold" className="size-6 text-destructive" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Statistics Cards */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-2xl p-4 shadow-sm border border-border animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-xl bg-muted"></div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-3 bg-muted rounded w-20"></div>
                    <div className="h-5 bg-muted rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-11 rounded-xl bg-primary/10">
                  <Icon icon="solar:users-group-two-rounded-bold" className="size-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Total Mahasiswa</p>
                  <p className="text-lg font-bold text-foreground font-heading">
                    {stats.totalMahasiswa.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-11 rounded-xl bg-secondary/10">
                  <Icon icon="solar:calendar-bold" className="size-5 text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Total Kegiatan</p>
                  <p className="text-lg font-bold text-foreground font-heading">
                    {stats.totalKegiatan.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-11 rounded-xl bg-accent/20">
                  <Icon icon="solar:clock-circle-bold" className="size-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Pengajuan Pending</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-foreground font-heading">
                      {stats.pendingVerifikasi.toLocaleString('id-ID')}
                    </p>
                    {stats.pendingVerifikasi > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-accent text-accent-foreground">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-11 rounded-xl bg-chart-2/10">
                  <Icon icon="solar:medal-star-bold" className="size-5 text-chart-2" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Total Poin</p>
                  <p className="text-lg font-bold text-foreground font-heading">
                    {stats.totalPoin.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4 font-heading">Menu Manajemen</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/admin/kelola-mahasiswa')}
              className="bg-card rounded-2xl p-6 shadow-md border border-border hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center size-16 rounded-2xl bg-primary/10">
                  <Icon icon="solar:users-group-rounded-bold" className="size-8 text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground">Kelola Mahasiswa</p>
              </div>
            </button>
            <button
              onClick={() => router.push('/admin/kelola-kegiatan')}
              className="bg-card rounded-2xl p-6 shadow-md border border-border hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center size-16 rounded-2xl bg-secondary/10">
                  <Icon icon="solar:clipboard-list-bold" className="size-8 text-secondary" />
                </div>
                <p className="text-sm font-semibold text-foreground">Kelola Kegiatan</p>
              </div>
            </button>
            <button
              onClick={() => router.push('/admin/verifikasi-pengajuan')}
              className="bg-card rounded-2xl p-6 shadow-md border border-border hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center size-16 rounded-2xl bg-accent/20">
                  <Icon icon="solar:check-circle-bold" className="size-8 text-accent" />
                </div>
                <p className="text-sm font-semibold text-foreground">Verifikasi Semua</p>
              </div>
            </button>
            <button
              onClick={() => router.push('/admin/laporan-statistik')}
              className="bg-card rounded-2xl p-6 shadow-md border border-border hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center size-16 rounded-2xl bg-chart-2/10">
                  <Icon icon="solar:chart-bold" className="size-8 text-chart-2" />
                </div>
                <p className="text-sm font-semibold text-foreground">Laporan & Statistik</p>
              </div>
            </button>
            <button
              onClick={() => router.push('/admin/kelola-pengguna')}
              className="bg-card rounded-2xl p-6 shadow-md border border-border hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center size-16 rounded-2xl bg-chart-4/10">
                  <Icon icon="solar:user-id-bold" className="size-8 text-chart-4" />
                </div>
                <p className="text-sm font-semibold text-foreground">Kelola Pengguna</p>
              </div>
            </button>
            <button onClick={() => router.push('/admin/pengaturan-sistem')} className="bg-card rounded-2xl p-6 shadow-md border border-border hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center size-16 rounded-2xl bg-muted">
                  <Icon icon="solar:settings-bold" className="size-8 text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground">Pengaturan Sistem</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

