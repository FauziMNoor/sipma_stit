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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="text-xs font-medium text-accent-foreground bg-accent/20 px-2 py-1 rounded-lg">
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-lg">
            Disetujui
          </span>
        );
      case 'rejected':
        return (
          <span className="text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-lg">
            Ditolak
          </span>
        );
      default:
        return null;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Baru saja';
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} jam yang lalu`;
    return `${Math.floor(diffInMinutes / 1440)} hari yang lalu`;
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
      <div className="px-6 py-5 bg-card border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              alt="Musyrif Profile"
              src={data.musyrif.foto || 'https://randomuser.me/api/portraits/men/32.jpg'}
              className="size-12 rounded-full border-2 border-primary object-cover"
            />
            <div>
              <p className="text-base font-bold text-foreground">Dashboard Musyrif/LPM</p>
              <p className="text-xs text-muted-foreground">Verifikasi & Monitoring Asrama</p>
            </div>
          </div>
          <button className="flex items-center justify-center size-11 rounded-xl bg-muted">
            <Icon icon="solar:bell-bold" className="size-6 text-accent" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Ringkasan */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4 font-heading">Ringkasan</h3>
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
                  <p className="text-xs text-accent-foreground/80">Approve Adab, Input Pelanggaran</p>
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
                  <p className="text-sm font-semibold text-foreground">Laporan Pelanggaran</p>
                  <p className="text-xs text-muted-foreground">Catat pelanggaran</p>
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
          </div>
        </div>

        {/* Aktivitas Terbaru */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4 font-heading">Aktivitas Terbaru</h3>
          {data.recentActivities.length === 0 ? (
            <div className="bg-card rounded-2xl p-8 shadow-sm border border-border text-center">
              <Icon icon="solar:inbox-line-bold" className="size-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">Belum ada aktivitas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentActivities.map((activity) => (
                <div key={activity.id} className="bg-card rounded-2xl p-4 shadow-sm border border-border">
                  <div className="flex items-start gap-3">
                    <img
                      alt="Student"
                      src={activity.mahasiswa.foto || 'https://randomuser.me/api/portraits/men/67.jpg'}
                      className="size-11 rounded-xl border border-border object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {activity.mahasiswa.nama}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.kategori_poin.nama}
                          </p>
                        </div>
                        {getStatusBadge(activity.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">{getTimeAgo(activity.created_at)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Catatan Penting */}
        <div className="pb-6">
          <div className="bg-linear-to-r from-primary/10 to-secondary/10 rounded-2xl p-5 border border-primary/20">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center size-14 rounded-xl bg-primary/20">
                <Icon icon="solar:info-circle-bold" className="size-7 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Catatan Penting</p>
                <p className="text-xs text-muted-foreground">
                  Verifikasi paling lambat 24 jam setelah pengajuan diterima
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

