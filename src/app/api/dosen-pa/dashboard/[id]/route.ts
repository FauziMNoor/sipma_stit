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

    // 3. Get mahasiswa IDs for this dosen
    const { data: mahasiswaList, error: mahasiswaListError } = await supabaseAdmin
      .from('mahasiswa')
      .select('id')
      .eq('dosen_pa_id', id)
      .eq('is_active', true);

    if (mahasiswaListError) {
      console.error('Error fetching mahasiswa list:', mahasiswaListError);
    }

    const mahasiswaIds = mahasiswaList?.map((m) => m.id) || [];

    // 4. Count pengajuan statistics (only from mahasiswa bimbingan)
    let totalPengajuan = 0;
    let diverifikasi = 0;
    let pending = 0;

    if (mahasiswaIds.length > 0) {
      // Total pengajuan
      const { count: totalCount, error: totalError } = await supabaseAdmin
        .from('poin_aktivitas')
        .select('*', { count: 'exact', head: true })
        .in('mahasiswa_id', mahasiswaIds);

      if (!totalError) {
        totalPengajuan = totalCount || 0;
      }

      // Diverifikasi (approved)
      const { count: approvedCount, error: approvedError } = await supabaseAdmin
        .from('poin_aktivitas')
        .select('*', { count: 'exact', head: true })
        .in('mahasiswa_id', mahasiswaIds)
        .eq('status', 'approved');

      if (!approvedError) {
        diverifikasi = approvedCount || 0;
      }

      // Pending
      const { count: pendingCount, error: pendingError } = await supabaseAdmin
        .from('poin_aktivitas')
        .select('*', { count: 'exact', head: true })
        .in('mahasiswa_id', mahasiswaIds)
        .eq('status', 'pending');

      if (!pendingError) {
        pending = pendingCount || 0;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        dosen: {
          id: dosen.id,
          nama: dosen.nama,
          nip: dosen.nip,
          email: dosen.email,
          foto: dosen.foto,
        },
        stats: {
          total_pengajuan: totalPengajuan,
          diverifikasi: diverifikasi,
          pending: pending,
          total_mahasiswa_bimbingan: totalMahasiswa || 0,
        },
      },
    });
  } catch (error) {
    console.error('Error in dosen-pa dashboard API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

