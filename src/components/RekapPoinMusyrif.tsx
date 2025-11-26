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

export default function RekapPoinMusyrif() {
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
      const response = await fetch(`/api/musyrif/rekap-poin/${user?.id}`, {
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

  const getPoinColor = (poin: number) => {
    if (poin >= 80) return 'text-green-600 bg-green-500/10';
    if (poin >= 60) return 'text-blue-600 bg-blue-500/10';
    if (poin >= 40) return 'text-yellow-600 bg-yellow-500/10';
    return 'text-red-600 bg-red-500/10';
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return { icon: 'solar:cup-star-bold', color: 'text-yellow-500' };
    if (index === 1) return { icon: 'solar:medal-star-bold', color: 'text-gray-400' };
    if (index === 2) return { icon: 'solar:medal-ribbons-star-bold', color: 'text-orange-600' };
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <Icon icon="svg-spinners:ring-resize" className="size-12 text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Memuat rekap poin...</p>
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
          <h1 className="text-xl font-bold text-white font-heading">Rekap Poin Mahasiswa</h1>
          <p className="text-sm text-white/80 mt-1">
            Monitoring poin seluruh mahasiswa asrama
          </p>
        </div>
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
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl p-3 border border-border text-center">
            <p className="text-xs text-muted-foreground mb-1">Total Mahasiswa</p>
            <p className="text-2xl font-bold text-foreground">{mahasiswaList.length}</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border text-center">
            <p className="text-xs text-muted-foreground mb-1">Hasil Pencarian</p>
            <p className="text-2xl font-bold text-primary">{filteredMahasiswa.length}</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border text-center">
            <p className="text-xs text-muted-foreground mb-1">Rata-rata Poin</p>
            <p className="text-2xl font-bold text-green-600">
              {mahasiswaList.length > 0
                ? Math.round(mahasiswaList.reduce((sum, m) => sum + m.total_poin, 0) / mahasiswaList.length)
                : 0}
            </p>
          </div>
        </div>
      </div>

      {/* Mahasiswa List */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
        <div className="max-w-2xl mx-auto space-y-3 pb-6">
          {filteredMahasiswa.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-2xl border border-border">
              <Icon icon="solar:user-cross-rounded-bold" className="size-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-base font-semibold text-foreground mb-1">
                {searchQuery ? 'Tidak ada mahasiswa yang ditemukan' : 'Belum ada data mahasiswa'}
              </p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Coba gunakan kata kunci lain' : 'Data mahasiswa akan muncul di sini'}
              </p>
            </div>
          ) : (
            filteredMahasiswa.map((mhs, index) => {
              const rankIcon = getRankIcon(index);
              return (
                <div
                  key={mhs.id}
                  className="bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank Number or Medal */}
                    <div className="flex-shrink-0 w-10 text-center">
                      {rankIcon ? (
                        <Icon icon={rankIcon.icon} className={`size-8 ${rankIcon.color} mx-auto`} />
                      ) : (
                        <div className="size-8 rounded-full bg-muted flex items-center justify-center mx-auto">
                          <span className="text-sm font-bold text-muted-foreground">#{index + 1}</span>
                        </div>
                      )}
                    </div>

                    {/* Photo */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={
                          mhs.foto ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(mhs.nama)}&background=4f46e5&color=fff`
                        }
                        alt={mhs.nama}
                        className="size-14 rounded-xl border-2 border-primary object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{mhs.nama}</p>
                      <p className="text-xs text-muted-foreground">{mhs.nim}</p>
                    </div>

                    {/* Poin Badge */}
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold ${getPoinColor(
                          mhs.total_poin
                        )}`}
                      >
                        <Icon icon="solar:star-bold" className="size-4" />
                        {mhs.total_poin}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
