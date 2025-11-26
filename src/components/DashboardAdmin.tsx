'use client';

import { Icon } from "@iconify/react";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface DashboardStats {
  totalMahasiswa: number;
  totalKegiatan: number;
  pendingVerifikasi: number;
  totalPoin: number;
}

export function DashboardAdmin() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalMahasiswa: 0,
    totalKegiatan: 0,
    pendingVerifikasi: 0,
    totalPoin: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [tahunAjaranAktif, setTahunAjaranAktif] = useState('2024/2025');
  const [semesterAktif, setSemesterAktif] = useState<'ganjil' | 'genap'>('ganjil');

  useEffect(() => {
    fetchStats();
    fetchTahunAjaran();
  }, []);

  const fetchTahunAjaran = async () => {
    try {
      const response = await fetch('/api/settings?category=general');
      const result = await response.json();
      if (result.success && result.data) {
        const tahunAjaran = result.data.find((s: any) => s.setting_key === 'tahun_ajaran_aktif');
        const semester = result.data.find((s: any) => s.setting_key === 'semester_aktif');
        if (tahunAjaran) setTahunAjaranAktif(tahunAjaran.setting_value);
        if (semester) setSemesterAktif(semester.setting_value);
      }
    } catch (error) {
      console.error('Error fetching tahun ajaran:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
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
      <div className="px-4 sm:px-6 py-5 bg-card border-b border-border">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-bold text-foreground font-heading">Admin Dashboard</h1>
          <div className="relative">
            <button
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className="flex items-center justify-center size-10 sm:size-11 rounded-xl bg-muted hover:bg-primary/10 transition-colors"
            >
              <Icon icon="solar:settings-bold" className="size-5 sm:size-6 text-primary" />
            </button>
            
            {showSettingsMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowSettingsMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-lg border border-border z-50 overflow-hidden">
                  <button
                    onClick={() => {
                      setShowSettingsMenu(false);
                      router.push('/admin/profil');
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-3"
                  >
                    <Icon icon="solar:user-bold" className="size-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">Profil Saya</span>
                  </button>
                  <div className="border-t border-border" />
                  <button
                    onClick={() => {
                      setShowSettingsMenu(false);
                      handleLogout();
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-3"
                  >
                    <Icon icon="solar:logout-2-bold" className="size-5 text-destructive" />
                    <span className="text-sm font-medium text-destructive">Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Admin Profile Header */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-4 sm:py-6 shadow-lg">
          <div className="flex items-center justify-between gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
            {/* Admin Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="size-12 sm:size-14 rounded-full border-2 border-white overflow-hidden bg-white">
                <img
                  src={user?.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nama || 'Admin')}&background=0059a8&color=fff`}
                  alt={user?.nama || 'Admin'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-white font-bold text-sm sm:text-base">{user?.nama || 'Administrator'}</p>
                <p className="text-white/80 text-xs sm:text-sm">
                  {user?.role === 'admin' ? 'Administrator' : user?.role === 'dosen_pa' ? 'Dosen PA' : 'Sistem Poin Mahasiswa'}
                </p>
              </div>
            </div>
            
            {/* School Info with Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Logo Kampus */}
              <div className="flex items-center justify-center size-12 sm:size-14 rounded-xl bg-white/20 backdrop-blur-sm p-2">
                <img 
                  src="/logo.png" 
                  alt="Logo STIT" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-xs sm:text-sm">STIT Riyadhussholihiin</p>
                <p className="text-white/80 text-[10px] sm:text-xs">TA {tahunAjaranAktif} - {semesterAktif === 'ganjil' ? 'Ganjil' : 'Genap'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-border animate-pulse">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="size-10 sm:size-11 rounded-xl bg-muted"></div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-3 bg-muted rounded w-20"></div>
                    <div className="h-5 bg-muted rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-border">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center justify-center size-10 sm:size-11 rounded-xl bg-primary/10">
                  <Icon icon="solar:users-group-two-rounded-bold" className="size-4 sm:size-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Total Mahasiswa</p>
                  <p className="text-base sm:text-lg font-bold text-foreground font-heading">
                    {stats.totalMahasiswa.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-border">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center justify-center size-10 sm:size-11 rounded-xl bg-secondary/10">
                  <Icon icon="solar:calendar-bold" className="size-4 sm:size-5 text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Total Kegiatan</p>
                  <p className="text-base sm:text-lg font-bold text-foreground font-heading">
                    {stats.totalKegiatan.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-border">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center justify-center size-10 sm:size-11 rounded-xl bg-accent/20">
                  <Icon icon="solar:clock-circle-bold" className="size-4 sm:size-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Pengajuan Pending</p>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <p className="text-base sm:text-lg font-bold text-foreground font-heading">
                      {stats.pendingVerifikasi.toLocaleString('id-ID')}
                    </p>
                    {stats.pendingVerifikasi > 0 && (
                      <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold rounded-full bg-accent text-accent-foreground">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-border">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center justify-center size-10 sm:size-11 rounded-xl bg-chart-2/10">
                  <Icon icon="solar:medal-star-bold" className="size-4 sm:size-5 text-chart-2" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Total Poin</p>
                  <p className="text-base sm:text-lg font-bold text-foreground font-heading">
                    {stats.totalPoin.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-foreground mb-3 sm:mb-4 font-heading">Menu Manajemen</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <button
              onClick={() => router.push('/admin/kelola-mahasiswa')}
              className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border border-border hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className="flex items-center justify-center size-12 sm:size-16 rounded-xl sm:rounded-2xl bg-primary/10">
                  <Icon icon="solar:users-group-rounded-bold" className="size-6 sm:size-8 text-primary" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-foreground">Kelola Mahasiswa</p>
              </div>
            </button>
            <button
              onClick={() => router.push('/admin/kelola-kegiatan')}
              className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border border-border hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className="flex items-center justify-center size-12 sm:size-16 rounded-xl sm:rounded-2xl bg-secondary/10">
                  <Icon icon="solar:clipboard-list-bold" className="size-6 sm:size-8 text-secondary" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-foreground">Kelola Kegiatan</p>
              </div>
            </button>
            <button
              onClick={() => router.push('/admin/verifikasi-pengajuan')}
              className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border border-border hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className="flex items-center justify-center size-12 sm:size-16 rounded-xl sm:rounded-2xl bg-accent/20">
                  <Icon icon="solar:check-circle-bold" className="size-6 sm:size-8 text-accent" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-foreground">Verifikasi Semua</p>
              </div>
            </button>
            <button
              onClick={() => router.push('/admin/laporan-statistik')}
              className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border border-border hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className="flex items-center justify-center size-12 sm:size-16 rounded-xl sm:rounded-2xl bg-chart-2/10">
                  <Icon icon="solar:chart-bold" className="size-6 sm:size-8 text-chart-2" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-foreground">Laporan & Statistik</p>
              </div>
            </button>
            <button
              onClick={() => router.push('/admin/kelola-pengguna')}
              className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border border-border hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className="flex items-center justify-center size-12 sm:size-16 rounded-xl sm:rounded-2xl bg-chart-4/10">
                  <Icon icon="solar:user-id-bold" className="size-6 sm:size-8 text-chart-4" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-foreground">Kelola Pengguna</p>
              </div>
            </button>
            <button onClick={() => router.push('/admin/pengaturan-sistem')} className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border border-border hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className="flex items-center justify-center size-12 sm:size-16 rounded-xl sm:rounded-2xl bg-muted">
                  <Icon icon="solar:settings-bold" className="size-6 sm:size-8 text-primary" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-foreground">Pengaturan Sistem</p>
              </div>
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

