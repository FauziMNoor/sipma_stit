'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface MahasiswaStats {
  mahasiswa_id: string;
  mahasiswa_nama: string;
  mahasiswa_nim: string;
  mahasiswa_foto: string | null;
  total_poin: number;
  total_approved: number;
  total_pending: number;
  total_rejected: number;
}

export default function RekapPoinDosenPA() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [mahasiswaList, setMahasiswaList] = useState<MahasiswaStats[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchRekapPoin();
    }
  }, [user]);

  const fetchRekapPoin = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/dosen-pa/rekap-poin/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        setMahasiswaList(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching rekap poin:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter mahasiswa based on search query
  const filteredList = mahasiswaList.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.mahasiswa_nama.toLowerCase().includes(query) ||
      item.mahasiswa_nim.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <Icon icon="svg-spinners:ring-resize" className="size-12 text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-primary border-b border-border">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center size-11 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Icon icon="solar:arrow-left-linear" className="size-6 text-white" />
        </button>
        <h1 className="text-lg font-bold font-heading text-white">Rekap Poin</h1>
        <div className="size-11" />
      </div>

      {/* Search Bar */}
      <div className="px-4 sm:px-6 py-4 bg-card border-b border-border">
        <div className="relative max-w-2xl mx-auto">
          <Icon
            icon="solar:magnifer-linear"
            className="size-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2"
          />
          <input
            type="text"
            placeholder="Cari nama atau NIM mahasiswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="px-4 sm:px-6 py-4 bg-muted/30">
        <div className="max-w-2xl mx-auto grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Total Mahasiswa</p>
            <p className="text-2xl font-bold text-foreground">{mahasiswaList.length}</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Hasil Pencarian</p>
            <p className="text-2xl font-bold text-foreground">{filteredMahasiswa.length}</p>
          </div>
        </div>
      </div>

      {/* Mahasiswa List */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
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

