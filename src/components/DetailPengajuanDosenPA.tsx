'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface DetailAktivitas {
  id: string;
  tanggal: string;
  deskripsi_kegiatan: string;
  bukti: string | null;
  status: 'pending' | 'approved' | 'rejected';
  notes_verifikator: string | null;
  mahasiswa: {
    id: string;
    nim: string;
    nama: string;
    foto: string | null;
    total_poin: number;
  };
  kategori: {
    nama: string;
    kategori_utama: string;
    bobot: number;
    jenis: 'positif' | 'negatif';
  };
}

interface DetailPengajuanDosenPAProps {
  aktivitasId: string;
}

export default function DetailPengajuanDosenPA({ aktivitasId }: DetailPengajuanDosenPAProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aktivitas, setAktivitas] = useState<DetailAktivitas | null>(null);
  const [notes, setNotes] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [aktivitasId]);

  const fetchDetail = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/dosen-pa/verifikasi/detail/${aktivitasId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        setAktivitas(result.data);
        setNotes(result.data.notes_verifikator || '');
      }
    } catch (error) {
      console.error('Error fetching detail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifikasi = async (action: 'approve' | 'reject') => {
    if (!aktivitas) return;

    if (action === 'reject' && !notes.trim()) {
      alert('Mohon berikan alasan penolakan');
      return;
    }

    if (!confirm(`Apakah Anda yakin ingin ${action === 'approve' ? 'menyetujui' : 'menolak'} pengajuan ini?`)) {
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/dosen-pa/verifikasi/${aktivitasId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          action,
          notes: notes.trim() || null,
          dosenId: user?.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`Pengajuan berhasil ${action === 'approve' ? 'disetujui' : 'ditolak'}!`);
        router.push('/dosen-pa/verifikasi');
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (isLoading || !aktivitas) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <Icon icon="svg-spinners:ring-resize" className="size-12 text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Memuat detail...</p>
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
            className="flex items-center justify-center size-11 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Icon icon="solar:arrow-left-linear" className="size-6 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white font-heading">Detail Pengajuan</h1>
          <div className="size-11" />
        </div>
        <p className="text-sm text-white/80 text-center">Verifikasi kegiatan mahasiswa</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Mahasiswa Info */}
        <div className="bg-card border-b border-border px-6 py-5">
          <div className="flex gap-4 items-center">
            <img
              alt={aktivitas.mahasiswa.nama}
              src={
                aktivitas.mahasiswa.foto ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(aktivitas.mahasiswa.nama)}`
              }
              className="size-16 rounded-full border-2 border-secondary object-cover"
            />
            <div className="flex-1">
              <p className="text-base font-bold text-foreground">{aktivitas.mahasiswa.nama}</p>
              <p className="text-sm text-muted-foreground">NIM: {aktivitas.mahasiswa.nim}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="px-3 py-1.5 rounded-lg bg-primary/10">
                  <p className="text-xs text-muted-foreground">Total Poin Saat Ini</p>
                  <p className="text-lg font-bold text-primary">{aktivitas.mahasiswa.total_poin}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Kegiatan */}
        <div className="px-6 py-6 space-y-6">
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border space-y-5">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Nama Kegiatan
              </p>
              <p className="text-base font-bold text-foreground">
                {aktivitas.deskripsi_kegiatan}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  Kategori
                </p>
                <span className="inline-block px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                  {aktivitas.kategori.nama}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  Tanggal
                </p>
                <p className="text-sm font-semibold text-foreground">{formatDate(aktivitas.tanggal)}</p>
              </div>
            </div>

            <div className="bg-accent/10 rounded-xl p-4 text-center border-2 border-accent/30">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                Poin Diajukan
              </p>
              <p style={{ color: '#FFD646' }} className="text-5xl font-bold">
                {aktivitas.kategori.jenis === 'positif' ? '+' : '-'}{aktivitas.kategori.bobot}
              </p>
            </div>

            {aktivitas.bukti && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">
                  Foto Bukti Kegiatan
                </p>
                <div className="relative">
                  <img
                    alt="Bukti Kegiatan"
                    src={aktivitas.bukti}
                    className="w-full h-64 rounded-xl object-cover border border-border cursor-pointer"
                    onClick={() => setShowImageModal(true)}
                  />
                  <button
                    onClick={() => setShowImageModal(true)}
                    className="absolute top-3 right-3 size-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center"
                  >
                    <Icon icon="solar:magnifer-linear" className="size-5 text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* Notes Input (only for pending status) */}
            {aktivitas.status === 'pending' && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  Catatan Verifikasi (Opsional)
                </p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground resize-none"
                  placeholder="Tambahkan catatan jika diperlukan..."
                  rows={4}
                />
              </div>
            )}

            {/* Show notes if already verified */}
            {aktivitas.status !== 'pending' && aktivitas.notes_verifikator && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  Catatan Verifikator
                </p>
                <div className="bg-muted rounded-xl p-4">
                  <p className="text-sm text-foreground leading-relaxed">
                    {aktivitas.notes_verifikator}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons (only for pending status) */}
      {aktivitas.status === 'pending' && (
        <div className="px-6 py-5 bg-card border-t border-border">
          <div className="flex gap-3">
            <button
              onClick={() => handleVerifikasi('reject')}
              disabled={isSubmitting}
              style={{ color: '#E63946', borderColor: '#E63946' }}
              className="flex-1 py-4 px-4 rounded-xl border-2 font-bold text-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Memproses...' : 'Tolak'}
            </button>
            <button
              onClick={() => handleVerifikasi('approve')}
              disabled={isSubmitting}
              style={{ color: '#FFFFFF', backgroundColor: '#0059A8' }}
              className="flex-1 py-4 px-4 rounded-xl font-bold text-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Memproses...' : 'Setujui'}
            </button>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && aktivitas.bukti && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={aktivitas.bukti}
              alt="Bukti Kegiatan"
              className="max-w-full max-h-[90vh] object-contain rounded-xl"
            />
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 size-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center"
            >
              <Icon icon="solar:close-circle-bold" className="size-6 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

