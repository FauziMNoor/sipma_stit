'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface MahasiswaWithPoin {
  id: string;
  nim: string;
  nama: string;
  foto: string | null;
  is_active: boolean;
  total_poin: number;
}

export default function RekapPoinDosenPA() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [mahasiswaList, setMahasiswaList] = useState<MahasiswaWithPoin[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMahasiswa, setFilteredMahasiswa] = useState<MahasiswaWithPoin[]>([]);

  useEffect(() => {
    if (user?.id) {
      fetchRekapPoin();
    }
  }, [user]);

  useEffect(() => {
    // Filter mahasiswa based on search query
    if (searchQuery.trim() === '') {
      setFilteredMahasiswa(mahasiswaList);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = mahasiswaList.filter(
        (mhs) =>
          mhs.nama.toLowerCase().includes(query) ||
          mhs.nim.toLowerCase().includes(query)
      );
      setFilteredMahasiswa(filtered);
    }
  }, [searchQuery, mahasiswaList]);

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
        setFilteredMahasiswa(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching rekap poin:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto space-y-3">
          {filteredMahasiswa.length === 0 ? (
            <div className="text-center py-12">
              <Icon icon="solar:user-cross-rounded-bold" className="size-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Tidak ada mahasiswa yang ditemukan' : 'Belum ada data mahasiswa'}
              </p>
            </div>
          ) : (
            filteredMahasiswa.map((mhs, index) => (
              <div key={mhs.id} className="bg-card rounded-xl p-4 border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <img
                      src={mhs.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(mhs.nama)}`}
                      alt={mhs.nama}
                      className="size-14 rounded-xl border-2 border-border object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">{mhs.nama}</p>
                    <p className="text-xs text-muted-foreground">{mhs.nim}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-600 text-xs font-bold">
                      {mhs.total_poin} Poin
                    </span>
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

