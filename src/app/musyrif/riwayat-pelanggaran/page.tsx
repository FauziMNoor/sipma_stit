import { Metadata } from 'next';
import RiwayatPelanggaranMusyrif from '@/components/RiwayatPelanggaranMusyrif';

export const metadata: Metadata = {
  title: 'Riwayat Pelanggaran | SIPMA',
  description: 'Monitoring riwayat pelanggaran mahasiswa',
};

export default function RiwayatPelanggaranPage() {
  return <RiwayatPelanggaranMusyrif />;
}
