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

    // 1. Fetch waket3 data
    const { data: waket3, error: waket3Error } = await supabaseAdmin
      .from('users')
      .select('id, nama, nip, email, foto')
      .eq('id', id)
      .eq('role', 'waket3')
      .single();

    if (waket3Error || !waket3) {
      return NextResponse.json(
        { success: false, error: 'Waket3 not found' },
        { status: 404 }
      );
    }

    // 2. Get kategori IDs for Dakwah, Sosial, and Pelanggaran (Waket3 handles these)
    // Note: Adab dihandle oleh Musyrif
    const { data: kategoriWaket3, error: kategoriError } = await supabaseAdmin
      .from('kategori_poin')
      .select('id')
      .in('kategori_utama', ['Dakwah', 'Sosial', 'Pelanggaran']);

    if (kategoriError) {
      console.error('Error fetching kategori:', kategoriError);
    }

    const kategoriIds = kategoriWaket3?.map((k) => k.id) || [];

    // Count pengajuan statistics (only Dakwah, Sosial, and Pelanggaran)
    // Total pengajuan
    const { count: totalPengajuan, error: totalError } = await supabaseAdmin
      .from('poin_aktivitas')
      .select('*', { count: 'exact', head: true })
      .in('kategori_id', kategoriIds);

    if (totalError) {
      console.error('Error counting total pengajuan:', totalError);
    }

    // Diverifikasi (approved)
    const { count: diverifikasi, error: approvedError } = await supabaseAdmin
      .from('poin_aktivitas')
      .select('*', { count: 'exact', head: true })
      .in('kategori_id', kategoriIds)
      .eq('status', 'approved');

    if (approvedError) {
      console.error('Error counting approved:', approvedError);
    }

    // Pending
    const { count: pending, error: pendingError } = await supabaseAdmin
      .from('poin_aktivitas')
      .select('*', { count: 'exact', head: true })
      .in('kategori_id', kategoriIds)
      .eq('status', 'pending');

    if (pendingError) {
      console.error('Error counting pending:', pendingError);
    }

    // Ditolak
    const { count: ditolak, error: rejectedError } = await supabaseAdmin
      .from('poin_aktivitas')
      .select('*', { count: 'exact', head: true })
      .in('kategori_id', kategoriIds)
      .eq('status', 'rejected');

    if (rejectedError) {
      console.error('Error counting rejected:', rejectedError);
    }

    // 3. Get recent pending activities (limit 5, only Dakwah, Sosial, and Pelanggaran)
    const { data: recentActivities, error: activitiesError } = await supabaseAdmin
      .from('poin_aktivitas')
      .select(`
        id,
        deskripsi_kegiatan,
        tanggal,
        status,
        created_at,
        mahasiswa:mahasiswa_id (
          nama,
          nim,
          foto
        ),
        kategori_poin:kategori_id (
          nama,
          bobot,
          kategori_utama
        )
      `)
      .in('kategori_id', kategoriIds)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(5);

    if (activitiesError) {
      console.error('Error fetching recent activities:', activitiesError);
    }

    // Format recent activities
    const formattedActivities = (recentActivities || []).map((activity: any) => ({
      id: activity.id,
      mahasiswa_nama: activity.mahasiswa?.nama || 'Unknown',
      mahasiswa_nim: activity.mahasiswa?.nim || 'Unknown',
      mahasiswa_foto: activity.mahasiswa?.foto || null,
      deskripsi_kegiatan: activity.deskripsi_kegiatan,
      kategori_nama: activity.kategori_poin?.nama || 'Unknown',
      kategori_poin: activity.kategori_poin?.poin || 0,
      tanggal: activity.tanggal,
      status: activity.status,
      created_at: activity.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: {
        waket3: {
          id: waket3.id,
          nama: waket3.nama,
          nip: waket3.nip,
          email: waket3.email,
          foto: waket3.foto,
        },
        stats: {
          total_pengajuan: totalPengajuan || 0,
          diverifikasi: diverifikasi || 0,
          pending: pending || 0,
          ditolak: ditolak || 0,
        },
        recent_activities: formattedActivities,
      },
    });
  } catch (error) {
    console.error('Error in waket3 dashboard API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

