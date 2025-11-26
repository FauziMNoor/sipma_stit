'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

interface Mahasiswa {
  id: string;
  nim: string;
  nama: string;
  foto: string | null;
}

interface KategoriPoin {
  id: string;
  kode: string;
  nama: string;
  jenis: 'positif' | 'negatif';
  bobot: number;
  kategori_utama: string | null;
}

interface Pelanggaran {
  id: string;
  mahasiswa: Mahasiswa;
  kategori: KategoriPoin;
  tanggal: string;
  status: 'pending' | 'approved' | 'rejected';
  bukti: string | null;
  deskripsi_kegiatan: string | null;
  notes_verifikator: string | null;
  verified_at: string | null;
  verifikator_id: string | null;
  created_at: string;
}

interface Counts {
  all: number;
  pending: number;
  approved: number;
  rejected: number;
}

export default function RiwayatPelanggaranMusyrif() {
  const router = useRouter();
  const [pelanggaran, setPelanggaran] = useState<Pelanggaran[]>([]);
  const [counts, setCounts] = useState<Counts>({ all: 0, pending: 0, approved: 0, rejected: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedPelanggaran, setSelectedPelanggaran] = useState<Pelanggaran | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchPelanggaran();
  }, [statusFilter]);

  const fetchPelanggaran = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('status', statusFilter);

      const response = await fetch(`/api/musyrif/riwayat-pelanggaran?${params.toString()}`, {
        credentials: 'include',
      });
      const result = await response.json();

      if (result.success) {
        setPelanggaran(result.data);
        setCounts(result.counts);
      } else {
        console.error('Error fetching pelanggaran:', result.error);
      }
    } catch (error) {
      console.error('Error fetching pelanggaran:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
            <Icon icon="solar:clock-circle-bold" className="size-4 mr-1.5" />
            Menunggu Waket3
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
            <Icon icon="solar:check-circle-bold" className="size-4 mr-1.5" />
            Disetujui
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
            <Icon icon="solar:close-circle-bold" className="size-4 mr-1.5" />
            Ditolak
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
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

  const handleViewDetail = (item: Pelanggaran) => {
    setSelectedPelanggaran(item);
    setShowDetailModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-background">
        {/* Header Skeleton */}
        <div className="px-4 sm:px-6 py-5 bg-primary border-b border-border">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-1">
              <div className="size-11 rounded-xl bg-white/20 animate-pulse" />
              <div className="h-6 bg-white/20 rounded w-48 animate-pulse" />
              <div className="size-11" />
            </div>
          </div>
        </div>

        {/* Filter Tabs Skeleton */}
        <div className="px-4 sm:px-6 py-4 bg-card border-b border-border">
          <div className="max-w-3xl mx-auto flex gap-2 overflow-x-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-muted rounded-xl w-32 flex-shrink-0 animate-pulse" />
            ))}
          </div>
        </div>

        {/* List Skeleton */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
          <div className="max-w-3xl mx-auto space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-2xl p-4 shadow-sm border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-8 bg-muted rounded-full w-32 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-24 animate-pulse" />
                </div>
                <div className="flex gap-3">
                  <div className="size-12 rounded-full bg-muted animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                    <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
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
      <div className="px-4 sm:px-6 py-5 bg-primary border-b border-border">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white mb-4 hover:opacity-80 transition-opacity"
          >
            <Icon icon="solar:arrow-left-linear" className="size-5" />
            <span className="text-sm font-medium">Kembali</span>
          </button>
          <h1 className="text-xl font-bold text-white font-heading">Riwayat Pelanggaran</h1>
          <p className="text-sm text-white/80 mt-1">
            Monitoring pelanggaran yang sudah di-input (approval by Waket3)
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Filter Tabs */}
          <div className="bg-card rounded-2xl p-2 shadow-sm border border-border">
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                Semua
                <span className="ml-1.5 text-xs opacity-80">({counts.all})</span>
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  statusFilter === 'pending'
                    ? 'bg-orange-500 text-white'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                Pending
                <span className="ml-1.5 text-xs opacity-80">({counts.pending})</span>
              </button>
              <button
                onClick={() => setStatusFilter('approved')}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  statusFilter === 'approved'
                    ? 'bg-green-500 text-white'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                Disetujui
                <span className="ml-1.5 text-xs opacity-80">({counts.approved})</span>
              </button>
              <button
                onClick={() => setStatusFilter('rejected')}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  statusFilter === 'rejected'
                    ? 'bg-red-500 text-white'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                Ditolak
                <span className="ml-1.5 text-xs opacity-80">({counts.rejected})</span>
              </button>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Icon icon="solar:info-circle-bold" className="size-5 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-orange-900">Halaman Monitoring</p>
                <p className="text-xs text-orange-700 mt-0.5">
                  Ini adalah halaman untuk monitoring pelanggaran. Approval dilakukan oleh Waket3.
                </p>
              </div>
            </div>
          </div>

          {/* List Pelanggaran */}
          {pelanggaran.length === 0 ? (
            <div className="bg-card rounded-2xl p-12 text-center shadow-sm border border-border">
              <Icon icon="solar:inbox-line-bold" className="size-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-base font-semibold text-foreground mb-1">Tidak ada data</p>
              <p className="text-sm text-muted-foreground">
                {statusFilter === 'all'
                  ? 'Belum ada pelanggaran yang tercatat'
                  : `Tidak ada pelanggaran dengan status ${statusFilter}`}
              </p>
            </div>
          ) : (
            <div className="space-y-3 pb-6">
              {pelanggaran.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleViewDetail(item)}
                  className="w-full bg-card rounded-2xl p-5 shadow-sm border border-border hover:border-orange-300 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center justify-between mb-3">
                    {getStatusBadge(item.status)}
                    <span className="text-xs text-muted-foreground">{getTimeAgo(item.created_at)}</span>
                  </div>

                  <div className="flex items-start gap-4">
                    <img
                      alt="Mahasiswa"
                      src={
                        item.mahasiswa.foto ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(item.mahasiswa.nama)}&background=ef4444&color=fff`
                      }
                      className="size-12 rounded-full border-2 border-red-200 object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1">
                        <Icon icon="solar:danger-triangle-bold" className="size-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-semibold text-foreground line-clamp-2">
                          {item.kategori.nama}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {item.mahasiswa.nama} - {item.mahasiswa.nim}
                      </p>
                      {item.deskripsi_kegiatan && (
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {item.deskripsi_kegiatan}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Icon icon="solar:calendar-bold" className="size-3.5" />
                          <span>{formatDate(item.tanggal)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Icon icon="solar:graph-down-bold" className="size-3.5 text-red-600" />
                          <span className="font-semibold text-red-600">{item.kategori.bobot} poin</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedPelanggaran && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowDetailModal(false)}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-card rounded-3xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground">Detail Pelanggaran</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="size-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                >
                  <Icon icon="solar:close-linear" className="size-5 text-foreground" />
                </button>
              </div>

              {/* Status */}
              <div className="mb-6 pb-6 border-b border-border">
                {getStatusBadge(selectedPelanggaran.status)}
                {selectedPelanggaran.status === 'pending' && (
                  <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                    <Icon icon="solar:clock-circle-bold" className="size-3.5" />
                    Menunggu approval dari Wakil Ketua III
                  </p>
                )}
              </div>

              {/* Mahasiswa Info */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-muted-foreground mb-3">Mahasiswa</p>
                <div className="flex items-center gap-3">
                  <img
                    alt="Mahasiswa"
                    src={
                      selectedPelanggaran.mahasiswa.foto ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedPelanggaran.mahasiswa.nama)}&background=ef4444&color=fff`
                    }
                    className="size-12 rounded-xl border-2 border-red-200 object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{selectedPelanggaran.mahasiswa.nama}</p>
                    <p className="text-xs text-muted-foreground">NIM: {selectedPelanggaran.mahasiswa.nim}</p>
                  </div>
                </div>
              </div>

              {/* Kategori */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Kategori Pelanggaran</p>
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon icon="solar:danger-triangle-bold" className="size-4 text-red-600" />
                    <p className="text-sm font-semibold text-red-900">{selectedPelanggaran.kategori.nama}</p>
                  </div>
                  <p className="text-xs text-red-700">
                    Poin: {selectedPelanggaran.kategori.bobot} | Kode: {selectedPelanggaran.kategori.kode}
                  </p>
                </div>
              </div>

              {/* Deskripsi */}
              {selectedPelanggaran.deskripsi_kegiatan && (
                <div className="mb-6">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Keterangan</p>
                  <p className="text-sm text-foreground bg-muted rounded-xl p-3">
                    {selectedPelanggaran.deskripsi_kegiatan}
                  </p>
                </div>
              )}

              {/* Tanggal */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Tanggal Pelanggaran</p>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Icon icon="solar:calendar-bold" className="size-4 text-primary" />
                  {formatDate(selectedPelanggaran.tanggal)}
                </div>
              </div>

              {/* Bukti */}
              {selectedPelanggaran.bukti && (
                <div className="mb-6">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Bukti</p>
                  <img
                    src={selectedPelanggaran.bukti}
                    alt="Bukti"
                    className="w-full rounded-xl border border-border"
                  />
                </div>
              )}

              {/* Notes Verifikator (jika sudah di-approve/reject) */}
              {selectedPelanggaran.notes_verifikator && (
                <div className="mb-6">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Catatan Waket3</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <p className="text-sm text-blue-900">{selectedPelanggaran.notes_verifikator}</p>
                  </div>
                </div>
              )}

              {/* Verified At */}
              {selectedPelanggaran.verified_at && (
                <div className="text-xs text-muted-foreground">
                  <Icon icon="solar:check-circle-bold" className="size-3.5 inline mr-1" />
                  Diverifikasi pada {formatDate(selectedPelanggaran.verified_at)}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
