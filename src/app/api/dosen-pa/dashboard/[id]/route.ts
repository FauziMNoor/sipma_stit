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

    // 3. Count pengajuan statistics (kategori Akademik dari SEMUA mahasiswa)
    // NOTE: Dosen PA bisa approve kategori Akademik dari SEMUA mahasiswa
    let totalPengajuan = 0;
    let diverifikasi = 0;
    let pending = 0;

    // First, get all kategori IDs for Akademik
    const { data: kategoriAkademik, error: kategoriError } = await supabaseAdmin
      .from('kategori_poin')
      .select('id')
      .eq('kategori_utama', 'Akademik');

    if (kategoriError) {
      console.error('Error fetching kategori akademik:', kategoriError);
    }

    const kategoriAkademikIds = kategoriAkademik?.map((k) => k.id) || [];

    if (kategoriAkademikIds.length > 0) {
      // Total pengajuan Akademik
      const { count: totalCount, error: totalError } = await supabaseAdmin
        .from('poin_aktivitas')
        .select('*', { count: 'exact', head: true })
        .in('kategori_id', kategoriAkademikIds);

      if (!totalError) {
        totalPengajuan = totalCount || 0;
      }

      // Diverifikasi (approved) Akademik
      const { count: approvedCount, error: approvedError } = await supabaseAdmin
        .from('poin_aktivitas')
        .select('*', { count: 'exact', head: true })
        .in('kategori_id', kategoriAkademikIds)
        .eq('status', 'approved');

      if (!approvedError) {
        diverifikasi = approvedCount || 0;
      }

      // Pending Akademik
      const { count: pendingCount, error: pendingError } = await supabaseAdmin
        .from('poin_aktivitas')
        .select('*', { count: 'exact', head: true })
        .in('kategori_id', kategoriAkademikIds)
        .eq('status', 'pending');

      if (!pendingError) {
        pending = pendingCount || 0;
      }
    }

    // 4. Get recent pending activities for Akademik category (last 10)
    let recentActivities: any[] = [];
    if (kategoriAkademikIds.length > 0) {
      const { data: activities, error: activitiesError } = await supabaseAdmin
        .from('poin_aktivitas')
        .select(`
          id,
          deskripsi_kegiatan,
          tanggal,
          status,
          created_at,
          mahasiswa:mahasiswa_id (
            id,
            nama,
            nim,
            foto
          ),
          kategori_poin:kategori_id (
            nama
          )
        `)
        .in('kategori_id', kategoriAkademikIds)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10);

      if (!activitiesError && activities) {
        recentActivities = activities.map((activity: any) => ({
          id: activity.id,
          mahasiswa_nama: activity.mahasiswa?.nama || '',
          mahasiswa_nim: activity.mahasiswa?.nim || '',
          mahasiswa_foto: activity.mahasiswa?.foto || null,
          deskripsi_kegiatan: activity.deskripsi_kegiatan || '',
          kategori_nama: activity.kategori_poin?.nama || '',
          tanggal: activity.tanggal,
          status: activity.status,
          created_at: activity.created_at,
        }));
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
        recent_activities: recentActivities,
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

