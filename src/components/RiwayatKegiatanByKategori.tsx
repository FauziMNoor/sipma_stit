'use client';

import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

interface KegiatanItem {
  id: string;
  tanggal: string;
  deskripsi_kegiatan: string;
  status: 'pending' | 'approved' | 'rejected';
  kategori: {
    nama: string;
    kategori_utama: string;
    bobot: number;
    jenis: 'positif' | 'negatif';
  };
}

interface ReferensiKegiatan {
  id: string;
  kode: string;
  nama: string;
  kategori_utama: string;
  bobot: number;
  jenis: 'positif' | 'negatif';
  deskripsi: string | null;
}

interface RiwayatKegiatanByKategoriProps {
  kategoriUtama: string;
  title: string;
  icon: string;
  color: string;
}

export default function RiwayatKegiatanByKategori({
  kategoriUtama,
  title,
  icon,
  color,
}: RiwayatKegiatanByKategoriProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState<'riwayat' | 'referensi'>('riwayat');
  const [kegiatanList, setKegiatanList] = useState<KegiatanItem[]>([]);
  const [referensiList, setReferensiList] = useState<ReferensiKegiatan[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (mode === 'riwayat' && user?.id) {
      fetchKegiatan();
    } else if (mode === 'referensi') {
      fetchReferensi();
    }
  }, [user?.id, kategoriUtama, mode]);

  const fetchKegiatan = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Fetching kegiatan mahasiswa:', { mahasiswa_id: user?.id, kategoriUtama });

      const response = await fetch(`/api/mahasiswa/kegiatan?mahasiswa_id=${user?.id}`);
      const result = await response.json();

      if (result.success && result.data) {
        // Filter by kategori_utama
        const filtered = result.data.filter((item: KegiatanItem) =>
          item.kategori.kategori_utama === kategoriUtama
        );
        console.log('✅ Kegiatan filtered:', { count: filtered.length, data: filtered });
        setKegiatanList(filtered);
      } else {
        console.error('❌ Error fetching kegiatan:', result.error);
        setKegiatanList([]);
      }
    } catch (error) {
      console.error('❌ Error fetching kegiatan:', error);
      setKegiatanList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReferensi = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Fetching referensi kegiatan:', { kategoriUtama });

      const { data, error } = await supabase
        .from('kategori_poin')
        .select('id, kode, nama, kategori_utama, bobot, jenis, deskripsi')
        .eq('kategori_utama', kategoriUtama)
        .eq('is_active', true)
        .order('bobot', { ascending: false });

      if (error) {
        console.error('❌ Error fetching referensi:', error);
        setReferensiList([]);
      } else {
        console.log('✅ Referensi fetched:', { count: data?.length, data });
        setReferensiList(data || []);
      }
    } catch (error) {
      console.error('❌ Error fetching referensi:', error);
      setReferensiList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter by status (for riwayat mode)
  const filteredKegiatan = kegiatanList.filter((item) => {
    if (filterStatus === 'all') return true;
    return item.status === filterStatus;
  });

  // Filter by search (for referensi mode)
  const filteredReferensi = referensiList.filter((item) =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-semibold">Disetujui</span>;
      case 'rejected':
        return <span className="px-2 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-semibold">Ditolak</span>;
      default:
        return <span className="px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-600 text-xs font-semibold">Pending</span>;
    }
  };

  const getEmojiByKategori = (kategori: string) => {
    switch (kategori) {
      case 'Akademik':
        return '🎓';
      case 'Dakwah':
        return '🕌';
      case 'Sosial':
        return '🤝';
      case 'Adab':
        return '🌿';
      case 'Pelanggaran':
        return '🚫';
      default:
        return '📚';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 bg-card border-b border-border`}>
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center size-11"
          type="button"
        >
          <Icon icon="solar:arrow-left-linear" className={`size-6 ${color}`} />
        </button>
        <h1 className={`text-lg font-semibold font-heading ${color}`}>{title}</h1>
        <div className="size-11" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4 space-y-4">
          {/* Toggle Mode */}
          <div className="flex items-center gap-2 bg-input rounded-xl p-1">
            <button
              onClick={() => setMode('riwayat')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'riwayat' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              <Icon icon="solar:history-bold" className="inline size-4 mr-1" />
              Riwayat Saya
            </button>
            <button
              onClick={() => setMode('referensi')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'referensi' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              <Icon icon="solar:book-bold" className="inline size-4 mr-1" />
              Referensi
            </button>
          </div>

          {/* Filter Status (for Riwayat mode) */}
          {mode === 'riwayat' && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  filterStatus === 'all' ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground hover:bg-card/80'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilterStatus('approved')}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  filterStatus === 'approved' ? 'bg-green-600 text-white' : 'bg-card text-foreground hover:bg-card/80'
                }`}
              >
                Disetujui
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  filterStatus === 'pending' ? 'bg-yellow-600 text-white' : 'bg-card text-foreground hover:bg-card/80'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilterStatus('rejected')}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  filterStatus === 'rejected' ? 'bg-destructive text-destructive-foreground' : 'bg-card text-foreground hover:bg-card/80'
                }`}
              >
                Ditolak
              </button>
            </div>
          )}

          {/* Search (for Referensi mode) */}
          {mode === 'referensi' && (
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-input border border-border"
                placeholder="Cari kegiatan..."
              />
              <Icon
                icon="solar:magnifer-linear"
                className="size-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2"
              />
            </div>
          )}

          {/* List Kegiatan Riwayat */}
          {mode === 'riwayat' && (
            <>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Icon icon="svg-spinners:ring-resize" className="size-8 text-primary" />
                </div>
              ) : filteredKegiatan.length === 0 ? (
                <div className="text-center py-12">
                  <Icon icon="solar:inbox-line-linear" className="size-16 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Belum ada kegiatan</p>
                  <p className="text-xs text-muted-foreground mt-2">Klik "Referensi" untuk melihat daftar kegiatan</p>
                </div>
              ) : (
                <div className="space-y-3 pb-4">
                  {filteredKegiatan.map((item) => (
                    <div
                      key={item.id}
                      className="bg-card rounded-2xl p-4 shadow-sm border border-border"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center size-12 rounded-full bg-secondary shrink-0">
                          <span className="text-2xl">{getEmojiByKategori(item.kategori.kategori_utama)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-sm font-bold text-foreground">{item.kategori.nama}</h3>
                            {getStatusBadge(item.status)}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {item.deskripsi_kegiatan || 'Tidak ada keterangan'}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {formatDate(item.tanggal)}
                            </span>
                            <span className={`text-xs font-bold ${item.kategori.jenis === 'negatif' ? 'text-destructive' : 'text-green-600'}`}>
                              {item.kategori.jenis === 'negatif' ? '-' : '+'}{item.kategori.bobot} poin
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* List Kegiatan Referensi */}
          {mode === 'referensi' && (
            <>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Icon icon="svg-spinners:ring-resize" className="size-8 text-primary" />
                </div>
              ) : filteredReferensi.length === 0 ? (
                <div className="text-center py-12">
                  <Icon icon="solar:inbox-line-linear" className="size-16 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Tidak ada kegiatan ditemukan</p>
                </div>
              ) : (
                <div className="space-y-3 pb-4">
                  {filteredReferensi.map((item) => (
                    <div
                      key={item.id}
                      className="bg-card rounded-2xl p-4 shadow-sm border border-border"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center size-12 rounded-full bg-secondary shrink-0">
                          <span className="text-2xl">{getEmojiByKategori(item.kategori_utama)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-foreground mb-1">{item.nama}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.deskripsi || 'Tidak ada deskripsi'}
                          </p>
                        </div>
                        <div className={`flex items-center justify-center px-3 py-1 rounded-full shrink-0 ${item.jenis === 'negatif' ? 'bg-destructive/10' : 'bg-accent'}`}>
                          <span className={`text-sm font-bold ${item.jenis === 'negatif' ? 'text-destructive' : 'text-accent-foreground'}`}>
                            {item.jenis === 'negatif' ? '-' : '+'}{item.bobot}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

