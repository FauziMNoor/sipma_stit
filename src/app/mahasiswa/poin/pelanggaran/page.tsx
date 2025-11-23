'use client';

import KategoriPoinMahasiswa from '@/components/KategoriPoinMahasiswa';

export default function PelanggaranPage() {
  return (
    <KategoriPoinMahasiswa
      kategoriUtama="Pelanggaran"
      title="Pelanggaran"
      icon="solar:danger-bold"
      color="text-destructive"
    />
  );
}

