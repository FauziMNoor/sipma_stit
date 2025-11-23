'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

interface PengajuanItem {
  id: string;
  mahasiswa_id: string;
  mahasiswa_nama: string;
  mahasiswa_nim: string;
  mahasiswa_foto: string | null;
  kategori_id: string;
  kategori_nama: string;
  kategori_poin: number;
  deskripsi_kegiatan: string;
  tanggal: string;
  bukti: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface VerifikasiWaket3Props {
  userId: string;
}

export default function VerifikasiWaket3({ userId }: VerifikasiWaket3Props) {
  const router = useRouter();
  const [pengajuanList, setPengajuanList] = useState<PengajuanItem[]>([]);
  const [filteredList, setFilteredList] = useState<PengajuanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchPengajuan();
  }, [userId]);

  useEffect(() => {
    filterPengajuan();
  }, [pengajuanList, searchQuery, activeFilter]);

  const fetchPengajuan = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/waket3/verifikasi');
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch pengajuan');
      }

      setPengajuanList(result.data);
    } catch (err) {
      console.error('Error fetching pengajuan:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filterPengajuan = () => {
    let filtered = pengajuanList;

    // Filter by status
    if (activeFilter !== 'all') {
      filtered = filtered.filter((item) => item.status === activeFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.mahasiswa_nama.toLowerCase().includes(query) ||
          item.mahasiswa_nim.toLowerCase().includes(query) ||
          item.deskripsi_kegiatan.toLowerCase().includes(query)
      );
    }

    setFilteredList(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-block px-2.5 py-1 rounded-lg bg-accent text-accent-foreground text-xs font-semibold">
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="inline-block px-2.5 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold">
            Disetujui
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-block px-2.5 py-1 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold">
            Ditolak
          </span>
        );
      default:
        return null;
    }
  };

  const getCategoryBadge = (kategoriNama: string) => {
    const colors: Record<string, string> = {
      Akademik: 'bg-blue-600/10 text-blue-700',
      Dakwah: 'bg-purple-600/10 text-purple-700',
      Sosial: 'bg-green-600/10 text-green-700',
      Adab: 'bg-amber-600/10 text-amber-700',
      Pelanggaran: 'bg-red-600/10 text-red-700',
    };

    const colorClass = colors[kategoriNama] || 'bg-gray-600/10 text-gray-700';

    return (
      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${colorClass}`}>
        {kategoriNama}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getCountByStatus = (status: 'pending' | 'approved' | 'rejected') => {
    return pengajuanList.filter((item) => item.status === status).length;
  };

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
      <div className="px-6 py-5 bg-primary">
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center size-11"
          >
            <Icon icon="solar:arrow-left-linear" className="size-6 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white font-heading">Verifikasi Kemahasiswaan</h1>
          <div className="size-11" />
        </div>
        <p className="text-sm text-white/80 text-center">
          Wakil Ketua III - Kegiatan Kemahasiswaan
        </p>
      </div>

      {/* Search & Filter */}
      <div className="px-6 py-4 bg-card border-b border-border">
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
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap shadow-sm ${
              activeFilter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Semua
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              activeFilter === 'all' ? 'bg-white/20' : 'bg-accent text-accent-foreground'
            }`}>
              {pengajuanList.length}
            </span>
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap ${
              activeFilter === 'pending'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Pending
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              activeFilter === 'pending' ? 'bg-white/20' : 'bg-accent text-accent-foreground'
            }`}>
              {getCountByStatus('pending')}
            </span>
          </button>
          <button
            onClick={() => setActiveFilter('approved')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap ${
              activeFilter === 'approved'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Disetujui
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              activeFilter === 'approved' ? 'bg-white/20' : 'bg-green-100 text-green-700'
            }`}>
              {getCountByStatus('approved')}
            </span>
          </button>
          <button
            onClick={() => setActiveFilter('rejected')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap ${
              activeFilter === 'rejected'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Ditolak
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              activeFilter === 'rejected' ? 'bg-white/20' : 'bg-destructive/10 text-destructive'
            }`}>
              {getCountByStatus('rejected')}
            </span>
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {filteredList.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center">
            <Icon icon="solar:inbox-line-bold" className="size-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'Tidak ada hasil pencarian' : 'Tidak ada pengajuan'}
            </p>
          </div>
        ) : (
          filteredList.map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(`/waket3/verifikasi/${item.id}`)}
              className="w-full bg-secondary/5 rounded-2xl p-4 shadow-sm border border-secondary/20 hover:border-primary transition-colors text-left"
            >
              <div className="flex gap-3 mb-3">
                <img
                  alt="Mahasiswa"
                  src={item.mahasiswa_foto || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(item.mahasiswa_nama)}
                  className="size-12 rounded-full border-2 border-secondary object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{item.mahasiswa_nama}</p>
                  <p className="text-xs text-muted-foreground">{item.mahasiswa_nim}</p>
                  {getStatusBadge(item.status)}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">+{item.kategori_poin}</p>
                  <p className="text-xs text-muted-foreground">Poin</p>
                </div>
              </div>
              <div className="space-y-2 mb-3">
                <p className="text-sm font-semibold text-foreground">{item.deskripsi_kegiatan}</p>
                <div className="flex items-center gap-2">
                  {getCategoryBadge(item.kategori_nama)}
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{formatDate(item.tanggal)}</span>
                </div>
              </div>
              {item.bukti && (
                <div className="flex items-center gap-3">
                  <img
                    alt="Bukti"
                    src={item.bukti}
                    className="size-20 rounded-xl object-cover border border-border"
                  />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Bukti Kegiatan</p>
                  </div>
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

