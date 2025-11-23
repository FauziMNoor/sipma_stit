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

interface Pengajuan {
  id: string;
  mahasiswa: Mahasiswa;
  kategori: KategoriPoin;
  tanggal: string;
  status: 'pending' | 'approved' | 'rejected';
  bukti: string | null;
  deskripsi_kegiatan: string | null;
  notes_verifikator: string | null;
  verified_at: string | null;
  created_at: string;
}

interface Counts {
  all: number;
  pending: number;
  approved: number;
  rejected: number;
}

export default function VerifikasiAdabAsrama() {
  const router = useRouter();
  const [pengajuan, setPengajuan] = useState<Pengajuan[]>([]);
  const [counts, setCounts] = useState<Counts>({ all: 0, pending: 0, approved: 0, rejected: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPengajuan, setSelectedPengajuan] = useState<Pengajuan | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchPengajuan();
  }, [statusFilter, searchQuery]);

  const fetchPengajuan = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('status', statusFilter);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/musyrif/verifikasi?${params.toString()}`, {
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

  const handleAction = async (pengajuanItem: Pengajuan, action: 'approve' | 'reject') => {
    setSelectedPengajuan(pengajuanItem);
    setActionType(action);
    setNotes('');
    setShowActionModal(true);
  };

  const submitAction = async () => {
    if (!selectedPengajuan) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/musyrif/verifikasi/${selectedPengajuan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action: actionType,
          notes: notes || null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setShowActionModal(false);
        setSelectedPengajuan(null);
        setNotes('');
        fetchPengajuan();
      } else {
        alert(result.error || 'Gagal memproses verifikasi');
      }
    } catch (error) {
      console.error('Error submitting action:', error);
      alert('Terjadi kesalahan saat memproses verifikasi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
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

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="px-6 py-5 bg-primary">
          <div className="flex items-center justify-between mb-1">
            <button className="flex items-center justify-center size-11">
              <Icon icon="solar:arrow-left-linear" className="size-6 text-white" />
            </button>
            <h1 className="text-lg font-bold text-white font-heading">Verifikasi Adab & Asrama</h1>
            <div className="size-11" />
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
      <div className="px-6 py-5 bg-primary">
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center size-11"
            type="button"
          >
            <Icon icon="solar:arrow-left-linear" className="size-6 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white font-heading">Verifikasi Adab & Asrama</h1>
          <button className="flex items-center justify-center size-11" type="button">
            <Icon icon="solar:filter-bold" className="size-6 text-white" />
          </button>
        </div>
        <p className="text-sm text-white/80 text-center">
          Verifikasi kegiatan adab, akhlak & asrama
        </p>
      </div>

      {/* Search & Filter */}
      <div className="bg-card px-6 py-4">
        <div className="relative mb-4">
          <input
            type="text"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground"
            placeholder="Cari nama mahasiswa atau NIM..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Icon
            icon="solar:magnifer-linear"
            className="size-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap shadow-sm ${
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
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap ${
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
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap ${
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
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap ${
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

      {/* Pengajuan List */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {pengajuan.length === 0 ? (
          <div className="text-center py-12">
            <Icon icon="solar:inbox-line-bold" className="size-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Tidak ada pengajuan</p>
          </div>
        ) : (
          pengajuan.map((item) => {
            const isPositive = item.kategori.jenis === 'positif';
            const isPending = item.status === 'pending';
            const bgColor = item.kategori.jenis === 'negatif'
              ? 'bg-destructive/5 border-destructive/30'
              : 'bg-green-50 border-green-200';

            return (
              <div key={item.id} className={`rounded-2xl p-4 shadow-sm border ${bgColor}`}>
                {item.kategori.jenis === 'negatif' && (
                  <div className="flex items-start gap-2 mb-3 p-2 bg-destructive/10 rounded-lg">
                    <Icon
                      icon="solar:danger-triangle-bold"
                      className="size-5 text-destructive shrink-0 mt-0.5"
                    />
                    <p className="text-xs font-semibold text-destructive">Pelanggaran - Poin Negatif</p>
                  </div>
                )}
                <div className="flex gap-3 mb-3">
                  <img
                    alt="Mahasiswa"
                    src={item.mahasiswa.foto || 'https://randomuser.me/api/portraits/men/45.jpg'}
                    className={`size-12 rounded-full border-2 object-cover ${
                      isPositive ? 'border-green-500' : 'border-destructive'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">{item.mahasiswa.nama}</p>
                    <p className="text-xs text-muted-foreground">{item.mahasiswa.nim}</p>
                    {getStatusBadge(item.status)}
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      isPositive ? 'text-green-600' : 'text-destructive'
                    }`}>
                      {isPositive ? '+' : ''}{item.kategori.bobot}
                    </p>
                    <p className="text-xs text-muted-foreground">Poin</p>
                  </div>
                </div>
                <div className="space-y-2 mb-3">
                  <p className="text-sm font-semibold text-foreground">{item.kategori.nama}</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      isPositive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-destructive/20 text-destructive'
                    }`}>
                      {item.kategori.kategori_utama || 'Lainnya'}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{formatDate(item.tanggal)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {item.bukti && (
                    <img
                      alt="Bukti"
                      src={item.bukti}
                      className="size-20 rounded-xl object-cover border border-border"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <p className="text-xs text-muted-foreground">
                      {item.bukti ? 'Dokumentasi Kegiatan' : 'Tidak ada bukti'}
                    </p>
                    {isPending ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(item, 'approve')}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-green-600 text-white text-xs font-semibold flex items-center justify-center gap-1 hover:bg-green-700 transition-colors"
                        >
                          <Icon icon="solar:check-circle-bold" className="size-4" />
                          Setujui
                        </button>
                        <button
                          onClick={() => handleAction(item, 'reject')}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-destructive text-white text-xs font-semibold flex items-center justify-center gap-1 hover:bg-destructive/90 transition-colors"
                        >
                          <Icon icon="solar:close-circle-bold" className="size-4" />
                          Tolak
                        </button>
                      </div>
                    ) : (
                      <button className="flex-1 py-2 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold w-full">
                        Lihat Detail
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Action Modal */}
      {showActionModal && selectedPengajuan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground font-heading">
                {actionType === 'approve' ? 'Setujui Pengajuan' : 'Tolak Pengajuan'}
              </h3>
              <button
                onClick={() => setShowActionModal(false)}
                className="flex items-center justify-center size-8 rounded-lg hover:bg-muted transition-colors"
                type="button"
              >
                <Icon icon="solar:close-circle-bold" className="size-6 text-muted-foreground" />
              </button>
            </div>

            <div className="mb-4 p-4 bg-muted/50 rounded-xl">
              <p className="text-sm font-semibold text-foreground mb-1">
                {selectedPengajuan.mahasiswa.nama}
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                {selectedPengajuan.mahasiswa.nim}
              </p>
              <p className="text-sm text-foreground">{selectedPengajuan.kategori.nama}</p>
              <p className={`text-lg font-bold mt-2 ${
                selectedPengajuan.kategori.jenis === 'positif' ? 'text-green-600' : 'text-destructive'
              }`}>
                {selectedPengajuan.kategori.jenis === 'positif' ? '+' : ''}{selectedPengajuan.kategori.bobot} Poin
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Catatan {actionType === 'reject' ? '(Wajib)' : '(Opsional)'}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm resize-none"
                rows={3}
                placeholder={actionType === 'approve'
                  ? 'Tambahkan catatan jika diperlukan...'
                  : 'Jelaskan alasan penolakan...'}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowActionModal(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-muted text-foreground font-semibold hover:bg-muted/80 transition-colors"
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={submitAction}
                disabled={isSubmitting || (actionType === 'reject' && !notes.trim())}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-colors ${
                  actionType === 'approve'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-destructive text-white hover:bg-destructive/90'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? 'Memproses...' : actionType === 'approve' ? 'Setujui' : 'Tolak'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

