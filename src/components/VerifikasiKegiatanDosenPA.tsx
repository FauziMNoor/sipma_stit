'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface PoinAktivitas {
  id: string;
  tanggal: string;
  deskripsi_kegiatan: string;
  bukti: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  mahasiswa: {
    id: string;
    nim: string;
    nama: string;
    foto: string | null;
  };
  kategori: {
    nama: string;
    kategori_utama: string;
    bobot: number;
    jenis: 'positif' | 'negatif';
  };
}

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';

export default function VerifikasiKegiatanDosenPA() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [aktivitasList, setAktivitasList] = useState<PoinAktivitas[]>([]);
  const [filter, setFilter] = useState<FilterStatus>('all');

  useEffect(() => {
    if (user?.id) {
      fetchAktivitas();
    }
  }, [user]);

  const fetchAktivitas = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/dosen-pa/verifikasi/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        setAktivitasList(result.data);
      }
    } catch (error) {
      console.error('Error fetching aktivitas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAktivitas = aktivitasList.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'px-2.5 py-1 rounded-lg bg-accent text-accent-foreground text-xs font-semibold';
      case 'approved':
        return 'px-2.5 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold';
      case 'rejected':
        return 'px-2.5 py-1 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold';
      default:
        return 'px-2.5 py-1 rounded-lg bg-muted text-muted-foreground text-xs font-semibold';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'approved':
        return 'Disetujui';
      case 'rejected':
        return 'Ditolak';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const countByStatus = (status: FilterStatus) => {
    if (status === 'all') return aktivitasList.length;
    return aktivitasList.filter((item) => item.status === status).length;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <Icon icon="svg-spinners:ring-resize" className="size-12 text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Memuat data...</p>
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
              className="flex items-center justify-center size-10 sm:size-11"
            >
              <Icon icon="solar:arrow-left-linear" className="size-5 sm:size-6 text-white" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-white font-heading">Verifikasi Akademik</h1>
            <div className="size-10 sm:size-11" />
          </div>
          <p className="text-xs sm:text-sm text-white/80 text-center">Approve kegiatan akademik mahasiswa</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-card border-b border-border px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap shadow-sm ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Semua
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              filter === 'all' ? 'bg-white/20' : 'bg-primary/10 text-primary'
            }`}>
              {countByStatus('all')}
            </span>
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap ${
              filter === 'pending'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Pending
            <span className="ml-2 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs">
              {countByStatus('pending')}
            </span>
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap ${
              filter === 'approved'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Disetujui
            <span className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">
              {countByStatus('approved')}
            </span>
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap ${
              filter === 'rejected'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Ditolak
            <span className="ml-2 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs">
              {countByStatus('rejected')}
            </span>
          </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
        <div className="max-w-2xl mx-auto space-y-4">
        {filteredAktivitas.length === 0 ? (
          <div className="text-center py-12">
            <Icon icon="solar:document-text-bold" className="size-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Tidak ada pengajuan</p>
          </div>
        ) : (
          filteredAktivitas.map((aktivitas) => (
            <div
              key={aktivitas.id}
              className="bg-secondary/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-secondary/20"
            >
              <div className="flex gap-2 sm:gap-3 mb-3">
                <img
                  alt={aktivitas.mahasiswa.nama}
                  src={
                    aktivitas.mahasiswa.foto ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(aktivitas.mahasiswa.nama)}`
                  }
                  className="size-11 sm:size-12 rounded-full border-2 border-secondary object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-foreground truncate">{aktivitas.mahasiswa.nama}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{aktivitas.mahasiswa.nim}</p>
                  <span className={`inline-block mt-1 ${getStatusBadge(aktivitas.status)}`}>
                    {getStatusLabel(aktivitas.status)}
                  </span>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-base sm:text-lg font-bold ${
                    aktivitas.kategori.jenis === 'positif' ? 'text-primary' : 'text-destructive'
                  }`}>
                    {aktivitas.kategori.jenis === 'positif' ? '+' : '-'}{aktivitas.kategori.bobot}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Poin</p>
                </div>
              </div>
              <div className="space-y-2 mb-3">
                <p className="text-xs sm:text-sm font-semibold text-foreground">
                  {aktivitas.deskripsi_kegiatan}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-primary/10 text-primary text-[10px] sm:text-xs font-semibold">
                    {aktivitas.kategori.nama}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground">{formatDate(aktivitas.tanggal)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                {aktivitas.bukti && (
                  <img
                    alt="Bukti"
                    src={aktivitas.bukti}
                    className="size-16 sm:size-20 rounded-xl object-cover border border-border flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-2">Bukti Kegiatan</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/dosen-pa/verifikasi/${aktivitas.id}`)}
                      className="flex-1 py-2 px-3 rounded-lg sm:rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold"
                    >
                      Lihat Detail
                    </button>
                  </div>
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

