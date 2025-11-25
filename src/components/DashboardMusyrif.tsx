'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

interface MusyrifData {
  id: string;
  nama: string;
  email: string;
  foto: string | null;
}

interface Summary {
  pendingCount: number;
  mahasiswaCount: number;
  approvedThisMonth: number;
}

interface RecentActivity {
  id: string;
  tanggal: string;
  status: 'pending' | 'approved' | 'rejected';
  deskripsi_kegiatan: string | null;
  created_at: string;
  mahasiswa: {
    id: string;
    nim: string;
    nama: string;
    foto: string | null;
  };
  kategori_poin: {
    id: string;
    nama: string;
    jenis: 'positif' | 'negatif';
    bobot: number;
    kategori_utama: string | null;
  };
}

interface DashboardData {
  musyrif: MusyrifData;
  summary: Summary;
  recentActivities: RecentActivity[];
}

export default function DashboardMusyrif() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/musyrif/dashboard', {
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

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Baru saja';
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays === 1) return '1 hari lalu';
    return `${diffDays} hari lalu`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
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

  // Show loading state
  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <Icon icon="svg-spinners:ring-resize" className="size-12 text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-4 sm:px-6 py-5 bg-primary border-b border-border">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                alt="Musyrif Profile"
                src={data.musyrif.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.musyrif.nama)}`}
                className="size-11 sm:size-12 rounded-full border-2 border-white object-cover"
              />
              <div>
                <p className="text-sm sm:text-base font-bold text-white">{data.musyrif.nama}</p>
                <p className="text-[10px] sm:text-xs text-white/80">Musyrif / LPM Asrama</p>
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="flex items-center justify-center size-10 sm:size-11 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Icon icon="solar:settings-bold" className="size-5 sm:size-6 text-white" />
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
                        router.push('/musyrif/profil');
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
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
        {/* Ringkasan */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4 font-heading">Ringkasan Verifikasi</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="flex items-center justify-center size-12 rounded-xl bg-destructive/10">
                  <Icon icon="solar:clock-circle-bold" className="size-6 text-destructive" />
                </div>
                <p className="text-2xl font-bold text-foreground">{data.summary.pendingCount}</p>
                <p className="text-xs text-muted-foreground">Pending Verifikasi</p>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10">
                  <Icon icon="solar:users-group-rounded-bold" className="size-6 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">{data.summary.mahasiswaCount}</p>
                <p className="text-xs text-muted-foreground">Mahasiswa Monitored</p>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="flex items-center justify-center size-12 rounded-xl bg-green-500/10">
                  <Icon icon="solar:check-circle-bold" className="size-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-foreground">{data.summary.approvedThisMonth}</p>
                <p className="text-xs text-muted-foreground">Aktivitas Bulan Ini</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Utama */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4 font-heading">Menu Utama</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => router.push('/musyrif/verifikasi')}
              className="bg-linear-to-br from-accent to-accent/70 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center size-16 rounded-2xl bg-white/30">
                  <Icon icon="solar:star-bold" className="size-8 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-base font-bold text-accent-foreground">
                    Verifikasi Adab
                  </p>
                  <p className="text-xs text-accent-foreground/80">Approve kegiatan adab</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => router.push('/musyrif/kegiatan-asrama')}
              className="bg-linear-to-br from-primary to-secondary rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center size-16 rounded-2xl bg-white/30">
                  <Icon icon="solar:buildings-2-bold" className="size-8 text-white" />
                </div>
                <div>
                  <p className="text-base font-bold text-white">Kegiatan Asrama</p>
                  <p className="text-xs text-white/80">Verifikasi kegiatan</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => router.push('/musyrif/pelanggaran')}
              className="bg-card rounded-2xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center size-14 rounded-xl bg-destructive/10">
                  <Icon icon="solar:danger-triangle-bold" className="size-7 text-destructive" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Input Pelanggaran</p>
                  <p className="text-xs text-muted-foreground">Catat pelanggaran mahasiswa</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => router.push('/musyrif/mahasiswa')}
              className="bg-card rounded-2xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center size-14 rounded-xl bg-secondary/10">
                  <Icon icon="solar:users-group-rounded-bold" className="size-7 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Mahasiswa Asrama</p>
                  <p className="text-xs text-muted-foreground">Data penghuni</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => router.push('/musyrif/riwayat')}
              className="bg-card rounded-2xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center size-14 rounded-xl bg-blue-500/10">
                  <Icon icon="solar:history-bold" className="size-7 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Riwayat Verifikasi</p>
                  <p className="text-xs text-muted-foreground">Lihat riwayat</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => router.push('/musyrif/riwayat-pelanggaran')}
              className="bg-card rounded-2xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center size-14 rounded-xl bg-orange-500/10">
                  <Icon icon="solar:clipboard-list-bold" className="size-7 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Riwayat Pelanggaran</p>
                  <p className="text-xs text-muted-foreground">Monitoring & tracking</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Kegiatan Menunggu Verifikasi */}
        <div className="pb-6">
          <h3 className="text-lg font-bold text-foreground mb-4 font-heading">
            Kegiatan Menunggu Verifikasi
          </h3>
          {data.recentActivities.filter((activity) => activity.status === 'pending').length === 0 ? (
            <div className="bg-card rounded-2xl p-8 text-center">
              <Icon icon="solar:inbox-line-bold" className="size-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Tidak ada pengajuan pending</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentActivities
                .filter((activity) => activity.status === 'pending')
                .map((activity) => {
                  const isPelanggaran = activity.kategori_poin.kategori_utama === 'Pelanggaran';
                  const isAdab = activity.kategori_poin.kategori_utama === 'Adab';
                  
                  // Pelanggaran: tidak clickable, hanya info (approval by Waket3)
                  // Adab: clickable untuk approve/reject by Musyrif
                  if (isPelanggaran) {
                    return (
                      <div
                        key={activity.id}
                        className="w-full bg-card rounded-2xl p-5 shadow-sm border border-orange-200 text-left"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-xs font-semibold text-orange-700">
                            Menunggu Waket3
                          </span>
                          <span className="text-xs text-muted-foreground">{getTimeAgo(activity.created_at)}</span>
                        </div>
                        <div className="flex items-start gap-4">
                          <img
                            alt="Student"
                            src={activity.mahasiswa.foto || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(activity.mahasiswa.nama)}
                            className="size-12 rounded-full border-2 border-border object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon icon="solar:danger-triangle-bold" className="size-4 text-orange-600" />
                              <span className="text-xs font-semibold text-orange-600">Pelanggaran</span>
                            </div>
                            <p className="text-sm font-semibold text-foreground">
                              {activity.deskripsi_kegiatan || activity.kategori_poin.nama}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {activity.mahasiswa.nama} - {activity.mahasiswa.nim}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Icon icon="solar:calendar-bold" className="size-4 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{formatDate(activity.tanggal)}</span>
                            </div>
                            <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                              <Icon icon="solar:info-circle-bold" className="size-3" />
                              Pelanggaran divalidasi oleh Waket3
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  // Adab: clickable untuk approve
                  return (
                    <button
                      key={activity.id}
                      onClick={() => router.push(`/musyrif/verifikasi/${activity.id}`)}
                      className="w-full bg-card rounded-2xl p-5 shadow-sm border border-border hover:border-primary transition-colors text-left"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/20 text-xs font-semibold text-accent-foreground">
                          Pending
                        </span>
                        <span className="text-xs text-muted-foreground">{getTimeAgo(activity.created_at)}</span>
                      </div>
                      <div className="flex items-start gap-4">
                        <img
                          alt="Student"
                          src={activity.mahasiswa.foto || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(activity.mahasiswa.nama)}
                          className="size-12 rounded-full border-2 border-border object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon icon="solar:star-bold" className="size-4 text-accent-foreground" />
                            <span className="text-xs font-semibold text-accent-foreground">Adab</span>
                          </div>
                          <p className="text-sm font-semibold text-foreground">
                            {activity.deskripsi_kegiatan || activity.kategori_poin.nama}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {activity.mahasiswa.nama} - {activity.mahasiswa.nim}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Icon icon="solar:calendar-bold" className="size-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{formatDate(activity.tanggal)}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

