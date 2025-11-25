'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface Kegiatan {
  id: string;
  tanggal: string;
  status: 'pending' | 'approved' | 'rejected';
  deskripsi_kegiatan: string;
  bukti: string | null;
  kategori_poin: {
    id: string;
    kode: string;
    nama: string;
    bobot: number;
    kategori_utama: string;
    jenis: string;
  };
}

export default function KegiatanMahasiswa() {
  const router = useRouter();
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchKegiatan();
    }
  }, [user, statusFilter]);

  const fetchKegiatan = async () => {
    try {
      setLoading(true);
      const url = statusFilter === 'all' 
        ? `/api/mahasiswa/kegiatan?mahasiswa_id=${user?.id}`
        : `/api/mahasiswa/kegiatan?mahasiswa_id=${user?.id}&status=${statusFilter}`;
      
      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setKegiatan(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching kegiatan:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'px-3 py-1 rounded-full text-xs font-semibold bg-accent/20 text-accent-foreground';
      case 'approved':
        return 'px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700';
      case 'rejected':
        return 'px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700';
      default:
        return 'px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'approved': return 'Disetujui';
      case 'rejected': return 'Ditolak';
      default: return status;
    }
  };

  const getCategoryIcon = (kategori: string) => {
    switch (kategori) {
      case 'Akademik': return '🎓';
      case 'Dakwah': return '🕌';
      case 'Sosial': return '🤝';
      case 'Adab': return '🌿';
      case 'Pelanggaran': return '🚫';
      default: return '📋';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="px-6 py-5 bg-card border-b border-border">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.push('/mahasiswa/dashboard')}
            className="flex items-center justify-center size-11"
          >
            <Icon icon="solar:arrow-left-linear" className="size-6 text-foreground" />
          </button>
          <h1 className="text-lg font-bold font-heading text-foreground">Kegiatan Saya</h1>
          <div className="size-11" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 py-4 bg-card border-b border-border">
        <div className="max-w-3xl mx-auto flex gap-3 overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap ${
              statusFilter === 'all' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap ${
              statusFilter === 'pending' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap ${
              statusFilter === 'approved' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Disetujui
          </button>
          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap ${
              statusFilter === 'rejected' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Ditolak
          </button>
        </div>
      </div>

      {/* Kegiatan List */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Icon icon="solar:loading-bold" className="size-8 text-primary animate-spin" />
          </div>
        ) : kegiatan.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Icon icon="solar:clipboard-list-bold" className="size-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Belum ada kegiatan</p>
          </div>
        ) : (
          kegiatan.map((item) => (
            <div key={item.id} className="bg-card rounded-2xl p-5 shadow-sm border border-border">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10 shrink-0">
                  <span className="text-2xl">{getCategoryIcon(item.kategori_poin?.kategori_utama || '')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-base font-semibold text-foreground line-clamp-2">
                      {item.deskripsi_kegiatan}
                    </h3>
                    <span className={getStatusBadge(item.status)}>
                      {getStatusLabel(item.status)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon icon="solar:calendar-linear" className="size-4" />
                      <span>{formatDate(item.tanggal)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon icon="solar:tag-linear" className="size-4" />
                      <span>{item.kategori_poin?.nama || 'Tidak ada kategori'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="solar:star-bold"
                        className={`size-4 ${item.status === 'approved' ? 'text-accent' : 'text-muted-foreground'}`}
                      />
                      <span className={`text-sm font-semibold ${item.status === 'approved' ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {item.status === 'approved' ? '+' : ''}{item.kategori_poin?.bobot || 0} Poin
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-3xl mx-auto flex items-center justify-around py-3 px-6">
          <button
            onClick={() => router.push('/mahasiswa/dashboard')}
            className="flex flex-col items-center gap-1 py-2 px-4"
          >
            <Icon icon="solar:home-2-bold" className="size-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2 px-4">
            <Icon icon="solar:clipboard-list-bold" className="size-6 text-primary" />
            <span className="text-xs font-semibold text-primary">Kegiatan</span>
          </button>
          <button
            onClick={() => router.push('/mahasiswa/profil')}
            className="flex flex-col items-center gap-1 py-2 px-4"
          >
            <Icon icon="solar:user-bold" className="size-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
}

