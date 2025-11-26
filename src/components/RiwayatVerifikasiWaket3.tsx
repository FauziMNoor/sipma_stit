'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

interface RiwayatItem {
  id: string;
  mahasiswa_nama: string;
  mahasiswa_nim: string;
  mahasiswa_foto: string | null;
  deskripsi_kegiatan: string;
  kategori_nama: string;
  kategori_poin: number;
  tanggal: string;
  status: 'approved' | 'rejected';
  verified_at: string;
  notes_verifikator: string | null;
}

interface RiwayatVerifikasiWaket3Props {
  userId: string;
}

export default function RiwayatVerifikasiWaket3({ userId }: RiwayatVerifikasiWaket3Props) {
  const router = useRouter();
  const [riwayatList, setRiwayatList] = useState<RiwayatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchRiwayat();
  }, [userId]);

  const fetchRiwayat = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/waket3/riwayat/${userId}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch riwayat');
      }

      setRiwayatList(result.data);
    } catch (err) {
      console.error('Error fetching riwayat:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredList = riwayatList.filter((item) => {
    // Filter by status
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;

    // Filter by search
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.mahasiswa_nama.toLowerCase().includes(query) ||
      item.mahasiswa_nim.toLowerCase().includes(query) ||
      item.deskripsi_kegiatan.toLowerCase().includes(query)
    );
  });

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-background">
        {/* Header Skeleton */}
        <div className="px-6 py-5 bg-primary">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-1">
              <div className="size-11 rounded-xl bg-white/20 animate-pulse" />
              <div className="h-6 bg-white/20 rounded w-44 animate-pulse" />
              <div className="size-11" />
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-card rounded-2xl p-5 shadow-sm border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-6 bg-muted rounded-full w-24 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-20 animate-pulse" />
                </div>
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-full bg-muted animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-full animate-pulse" />
                    <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <Icon icon="solar:danger-circle-bold" className="size-12 text-destructive mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-6 py-5 bg-primary border-b border-border">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center size-11 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Icon icon="solar:arrow-left-linear" className="size-6 text-white" />
            </button>
            <h1 className="text-xl font-bold text-white font-heading">Riwayat Verifikasi</h1>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="px-6 py-4 bg-card border-b border-border">
        <div className="max-w-3xl mx-auto">
        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-input border border-border text-sm"
            placeholder="Cari mahasiswa atau kegiatan..."
          />
          <Icon
            icon="solar:magnifer-linear"
            className="size-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap ${
              filterStatus === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap ${
              filterStatus === 'approved'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Disetujui
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap ${
              filterStatus === 'rejected'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Ditolak
          </button>
        </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="max-w-3xl mx-auto space-y-4">
        {filteredList.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center">
            <Icon icon="solar:inbox-line-bold" className="size-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'Tidak ada hasil pencarian' : 'Belum ada riwayat verifikasi'}
            </p>
          </div>
        ) : (
          filteredList.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-2xl p-4 shadow-sm border border-border"
            >
              <div className="flex gap-3 mb-3">
                <img
                  alt="Mahasiswa"
                  src={item.mahasiswa_foto || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(item.mahasiswa_nama)}
                  className="size-12 rounded-full border-2 border-primary object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{item.mahasiswa_nama}</p>
                  <p className="text-xs text-muted-foreground">{item.mahasiswa_nim}</p>
                  {item.status === 'approved' ? (
                    <span className="inline-block mt-1 px-2.5 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold">
                      Disetujui
                    </span>
                  ) : (
                    <span className="inline-block mt-1 px-2.5 py-1 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold">
                      Ditolak
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">+{item.kategori_poin}</p>
                  <p className="text-xs text-muted-foreground">Poin</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">{item.deskripsi_kegiatan}</p>
                <p className="text-xs text-muted-foreground">
                  <Icon icon="solar:calendar-bold" className="inline size-3 mr-1" />
                  Diverifikasi: {formatDateTime(item.verified_at)}
                </p>
                {item.notes_verifikator && (
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Catatan:</p>
                    <p className="text-sm text-foreground">{item.notes_verifikator}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        </div>
      </div>
    </div>
  );
}

