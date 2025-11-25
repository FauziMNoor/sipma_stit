import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyJWT } from '@/lib/auth';
import RiwayatVerifikasiMusyrif from '@/components/RiwayatVerifikasiMusyrif';

export const metadata: Metadata = {
  title: 'Riwayat Verifikasi | SIPMA',
  description: 'Riwayat verifikasi kegiatan Adab mahasiswa',
};

export default async function RiwayatMusyrifPage() {
  // Get auth token
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    redirect('/login');
  }

  // Verify JWT and get user info
  let payload;
  try {
    payload = verifyJWT(token);
  } catch (error) {
    redirect('/login');
  }

  const userId = payload.userId;

  return <RiwayatVerifikasiMusyrif userId={userId} />;
}
