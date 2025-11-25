'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

interface MahasiswaStats {
  mahasiswa_id: string;
  mahasiswa_nama: string;
  mahasiswa_nim: string;
  mahasiswa_prodi: string;
  mahasiswa_foto: string | null;
  total_poin: number;
  total_approved: number;
  total_pending: number;
  total_rejected: number;
}

interface RekapitulasiPoinWaket3Props {
  userId: string;
}

export default function RekapitulasiPoinWaket3({ userId }: RekapitulasiPoinWaket3Props) {
  const router = useRouter();
  const [mahasiswaList, setMahasiswaList] = useState<MahasiswaStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRekapitulasi();
  }, []);

  const fetchRekapitulasi = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/waket3/rekapitulasi');
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch rekapitulasi');
      }

      setMahasiswaList(result.data);
    } catch (err) {
      console.error('Error fetching rekapitulasi:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredList = mahasiswaList.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.mahasiswa_nama.toLowerCase().includes(query) ||
      item.mahasiswa_nim.toLowerCase().includes(query) ||
      item.mahasiswa_prodi.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <Icon icon="svg-spinners:ring-resize" className="size-12 text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Memuat data...</p>
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
              className="flex items-center justify-center size-11 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
            >
              <Icon icon="solar:arrow-left-linear" className="size-6 text-primary-foreground" />
            </button>
            <h1 className="text-xl font-bold text-primary-foreground font-heading">Rekapitulasi Poin</h1>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 py-4 bg-card border-b border-border">
        <div className="max-w-3xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-input border border-border text-sm"
            placeholder="Cari mahasiswa..."
          />
          <Icon
            icon="solar:magnifer-linear"
            className="size-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2"
          />
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
              {searchQuery ? 'Tidak ada hasil pencarian' : 'Tidak ada data'}
            </p>
          </div>
        ) : (
          filteredList.map((item) => (
            <div
              key={item.mahasiswa_id}
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
                  <p className="text-xs text-muted-foreground">{item.mahasiswa_prodi}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{item.total_poin}</p>
                  <p className="text-xs text-muted-foreground">Total Poin</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">{item.total_approved}</p>
                  <p className="text-xs text-muted-foreground">Disetujui</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-accent-foreground">{item.total_pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-destructive">{item.total_rejected}</p>
                  <p className="text-xs text-muted-foreground">Ditolak</p>
                </div>
              </div>
            </div>
          ))
        )}
        </div>
      </div>
    </div>
  );
}

