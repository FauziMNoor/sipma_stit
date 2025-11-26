'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface MahasiswaBimbingan {
  id: string;
  nim: string;
  nama: string;
  semester: number;
  foto: string | null;
  total_poin: number;
  progress_percentage: number;
  status_keaktifan: string;
  status_color: string;
}

export default function MahasiswaBimbinganDosenPA() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [mahasiswaList, setMahasiswaList] = useState<MahasiswaBimbingan[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchMahasiswa();
    }
  }, [user]);

  const fetchMahasiswa = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/dosen-pa/mahasiswa-bimbingan/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        setMahasiswaList(result.data);
      }
    } catch (error) {
      console.error('Error fetching mahasiswa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMahasiswa = mahasiswaList.filter((mhs) => {
    const query = searchQuery.toLowerCase();
    return (
      mhs.nama.toLowerCase().includes(query) ||
      mhs.nim.toLowerCase().includes(query)
    );
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'sangat aktif':
        return 'text-green-600 bg-green-600';
      case 'aktif':
        return 'text-blue-600 bg-blue-600';
      case 'cukup aktif':
        return 'text-yellow-600 bg-yellow-600';
      case 'pasif':
        return 'text-red-600 bg-red-600';
      default:
        return 'text-gray-600 bg-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-background">
        {/* Header Skeleton */}
        <div className="px-4 sm:px-6 py-5 bg-primary">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="size-10 sm:size-11 rounded-xl bg-white/20 animate-pulse" />
              <div className="space-y-2 flex-1 mx-4">
                <div className="h-5 bg-white/20 rounded w-48 mx-auto animate-pulse" />
                <div className="h-3 bg-white/20 rounded w-32 mx-auto animate-pulse" />
              </div>
              <div className="size-10 sm:size-11" />
            </div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="px-4 sm:px-6 py-4 bg-card border-b border-border">
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-background rounded-xl p-3 text-center space-y-2">
                  <div className="h-3 bg-muted rounded w-16 mx-auto animate-pulse" />
                  <div className="h-6 bg-muted rounded w-12 mx-auto animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          <div className="max-w-2xl mx-auto space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-card rounded-2xl p-4 shadow-sm border border-border">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full bg-muted animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                  </div>
                  <div className="h-8 bg-muted rounded w-16 animate-pulse" />
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
      <div className="px-4 sm:px-6 py-5 bg-primary">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center size-10 sm:size-11 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Icon icon="solar:arrow-left-linear" className="size-5 sm:size-6 text-white" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-white font-heading">Mahasiswa Bimbingan</h1>
            <div className="size-10 sm:size-11" />
          </div>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 pl-11 sm:pl-12 rounded-xl bg-white text-sm sm:text-base text-foreground placeholder:text-muted-foreground"
              placeholder="Cari nama atau NIM mahasiswa..."
            />
            <Icon
              icon="solar:magnifer-linear"
              className="size-4 sm:size-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Total <span className="font-semibold text-foreground">{mahasiswaList.length} Mahasiswa</span> Bimbingan
            </p>
          </div>

          {filteredMahasiswa.length === 0 ? (
            <div className="text-center py-12">
              <Icon icon="solar:user-cross-bold" className="size-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Tidak ada mahasiswa ditemukan</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredMahasiswa.map((mahasiswa) => {
                const statusColors = getStatusColor(mahasiswa.status_keaktifan);
                const [textColor, bgColor] = statusColors.split(' bg-');
                
                return (
                  <button
                    key={mahasiswa.id}
                    onClick={() => router.push(`/dosen-pa/mahasiswa/${mahasiswa.id}`)}
                    className="w-full"
                  >
                    <div className="bg-card rounded-xl sm:rounded-2xl shadow-sm border border-border overflow-hidden">
                      <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5">
                        <img
                          alt={mahasiswa.nama}
                          src={
                            mahasiswa.foto ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(mahasiswa.nama)}`
                          }
                          className="size-12 sm:size-14 rounded-full border-2 border-secondary object-cover flex-shrink-0"
                        />
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-sm sm:text-base font-bold text-foreground truncate">{mahasiswa.nama}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground mb-2">
                            {mahasiswa.nim} • Semester {mahasiswa.semester}
                          </p>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center justify-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg bg-accent/20">
                              <p className="text-lg sm:text-xl font-bold text-accent">{mahasiswa.total_poin}</p>
                            </div>
                            <p className="text-[10px] sm:text-xs font-semibold text-accent">Poin</p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className={`text-[10px] sm:text-xs font-semibold ${textColor}`}>
                                {mahasiswa.status_keaktifan}
                              </p>
                              <p className="text-[10px] sm:text-xs text-muted-foreground">{mahasiswa.progress_percentage}%</p>
                            </div>
                            <div className="h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                style={{ width: `${mahasiswa.progress_percentage}%` }}
                                className={`h-full bg-${bgColor} rounded-full`}
                              />
                            </div>
                          </div>
                        </div>
                        <Icon icon="solar:alt-arrow-right-linear" className="size-4 sm:size-5 text-muted-foreground flex-shrink-0" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

