'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface Mahasiswa {
  id: string;
  nim: string;
  nama: string;
  foto: string | null;
}

interface Kategori {
  id: string;
  kode: string;
  nama: string;
  bobot: number;
  jenis: string;
  kategori_utama: string;
}

interface RiwayatItem {
  id: string;
  tanggal: string;
  deskripsi_kegiatan: string;
  bukti: string | null;
  status: string;
  notes_verifikator: string | null;
  created_at: string;
  updated_at: string;
  mahasiswa: Mahasiswa | null;
  kategori: Kategori | null;
}

export default function RiwayatVerifikasiDosenPA() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [riwayatList, setRiwayatList] = useState<RiwayatItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'rejected'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchRiwayat();
    }
  }, [user, statusFilter, startDate, endDate]);

  const fetchRiwayat = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth-token');
      
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(
        `/api/dosen-pa/riwayat-verifikasi/${user?.id}?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log('📊 Riwayat Verifikasi Data:', result.data);
        console.log('📊 Sample Item:', result.data?.[0]);
        setRiwayatList(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching riwayat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    if (status === 'approved') {
      return (
        <span className="px-3 py-1 rounded-lg bg-green-500/10 text-green-600 text-xs font-semibold">
          Disetujui
        </span>
      );
    } else if (status === 'rejected') {
      return (
        <span className="px-3 py-1 rounded-lg bg-red-500/10 text-red-600 text-xs font-semibold">
          Ditolak
        </span>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-background">
        {/* Header Skeleton */}
        <div className="px-4 sm:px-6 py-5 bg-primary">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-1">
              <div className="size-10 sm:size-11 rounded-xl bg-white/20 animate-pulse" />
              <div className="space-y-2 flex-1 mx-4">
                <div className="h-5 bg-white/20 rounded w-48 mx-auto animate-pulse" />
                <div className="h-3 bg-white/20 rounded w-40 mx-auto animate-pulse" />
              </div>
              <div className="size-10 sm:size-11" />
            </div>
          </div>
        </div>

        {/* Filter Tabs Skeleton */}
        <div className="px-4 sm:px-6 py-3 bg-background border-b border-border">
          <div className="max-w-2xl mx-auto flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-muted rounded-lg flex-1 animate-pulse" />
            ))}
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          <div className="max-w-2xl mx-auto space-y-4">
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

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-4 sm:px-6 py-5 bg-primary">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-1">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center size-10 sm:size-11 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Icon icon="solar:arrow-left-linear" className="size-5 sm:size-6 text-white" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-white font-heading">Riwayat Verifikasi</h1>
            <div className="size-10 sm:size-11" />
          </div>
          <p className="text-xs sm:text-sm text-white/80 text-center">Riwayat kegiatan yang sudah diverifikasi</p>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 sm:px-6 py-4 bg-card border-b border-border">
        <div className="max-w-2xl mx-auto space-y-3">
          {/* Date Range */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-input border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Tanggal Akhir
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-input border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Status Verifikasi
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setStatusFilter('approved')}
                className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  statusFilter === 'approved'
                    ? 'bg-green-500 text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Disetujui
              </button>
              <button
                onClick={() => setStatusFilter('rejected')}
                className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  statusFilter === 'rejected'
                    ? 'bg-red-500 text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Ditolak
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 sm:px-6 py-4 bg-muted/30">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Total Riwayat</p>
            <p className="text-2xl font-bold text-foreground">{riwayatList.length}</p>
          </div>
        </div>
      </div>

      {/* Riwayat List */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto space-y-3">
          {riwayatList.length === 0 ? (
            <div className="text-center py-12">
              <Icon icon="solar:history-bold" className="size-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Belum ada riwayat verifikasi</p>
            </div>
          ) : (
            riwayatList.map((item) => (
              <div key={item.id} className="bg-card rounded-xl p-4 border border-border shadow-sm">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        item.mahasiswa?.foto ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          item.mahasiswa?.nama || 'Unknown'
                        )}`
                      }
                      alt={item.mahasiswa?.nama || 'Unknown'}
                      className="size-12 rounded-xl border-2 border-border object-cover"
                    />
                    <div>
                      <p className="text-sm font-bold text-foreground">{item.mahasiswa?.nama}</p>
                      <p className="text-xs text-muted-foreground">{item.mahasiswa?.nim}</p>
                    </div>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                {/* Kegiatan Info */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-start gap-2">
                    <Icon icon="solar:calendar-bold" className="size-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Tanggal Kegiatan</p>
                      <p className="text-sm font-medium text-foreground">{formatDate(item.tanggal)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Icon icon="solar:tag-bold" className="size-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Kategori</p>
                      <p className="text-sm font-medium text-foreground">
                        {item.kategori?.kategori_utama || '-'} - {item.kategori?.nama || '-'}
                      </p>
                      <p className={`text-xs font-semibold ${item.kategori?.jenis === 'negatif' ? 'text-red-600' : 'text-blue-600'}`}>
                        {item.kategori?.jenis === 'negatif' ? '-' : '+'}{item.kategori?.bobot || 0} Poin
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Icon icon="solar:document-text-bold" className="size-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Deskripsi</p>
                      <p className="text-sm text-foreground">{item.deskripsi_kegiatan}</p>
                    </div>
                  </div>

                  {item.notes_verifikator && (
                    <div className="flex items-start gap-2">
                      <Icon icon="solar:notes-bold" className="size-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Catatan Verifikator</p>
                        <p className="text-sm text-foreground italic">{item.notes_verifikator}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Diverifikasi: {formatDate(item.updated_at)} • {formatTime(item.updated_at)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
