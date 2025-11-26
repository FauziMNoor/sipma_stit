'use client';

import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface PoinAktivitas {
  id: string;
  tanggal: string;
  deskripsi_kegiatan: string;
  status: 'pending' | 'approved' | 'rejected';
  kategori: {
    nama: string;
    kategori_utama: string;
    bobot: number;
    jenis: 'positif' | 'negatif';
  };
}

interface DashboardData {
  total_poin: number;
  total_poin_positif: number;
  total_poin_negatif: number;
  status_kelulusan: string;
  progress_percentage: number;
  aktivitas: PoinAktivitas[];
}

interface RiwayatPoinProps {
  userId: string;
}

type FilterType = 'semua' | 'semester' | 'kategori';

export default function RiwayatPoin({ userId }: RiwayatPoinProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [filter, setFilter] = useState<FilterType>('semua');

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/mahasiswa/dashboard/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEmojiByKategori = (kategori: string) => {
    const emojiMap: Record<string, string> = {
      Akademik: '🎓',
      Dakwah: '🕌',
      Sosial: '🤝',
      Adab: '🌿',
      Pelanggaran: '🚫',
    };
    return emojiMap[kategori] || '📌';
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      approved: { label: 'Disetujui', className: 'bg-green-100 text-green-700' },
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700' },
      rejected: { label: 'Ditolak', className: 'bg-red-100 text-red-700' },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('id-ID', { month: 'short' });
    const year = date.getFullYear();
    return { day, month, year };
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-background">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
          <div className="max-w-3xl mx-auto w-full flex items-center justify-between">
            <div className="size-11 rounded bg-muted animate-pulse" />
            <div className="h-5 bg-muted rounded w-32 animate-pulse" />
            <div className="size-11" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
            {/* Summary Card Skeleton */}
            <div className="rounded-3xl p-6 shadow-lg bg-muted animate-pulse">
              <div className="space-y-4">
                <div className="text-center space-y-3">
                  <div className="h-4 bg-background/50 rounded w-24 mx-auto" />
                  <div className="h-12 bg-background/50 rounded w-32 mx-auto" />
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

            {/* Filter Tabs Skeleton */}
            <div className="flex gap-2 p-1 bg-muted rounded-2xl">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1 h-10 bg-background rounded-xl animate-pulse" />
              ))}
            </div>

            {/* Timeline Aktivitas Skeleton */}
            <div>
              <div className="h-5 bg-muted rounded w-40 mb-4 animate-pulse" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center space-y-1">
                      <div className="h-4 bg-muted rounded w-12 animate-pulse" />
                      <div className="h-3 bg-muted rounded w-10 animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
                        <div className="flex items-start gap-3">
                          <div className="size-10 rounded-xl bg-muted animate-pulse" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                            <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                            <div className="h-3 bg-muted rounded w-full animate-pulse" />
                            <div className="flex items-center justify-between mt-2">
                              <div className="h-6 bg-muted rounded w-12 animate-pulse" />
                              <div className="h-6 bg-muted rounded-full w-20 animate-pulse" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Download Button Skeleton */}
            <div className="pb-6">
              <div className="h-14 bg-muted rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <div className="max-w-3xl mx-auto w-full flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center size-11"
        >
          <Icon icon="solar:arrow-left-linear" className="size-6 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold font-heading text-foreground">Riwayat Poin</h1>
        <div className="size-11" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
          {/* Summary Card */}
          <div
            className="rounded-3xl p-6 shadow-lg"
            style={{
              background: 'linear-gradient(to bottom right, #0ea5e9, #0284c7)'
            }}
          >
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-white/90 mb-2">Total Poin</p>
                <h2 className="text-5xl font-bold font-heading text-white">
                  {data?.total_poin || 0}
                </h2>
              </div>
              <div className="bg-white/20 rounded-xl px-4 py-3 text-center">
                <p className="text-sm font-semibold text-white">
                  Status: {data?.status_kelulusan || 'Belum Ada Data'}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-white/90">
                  <span>Progress Kelulusan</span>
                  <span>{data?.progress_percentage || 0}%</span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${data?.progress_percentage || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 p-1 bg-muted rounded-2xl">
            <button
              onClick={() => setFilter('semua')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors ${
                filter === 'semua'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilter('semester')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors ${
                filter === 'semester'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              Per Semester
            </button>
            <button
              onClick={() => setFilter('kategori')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors ${
                filter === 'kategori'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              Per Kategori
            </button>
          </div>

          {/* Timeline Aktivitas */}
          <div>
            <h3 className="text-base font-bold text-foreground mb-4 font-heading">
              Timeline Aktivitas
            </h3>
            <div className="space-y-4">
              {data?.aktivitas && data.aktivitas.length > 0 ? (
                data.aktivitas.map((item, index) => {
                  const { day, month, year } = formatDate(item.tanggal);
                  const statusBadge = getStatusBadge(item.status);
                  const isLast = index === data.aktivitas.length - 1;

                  return (
                    <div key={item.id} className="flex gap-4">
                      {/* Date */}
                      <div className="flex flex-col items-center">
                        <div className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
                          {day} {month}
                        </div>
                        <div className="text-xs text-muted-foreground">{year}</div>
                      </div>

                      {/* Timeline Item */}
                      <div className="flex-1 relative">
                        {!isLast && (
                          <div className="absolute left-0 top-6 bottom-0 w-0.5 bg-border" />
                        )}
                        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border relative">
                          <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 shrink-0">
                              <span className="text-xl">
                                {getEmojiByKategori(item.kategori.kategori_utama)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-foreground mb-1">
                                {item.kategori.nama}
                              </h4>
                              <p className="text-xs text-muted-foreground mb-2">
                                Kategori: {item.kategori.kategori_utama}
                              </p>
                              {item.deskripsi_kegiatan && (
                                <p className="text-xs text-muted-foreground mb-2">
                                  {item.deskripsi_kegiatan}
                                </p>
                              )}
                              <div className="flex items-center justify-between">
                                <span
                                  className={`text-lg font-bold ${
                                    item.kategori.jenis === 'positif'
                                      ? 'text-green-600'
                                      : 'text-red-600'
                                  }`}
                                >
                                  {item.kategori.jenis === 'positif' ? '+' : '-'}
                                  {item.kategori.bobot}
                                </span>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.className}`}
                                >
                                  {statusBadge.label}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <Icon icon="solar:inbox-line-linear" className="size-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Belum ada aktivitas</p>
                </div>
              )}
            </div>
          </div>

          {/* Download Button */}
          <div className="pb-6">
            <button className="w-full py-5 px-6 rounded-2xl font-semibold text-lg shadow-lg bg-secondary text-secondary-foreground flex items-center justify-center gap-3">
              <Icon icon="solar:download-bold" className="size-6" />
              <span>Download Laporan PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

