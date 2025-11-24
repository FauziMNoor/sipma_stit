'use client';

import RiwayatKegiatanByKategori from '@/components/RiwayatKegiatanByKategori';

export default function PelanggaranPage() {
  return (
    <RiwayatKegiatanByKategori
      kategoriUtama="Pelanggaran"
      title="Pelanggaran"
      icon="solar:danger-bold"
      color="text-destructive"
    />
  );
}

