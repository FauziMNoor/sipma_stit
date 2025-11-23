'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

interface DashboardData {
  waket3: {
    id: string;
    nama: string;
    nip: string | null;
    email: string;
    foto: string | null;
  };
  stats: {
    total_pengajuan: number;
    diverifikasi: number;
    pending: number;
    ditolak: number;
  };
  recent_activities: Array<{
    id: string;
    mahasiswa_nama: string;
    mahasiswa_nim: string;
    mahasiswa_foto: string | null;
    deskripsi_kegiatan: string;
    kategori_nama: string;
    tanggal: string;
    status: string;
    created_at: string;
  }>;
}

interface DashboardWaket3Props {
  userId: string;
}

export default function DashboardWaket3({ userId }: DashboardWaket3Props) {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/waket3/dashboard/${userId}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch dashboard data');
      }

      setData(result.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <Icon icon="svg-spinners:ring-resize" className="size-12 text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Memuat dashboard...</p>
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
      <div className="px-6 py-5 bg-primary border-b border-primary">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              alt="Wakil Ketua III Profile"
              src={data.waket3.foto || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.waket3.nama)}
              className="size-12 rounded-full border-2 border-accent object-cover"
            />
            <div>
              <p className="text-base font-bold text-white">Dashboard Wakil Ketua III</p>
              <p className="text-xs text-white/80">Verifikasi Kemahasiswaan</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/waket3/profil')}
            className="flex items-center justify-center size-11 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
          >
            <Icon icon="solar:bell-bold" className="size-6 text-accent" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Stats */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4 font-heading">
            Ringkasan Verifikasi
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="flex items-center justify-center size-12 rounded-xl bg-accent/20">
                  <Icon icon="solar:clock-circle-bold" className="size-6 text-accent-foreground" />
                </div>
                <p className="text-2xl font-bold text-foreground">{data.stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending Verifikasi</p>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="flex items-center justify-center size-12 rounded-xl bg-green-500/10">
                  <Icon icon="solar:check-circle-bold" className="size-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-foreground">{data.stats.diverifikasi}</p>
                <p className="text-xs text-muted-foreground">Disetujui</p>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="flex items-center justify-center size-12 rounded-xl bg-destructive/10">
                  <Icon icon="solar:close-circle-bold" className="size-6 text-destructive" />
                </div>
                <p className="text-2xl font-bold text-foreground">{data.stats.ditolak}</p>
                <p className="text-xs text-muted-foreground">Ditolak</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Utama */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4 font-heading">Menu Utama</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => router.push('/waket3/verifikasi')}
              style={{ background: 'linear-gradient(to bottom right, #0ea5e9, #8b5cf6)' }}
              className="rounded-3xl p-5 shadow-lg"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center size-14 rounded-2xl bg-white/20">
                  <Icon icon="solar:clipboard-check-bold" className="size-7 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Verifikasi Kegiatan Kemahasiswaan</p>
                  <p className="text-xs text-white/80 mt-1">Tinjau pengajuan</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => router.push('/waket3/verifikasi')}
              className="bg-card rounded-3xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center size-14 rounded-2xl bg-secondary/10">
                  <Icon icon="solar:hand-heart-bold" className="size-7 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    Kegiatan Sosial & Kepemimpinan
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Tinjau kegiatan</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => router.push('/waket3/rekapitulasi')}
              className="bg-card rounded-3xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center size-14 rounded-2xl bg-accent/20">
                  <Icon icon="solar:chart-bold" className="size-7 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Rekapitulasi Poin</p>
                  <p className="text-xs text-muted-foreground mt-1">Statistik poin</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => router.push('/waket3/riwayat')}
              className="bg-card rounded-3xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center size-14 rounded-2xl bg-primary/10">
                  <Icon icon="solar:history-bold" className="size-7 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Riwayat Verifikasi</p>
                  <p className="text-xs text-muted-foreground mt-1">Lihat riwayat</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="pb-6">
          <h3 className="text-lg font-bold text-foreground mb-4 font-heading">
            Kegiatan Menunggu Verifikasi
          </h3>
          {data.recent_activities.length === 0 ? (
            <div className="bg-card rounded-2xl p-8 text-center">
              <Icon icon="solar:inbox-line-bold" className="size-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Tidak ada pengajuan pending</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recent_activities.map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => router.push(`/waket3/verifikasi/${activity.id}`)}
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
                      src={activity.mahasiswa_foto || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(activity.mahasiswa_nama)}
                      className="size-12 rounded-full border-2 border-border object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {activity.deskripsi_kegiatan}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.mahasiswa_nama} - {activity.mahasiswa_nim}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Icon icon="solar:calendar-bold" className="size-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{formatDate(activity.tanggal)}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

