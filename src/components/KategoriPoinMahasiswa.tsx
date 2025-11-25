'use client';

import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface KategoriPoin {
  id: string;
  kode: string;
  nama: string;
  kategori_utama: string;
  bobot: number;
  jenis: string;
  deskripsi: string | null;
}

interface KategoriPoinMahasiswaProps {
  kategoriUtama: string;
  title: string;
  icon: string;
  color: string;
  jenis?: 'positif' | 'negatif'; // Optional, default 'positif'
}

export default function KategoriPoinMahasiswa({
  kategoriUtama,
  title,
  icon,
  color,
  jenis = 'positif', // Default to 'positif'
}: KategoriPoinMahasiswaProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [kegiatanList, setKegiatanList] = useState<KategoriPoin[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'poin' | 'nama'>('poin');

  useEffect(() => {
    fetchKegiatan();
  }, [kategoriUtama, jenis]);

  const fetchKegiatan = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Fetching kegiatan:', { kategoriUtama, jenis });

      const { data, error } = await supabase
        .from('kategori_poin')
        .select('id, kode, nama, kategori_utama, bobot, jenis, deskripsi')
        .eq('kategori_utama', kategoriUtama)
        .eq('jenis', jenis)
        .eq('is_active', true)
        .order('bobot', { ascending: false });

      if (error) {
        console.error('❌ Error fetching kegiatan:', error);
      } else {
        console.log('✅ Kegiatan fetched:', { count: data?.length, data });
        setKegiatanList(data || []);
      }
    } catch (error) {
      console.error('❌ Error fetching kegiatan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort
  const filteredKegiatan = kegiatanList
    .filter((item) =>
      item.nama.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'poin') {
        return b.bobot - a.bobot;
      } else {
        return a.nama.localeCompare(b.nama);
      }
    });

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
      default:
        return '📚';
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 bg-card border-b border-border`}>
        <div className="max-w-3xl mx-auto w-full flex items-center justify-between">
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
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
          {/* Search */}
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

          {/* Filter */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Filter:</p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'poin' | 'nama')}
              className="px-4 py-2 rounded-xl bg-input border border-border text-sm font-medium text-foreground"
            >
              <option value="poin">Poin Tertinggi</option>
              <option value="nama">Nama A-Z</option>
            </select>
          </div>

          {/* List Kegiatan */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Icon icon="svg-spinners:ring-resize" className="size-8 text-primary" />
            </div>
          ) : filteredKegiatan.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Tidak ada kegiatan ditemukan</p>
            </div>
          ) : (
            <div className="space-y-3 pb-4">
              {filteredKegiatan.map((item) => (
                <div
                  key={item.id}
                  className="bg-card rounded-2xl p-4 shadow-sm border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center size-12 rounded-full bg-secondary shrink-0">
                      <span className="text-2xl">{getEmojiByKategori(kategoriUtama)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-foreground mb-1">{item.nama}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.deskripsi || 'Tidak ada deskripsi'}
                      </p>
                    </div>
                    <div className={`flex items-center justify-center px-3 py-1 rounded-full shrink-0 ${jenis === 'negatif' ? 'bg-destructive/10' : 'bg-accent'}`}>
                      <span className={`text-sm font-bold ${jenis === 'negatif' ? 'text-destructive' : 'text-accent-foreground'}`}>
                        {jenis === 'negatif' ? '-' : '+'}{item.bobot}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

