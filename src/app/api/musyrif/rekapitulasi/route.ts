import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Force dynamic rendering to prevent build-time data collection
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


export async function GET(request: NextRequest) {
  try {
    // Fetch all mahasiswa
    const { data: mahasiswaList, error: mahasiswaError } = await supabaseAdmin
      .from('mahasiswa')
      .select('id, nama, nim, prodi, foto')
      .eq('is_active', true)
      .order('nama', { ascending: true });

    if (mahasiswaError) {
      console.error('Error fetching mahasiswa:', mahasiswaError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch mahasiswa' },
        { status: 500 }
      );
    }

    // For each mahasiswa, calculate stats
    const rekapitulasi = await Promise.all(
      (mahasiswaList || []).map(async (mhs) => {
        // Count approved
        const { count: approved } = await supabaseAdmin
          .from('poin_aktivitas')
          .select('*', { count: 'exact', head: true })
          .eq('mahasiswa_id', mhs.id)
          .eq('status', 'approved');

        // Count pending
        const { count: pending } = await supabaseAdmin
          .from('poin_aktivitas')
          .select('*', { count: 'exact', head: true })
          .eq('mahasiswa_id', mhs.id)
          .eq('status', 'pending');

        // Count rejected
        const { count: rejected } = await supabaseAdmin
          .from('poin_aktivitas')
          .select('*', { count: 'exact', head: true })
          .eq('mahasiswa_id', mhs.id)
          .eq('status', 'rejected');

        // Calculate total poin from approved activities
        const { data: approvedActivities } = await supabaseAdmin
          .from('poin_aktivitas')
          .select(`
            kategori_poin:kategori_id (
              bobot,
              jenis
            )
          `)
          .eq('mahasiswa_id', mhs.id)
          .eq('status', 'approved');

        // Calculate total poin (consider positif/negatif)
        let totalPoin = 0;
        (approvedActivities || []).forEach((item: any) => {
          const bobot = item.kategori_poin?.bobot || 0;
          const jenis = item.kategori_poin?.jenis || 'positif';
          
          if (jenis === 'positif') {
            totalPoin += bobot;
          } else if (jenis === 'negatif') {
            totalPoin -= bobot;
          }
        });

        return {
          mahasiswa_id: mhs.id,
          mahasiswa_nama: mhs.nama,
          mahasiswa_nim: mhs.nim,
          mahasiswa_prodi: mhs.prodi,
          mahasiswa_foto: mhs.foto,
          total_poin: totalPoin,
          total_approved: approved || 0,
          total_pending: pending || 0,
          total_rejected: rejected || 0,
        };
      })
    );

    // Sort by total_poin descending
    rekapitulasi.sort((a, b) => b.total_poin - a.total_poin);

    return NextResponse.json({
      success: true,
      data: rekapitulasi,
    });
  } catch (error) {
    console.error('Error in musyrif rekapitulasi API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
