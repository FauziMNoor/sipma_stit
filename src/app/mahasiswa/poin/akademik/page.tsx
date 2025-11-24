'use client';

import RiwayatKegiatanByKategori from '@/components/RiwayatKegiatanByKategori';

export default function AkademikPage() {
  return (
    <RiwayatKegiatanByKategori
      kategoriUtama="Akademik"
      title="Kegiatan Akademik"
      icon="solar:book-bold"
      color="text-primary"
    />
  );
}

