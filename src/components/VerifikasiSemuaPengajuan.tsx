'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

interface Mahasiswa {
  id: string;
  nim: string;
  nama: string;
  foto: string | null;
  prodi: string;
  semester: number;
}

interface KategoriPoin {
  id: string;
  kode: string;
  nama: string;
  kategori_utama: string;
  bobot: number;
  jenis: 'positif' | 'negatif';
}

interface PengajuanItem {
  id: string;
  mahasiswa_id: string;
  kategori_poin_id: string;
  tanggal_aktivitas: string;
  deskripsi: string | null;
  bukti_foto: string | null;
  status: 'pending' | 'approved' | 'rejected';
  notes_verifikator: string | null;
  created_at: string;
  mahasiswa: Mahasiswa;
  kategori_poin: KategoriPoin;
}

interface Counts {
  all: number;
  pending: number;
  approved: number;
  rejected: number;
}

export default function VerifikasiSemuaPengajuan() {
  const router = useRouter();
  const [pengajuan, setPengajuan] = useState<PengajuanItem[]>([]);
  const [counts, setCounts] = useState<Counts>({ all: 0, pending: 0, approved: 0, rejected: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [kategoriFilter, setKategoriFilter] = useState('all');
  const [prodiFilter, setProdiFilter] = useState('all');
  const [showFilterModal, setShowFilterModal] = useState(false);

  useEffect(() => {
    fetchPengajuan();
  }, [statusFilter, kategoriFilter, prodiFilter]);

  const fetchPengajuan = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('status', statusFilter);
      if (kategoriFilter !== 'all') params.append('kategori', kategoriFilter);
      if (prodiFilter !== 'all') params.append('prodi', prodiFilter);

      const response = await fetch(`/api/verifikasi/pengajuan?${params.toString()}`, {
        credentials: 'include',
      });
      const result = await response.json();

      if (result.success) {
        setPengajuan(result.data);
        setCounts(result.counts);
      } else {
        console.error('Error fetching pengajuan:', result.error);
      }
    } catch (error) {
      console.error('Error fetching pengajuan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifikasi = async (id: string, status: 'approved' | 'rejected', notes?: string) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/verifikasi/pengajuan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, status, notes }),
      });

      const result = await response.json();

      if (result.success) {
        alert(status === 'approved' ? 'Pengajuan disetujui!' : 'Pengajuan ditolak!');
        fetchPengajuan(); // Refresh data
      } else {
        alert('Gagal memverifikasi: ' + result.error);
      }
    } catch (error) {
      console.error('Error verifying:', error);
      alert('Terjadi kesalahan saat memverifikasi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-accent text-accent-foreground';
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
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

  const getKategoriColor = (kategori: string) => {
    const colors: Record<string, string> = {
      Akademik: 'bg-primary/10 text-primary',
      Dakwah: 'bg-green-600/10 text-green-700',
      Sosial: 'bg-orange-500/10 text-orange-600',
      Adab: 'bg-purple-600/10 text-purple-700',
      Pelanggaran: 'bg-destructive/10 text-destructive',
    };
    return colors[kategori] || 'bg-secondary/20 text-secondary';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="px-6 py-5 bg-primary">
          <div className="flex items-center justify-between mb-1">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center size-11"
              type="button"
            >
              <Icon icon="solar:arrow-left-linear" className="size-6 text-white" />
            </button>
            <h1 className="text-lg font-bold text-white font-heading">Verifikasi Semua Pengajuan</h1>
            <div className="size-11"></div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Icon icon="svg-spinners:ring-resize" className="size-12 text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-4 sm:px-6 py-5 bg-primary">
        <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center size-10 sm:size-11"
            type="button"
          >
            <Icon icon="solar:arrow-left-linear" className="size-5 sm:size-6 text-white" />
          </button>
          <h1 className="text-base sm:text-lg font-bold text-white font-heading">Verifikasi Semua Pengajuan</h1>
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center justify-center size-10 sm:size-11"
            type="button"
          >
            <Icon icon="solar:filter-bold" className="size-5 sm:size-6 text-white" />
          </button>
        </div>
        <p className="text-xs sm:text-sm text-white/80 text-center">
          Kelola semua pengajuan kegiatan mahasiswa
        </p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="bg-card border-b border-border px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto">
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap shadow-sm transition-colors ${
              statusFilter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Semua
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              statusFilter === 'all' ? 'bg-white/20' : 'bg-primary/10 text-primary'
            }`}>
              {counts.all}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-colors ${
              statusFilter === 'pending'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Pending
            <span className="ml-2 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs">
              {counts.pending}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-colors ${
              statusFilter === 'approved'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Disetujui
            <span className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">
              {counts.approved}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-colors ${
              statusFilter === 'rejected'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Ditolak
            <span className="ml-2 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs">
              {counts.rejected}
            </span>
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="bg-card border-b border-border px-6 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-semibold hover:bg-muted/80 transition-colors"
            type="button"
          >
            <Icon icon="solar:list-bold" className="size-4" />
            Kategori
            {kategoriFilter !== 'all' && (
              <span className="px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-[10px]">1</span>
            )}
          </button>
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-semibold hover:bg-muted/80 transition-colors"
            type="button"
          >
            <Icon icon="solar:case-round-bold" className="size-4" />
            Prodi
            {prodiFilter !== 'all' && (
              <span className="px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-[10px]">1</span>
            )}
          </button>
        </div>
        </div>
      </div>

      {/* Pengajuan List */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
        <div className="max-w-7xl mx-auto space-y-4">
        {pengajuan.length === 0 ? (
          <div className="text-center py-12">
            <Icon icon="solar:inbox-line-bold" className="size-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Tidak ada pengajuan</p>
          </div>
        ) : (
          pengajuan.map((item) => (
            <div key={item.id} className="bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-border">
              {/* Mahasiswa Info */}
              <div className="flex gap-3 mb-3">
                <img
                  alt={item.mahasiswa.nama}
                  src={item.mahasiswa.foto || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(item.mahasiswa.nama)}
                  className="size-12 rounded-full border-2 border-secondary object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{item.mahasiswa.nama}</p>
                  <p className="text-xs text-muted-foreground">{item.mahasiswa.nim}</p>
                  <span className={`inline-block mt-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${getStatusBadgeClass(item.status)}`}>
                    {getStatusLabel(item.status)}
                  </span>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${item.kategori_poin.jenis === 'positif' ? 'text-primary' : 'text-destructive'}`}>
                    {item.kategori_poin.jenis === 'positif' ? '+' : '-'}{item.kategori_poin.bobot}
                  </p>
                  <p className="text-xs text-muted-foreground">Poin</p>
                </div>
              </div>

              {/* Kegiatan Info */}
              <div className="space-y-2 mb-3">
                <p className="text-sm font-semibold text-foreground">{item.kategori_poin.nama}</p>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${getKategoriColor(item.kategori_poin.kategori_utama)}`}>
                    {item.kategori_poin.kategori_utama}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{formatDate(item.tanggal_aktivitas)}</span>
                </div>
                {item.deskripsi && (
                  <p className="text-xs text-muted-foreground mt-2">{item.deskripsi}</p>
                )}
              </div>

              {/* Bukti & Actions */}
              <div className="flex items-center gap-3">
                {item.bukti_foto ? (
                  <img
                    alt="Bukti"
                    src={item.bukti_foto}
                    className="size-20 rounded-xl object-cover border border-border cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => window.open(item.bukti_foto!, '_blank')}
                  />
                ) : (
                  <div className="size-20 rounded-xl bg-muted flex items-center justify-center border border-border">
                    <Icon icon="solar:gallery-bold" className="size-8 text-muted-foreground" />
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {item.bukti_foto ? 'Bukti Kegiatan' : 'Tidak ada bukti'}
                  </p>

                  {item.status === 'pending' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerifikasi(item.id, 'approved')}
                        disabled={isSubmitting}
                        className="flex-1 py-2 px-3 rounded-xl bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                        type="button"
                      >
                        Setuju
                      </button>
                      <button
                        onClick={() => {
                          const notes = prompt('Alasan penolakan (opsional):');
                          if (notes !== null) {
                            handleVerifikasi(item.id, 'rejected', notes);
                          }
                        }}
                        disabled={isSubmitting}
                        className="flex-1 py-2 px-3 rounded-xl bg-destructive text-white text-xs font-semibold hover:bg-destructive/90 transition-colors disabled:opacity-50"
                        type="button"
                      >
                        Tolak
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        className="flex-1 py-2 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
                        type="button"
                      >
                        Lihat Detail
                      </button>
                    </div>
                  )}

                  {item.notes_verifikator && (
                    <p className="text-xs text-muted-foreground italic mt-2">
                      Catatan: {item.notes_verifikator}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground font-heading">Filter Pengajuan</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex items-center justify-center size-8 rounded-lg hover:bg-muted transition-colors"
                type="button"
              >
                <Icon icon="solar:close-circle-bold" className="size-6 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Kategori Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Kategori</label>
                <select
                  value={kategoriFilter}
                  onChange={(e) => setKategoriFilter(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="Akademik">Akademik</option>
                  <option value="Dakwah">Dakwah</option>
                  <option value="Sosial">Sosial</option>
                  <option value="Adab">Adab</option>
                  <option value="Pelanggaran">Pelanggaran</option>
                </select>
              </div>

              {/* Prodi Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Program Studi</label>
                <select
                  value={prodiFilter}
                  onChange={(e) => setProdiFilter(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm"
                >
                  <option value="all">Semua Prodi</option>
                  <option value="Pendidikan Agama Islam">Pendidikan Agama Islam</option>
                  <option value="Ekonomi Syariah">Ekonomi Syariah</option>
                  <option value="Hukum Keluarga Islam">Hukum Keluarga Islam</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setKategoriFilter('all');
                    setProdiFilter('all');
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-muted text-foreground font-semibold hover:bg-muted/80 transition-colors"
                  type="button"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                  type="button"
                >
                  Terapkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


