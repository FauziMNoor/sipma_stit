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

interface RiwayatVerifikasiMusyrifProps {
  userId: string;
}

export default function RiwayatVerifikasiMusyrif({ userId }: RiwayatVerifikasiMusyrifProps) {
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
      const response = await fetch(`/api/musyrif/riwayat/${userId}`, {
        credentials: 'include',
      });
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
      item.deskripsi_kegiatan.toLowerCase().includes(query) ||
      item.kategori_nama.toLowerCase().includes(query)
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
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <Icon icon="svg-spinners:ring-resize" className="size-12 text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Memuat riwayat verifikasi...</p>
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
      <div className="px-4 sm:px-6 py-5 bg-primary border-b border-border">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white mb-4 hover:opacity-80 transition-opacity"
          >
            <Icon icon="solar:arrow-left-linear" className="size-5" />
            <span className="text-sm font-medium">Kembali</span>
          </button>
          <h1 className="text-xl font-bold text-white font-heading">Riwayat Verifikasi</h1>
          <p className="text-sm text-white/80 mt-1">
            Riwayat verifikasi kegiatan Adab yang sudah Anda proses
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="px-4 sm:px-6 py-4 bg-card border-b border-border">
        <div className="max-w-3xl mx-auto">
          <div className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-input border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Cari mahasiswa atau kegiatan..."
            />
            <Icon
              icon="solar:magnifer-linear"
              className="size-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-colors ${
                filterStatus === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-colors ${
                filterStatus === 'approved'
                  ? 'bg-green-500 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Disetujui
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-colors ${
                filterStatus === 'rejected'
                  ? 'bg-red-500 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Ditolak
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 sm:px-6 py-4 bg-muted/30">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-primary">{riwayatList.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Total</p>
          </div>
          <div className="bg-card rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-green-600">
              {riwayatList.filter((r) => r.status === 'approved').length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Disetujui</p>
          </div>
          <div className="bg-card rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-red-600">
              {riwayatList.filter((r) => r.status === 'rejected').length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Ditolak</p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
        <div className="max-w-3xl mx-auto space-y-4 pb-6">
          {filteredList.length === 0 ? (
            <div className="bg-card rounded-2xl p-12 text-center shadow-sm border border-border">
              <Icon icon="solar:inbox-line-bold" className="size-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-base font-semibold text-foreground mb-1">
                {searchQuery ? 'Tidak ada hasil pencarian' : 'Belum ada riwayat verifikasi'}
              </p>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? 'Coba gunakan kata kunci lain'
                  : 'Riwayat akan muncul setelah Anda memverifikasi kegiatan'}
              </p>
            </div>
          ) : (
            filteredList.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-2xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4 mb-4">
                  <img
                    alt="Mahasiswa"
                    src={
                      item.mahasiswa_foto ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(item.mahasiswa_nama)}&background=4f46e5&color=fff`
                    }
                    className="size-14 rounded-full border-2 border-primary object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground mb-0.5">{item.mahasiswa_nama}</p>
                    <p className="text-xs text-muted-foreground mb-2">{item.mahasiswa_nim}</p>
                    {item.status === 'approved' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        <Icon icon="solar:check-circle-bold" className="size-3.5" />
                        Disetujui
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                        <Icon icon="solar:close-circle-bold" className="size-3.5" />
                        Ditolak
                      </span>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold text-primary">
                      {item.status === 'approved' ? '+' : ''}
                      {item.kategori_poin}
                    </p>
                    <p className="text-xs text-muted-foreground">Poin</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-primary/5 rounded-xl p-3">
                    <p className="text-xs font-semibold text-primary mb-1">{item.kategori_nama}</p>
                    <p className="text-sm font-medium text-foreground">{item.deskripsi_kegiatan}</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon icon="solar:calendar-bold" className="size-3.5" />
                    <span>Diverifikasi: {formatDateTime(item.verified_at)}</span>
                  </div>

                  {item.notes_verifikator && (
                    <div className="bg-muted rounded-xl p-3">
                      <p className="text-xs font-semibold text-muted-foreground mb-1.5">Catatan Anda:</p>
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
