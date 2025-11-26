'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

interface PengajuanDetail {
  id: string;
  mahasiswa_id: string;
  mahasiswa_nama: string;
  mahasiswa_nim: string;
  mahasiswa_prodi: string;
  mahasiswa_angkatan: string;
  mahasiswa_foto: string | null;
  kategori_id: string;
  kategori_nama: string;
  kategori_poin: number;
  deskripsi_kegiatan: string;
  tanggal: string;
  bukti: string | null;
  status: 'pending' | 'approved' | 'rejected';
  notes_verifikator: string | null;
  verified_at: string | null;
  verifikator_nama: string | null;
  created_at: string;
}

interface DetailPengajuanWaket3Props {
  pengajuanId: string;
  userId: string;
}

export default function DetailPengajuanWaket3({ pengajuanId, userId }: DetailPengajuanWaket3Props) {
  const router = useRouter();
  const [data, setData] = useState<PengajuanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectNotes, setRejectNotes] = useState('');

  useEffect(() => {
    fetchDetail();
  }, [pengajuanId]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/waket3/verifikasi/detail/${pengajuanId}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch detail');
      }

      setData(result.data);
    } catch (err) {
      console.error('Error fetching detail:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!confirm('Apakah Anda yakin ingin menyetujui pengajuan ini?')) return;

    try {
      setProcessing(true);
      const response = await fetch(`/api/waket3/verifikasi/${pengajuanId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          verifikator_id: userId,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to approve');
      }

      alert('Pengajuan berhasil disetujui!');
      router.back();
    } catch (err) {
      console.error('Error approving:', err);
      alert(err instanceof Error ? err.message : 'Gagal menyetujui pengajuan');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectNotes.trim()) {
      alert('Mohon berikan alasan penolakan');
      return;
    }

    try {
      setProcessing(true);
      const response = await fetch(`/api/waket3/verifikasi/${pengajuanId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          verifikator_id: userId,
          notes: rejectNotes,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to reject');
      }

      alert('Pengajuan berhasil ditolak!');
      router.back();
    } catch (err) {
      console.error('Error rejecting:', err);
      alert(err instanceof Error ? err.message : 'Gagal menolak pengajuan');
    } finally {
      setProcessing(false);
      setShowRejectModal(false);
      setRejectNotes('');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long',
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-background">
        {/* Header Skeleton */}
        <div className="px-4 sm:px-6 py-5 bg-primary">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="size-11 rounded-xl bg-white/20 animate-pulse" />
              <div className="h-6 bg-white/20 rounded w-40 animate-pulse" />
              <div className="size-11" />
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Mahasiswa Info Skeleton */}
            <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-16 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-muted rounded w-48 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-32 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-40 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Activity Details Skeleton */}
            <div className="bg-card rounded-2xl p-5 shadow-sm border border-border space-y-4">
              <div>
                <div className="h-3 bg-muted rounded w-32 mb-2 animate-pulse" />
                <div className="h-5 bg-muted rounded w-full animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="h-3 bg-muted rounded w-16 mb-2 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-28 animate-pulse" />
                </div>
                <div>
                  <div className="h-3 bg-muted rounded w-12 mb-2 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-16 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="h-3 bg-muted rounded w-20 mb-2 animate-pulse" />
                <div className="h-4 bg-muted rounded w-32 animate-pulse" />
              </div>
            </div>

            {/* Bukti Skeleton */}
            <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
              <div className="h-3 bg-muted rounded w-24 mb-3 animate-pulse" />
              <div className="w-full h-64 rounded-xl bg-muted animate-pulse" />
            </div>

            {/* Status Skeleton */}
            <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
              <div className="h-3 bg-muted rounded w-20 mb-3 animate-pulse" />
              <div className="h-10 bg-muted rounded w-32 animate-pulse" />
            </div>

            {/* Buttons Skeleton */}
            <div className="flex gap-3">
              <div className="flex-1 h-12 bg-muted rounded-xl animate-pulse" />
              <div className="flex-1 h-12 bg-muted rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <Icon icon="solar:danger-circle-bold" className="size-12 text-destructive mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">{error || 'Data tidak ditemukan'}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-4 sm:px-6 py-5 bg-primary">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center size-11"
          >
            <Icon icon="solar:arrow-left-linear" className="size-6 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white font-heading">Detail Pengajuan</h1>
          <div className="size-11" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
        {/* Mahasiswa Info */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          <div className="flex items-center gap-4 mb-4">
            <img
              alt="Mahasiswa"
              src={data.mahasiswa_foto || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.mahasiswa_nama)}
              className="size-16 rounded-full border-2 border-primary object-cover"
            />
            <div className="flex-1">
              <p className="text-base font-bold text-foreground">{data.mahasiswa_nama}</p>
              <p className="text-sm text-muted-foreground">{data.mahasiswa_nim}</p>
              <p className="text-xs text-muted-foreground">{data.mahasiswa_prodi} - Angkatan {data.mahasiswa_angkatan}</p>
            </div>
          </div>
        </div>

        {/* Activity Details */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Deskripsi Kegiatan</p>
            <p className="text-base font-semibold text-foreground">{data.deskripsi_kegiatan}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Kategori</p>
              <p className="text-sm font-semibold text-foreground">{data.kategori_nama}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Poin</p>
              <p className="text-sm font-semibold text-primary">+{data.kategori_poin}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Tanggal Kegiatan</p>
            <p className="text-sm font-semibold text-foreground">{formatDate(data.tanggal)}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Status</p>
            {data.status === 'pending' && (
              <span className="inline-block px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-sm font-semibold">
                Pending
              </span>
            )}
            {data.status === 'approved' && (
              <span className="inline-block px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-sm font-semibold">
                Disetujui
              </span>
            )}
            {data.status === 'rejected' && (
              <span className="inline-block px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-sm font-semibold">
                Ditolak
              </span>
            )}
          </div>

          {data.verified_at && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Diverifikasi Oleh</p>
              <p className="text-sm font-semibold text-foreground">{data.verifikator_nama}</p>
              <p className="text-xs text-muted-foreground mt-1">{formatDateTime(data.verified_at)}</p>
            </div>
          )}

          {data.notes_verifikator && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Catatan Verifikator</p>
              <p className="text-sm text-foreground">{data.notes_verifikator}</p>
            </div>
          )}
        </div>

        {/* Bukti */}
        {data.bukti && (
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
            <p className="text-sm font-semibold text-foreground mb-3">Bukti Kegiatan</p>
            <img
              alt="Bukti Kegiatan"
              src={data.bukti}
              className="w-full rounded-xl object-cover border border-border"
            />
          </div>
        )}

        {/* Action Buttons */}
        {data.status === 'pending' && (
          <div className="flex gap-3 pb-6">
            <button
              onClick={handleApprove}
              disabled={processing}
              className="flex-1 py-3 px-4 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Memproses...' : 'Setujui'}
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={processing}
              className="flex-1 py-3 px-4 rounded-xl bg-destructive text-white text-sm font-semibold hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tolak
            </button>
          </div>
        )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-foreground mb-4">Alasan Penolakan</h3>
            <textarea
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-input border border-border text-sm resize-none"
              rows={4}
              placeholder="Masukkan alasan penolakan..."
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectNotes('');
                }}
                disabled={processing}
                className="flex-1 py-2.5 px-4 rounded-xl bg-muted text-muted-foreground text-sm font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleReject}
                disabled={processing || !rejectNotes.trim()}
                className="flex-1 py-2.5 px-4 rounded-xl bg-destructive text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Memproses...' : 'Tolak'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

