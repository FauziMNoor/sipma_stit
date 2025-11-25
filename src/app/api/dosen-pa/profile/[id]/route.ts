import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Force dynamic rendering to prevent build-time data collection
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // 1. Fetch dosen data
    const { data: dosen, error: dosenError } = await supabaseAdmin
      .from('users')
      .select('id, nama, nip, email, foto')
      .eq('id', id)
      .eq('role', 'dosen_pa')
      .single();

    if (dosenError || !dosen) {
      return NextResponse.json(
        { success: false, error: 'Dosen not found' },
        { status: 404 }
      );
    }

    // 2. Count total mahasiswa bimbingan
    const { count: totalMahasiswa, error: mahasiswaError } = await supabaseAdmin
      .from('mahasiswa')
      .select('*', { count: 'exact', head: true })
      .eq('dosen_pa_id', id)
      .eq('is_active', true);

    if (mahasiswaError) {
      console.error('Error counting mahasiswa:', mahasiswaError);
    }

    // 3. Count total verifikasi (approved aktivitas kategori Akademik dari SEMUA mahasiswa)
    // NOTE: Dosen PA bisa approve kategori Akademik dari SEMUA mahasiswa
    let totalVerifikasi = 0;

    // Get all kategori IDs for Akademik
    const { data: kategoriAkademik, error: kategoriError } = await supabaseAdmin
      .from('kategori_poin')
      .select('id')
      .eq('kategori_utama', 'Akademik');

    if (kategoriError) {
      console.error('Error fetching kategori akademik:', kategoriError);
    }

    const kategoriAkademikIds = kategoriAkademik?.map((k) => k.id) || [];

    if (kategoriAkademikIds.length > 0) {
      const { count: verifikasiCount, error: verifikasiError } = await supabaseAdmin
        .from('poin_aktivitas')
        .select('*', { count: 'exact', head: true })
        .in('kategori_id', kategoriAkademikIds)
        .eq('status', 'approved');

      if (!verifikasiError) {
        totalVerifikasi = verifikasiCount || 0;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: dosen.id,
        nip: dosen.nip,
        nama: dosen.nama,
        email: dosen.email,
        foto: dosen.foto,
        total_mahasiswa_bimbingan: totalMahasiswa || 0,
        total_verifikasi: totalVerifikasi,
      },
    });
  } catch (error) {
    console.error('Error in profile API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

