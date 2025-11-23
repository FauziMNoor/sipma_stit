import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

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

    // 3. Get mahasiswa IDs
    const { data: mahasiswaList, error: mahasiswaListError } = await supabaseAdmin
      .from('mahasiswa')
      .select('id')
      .eq('dosen_pa_id', id)
      .eq('is_active', true);

    if (mahasiswaListError) {
      console.error('Error fetching mahasiswa list:', mahasiswaListError);
    }

    const mahasiswaIds = mahasiswaList?.map((m) => m.id) || [];

    // 4. Count total verifikasi (approved aktivitas)
    let totalVerifikasi = 0;

    if (mahasiswaIds.length > 0) {
      const { count: verifikasiCount, error: verifikasiError } = await supabaseAdmin
        .from('poin_aktivitas')
        .select('*', { count: 'exact', head: true })
        .in('mahasiswa_id', mahasiswaIds)
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

