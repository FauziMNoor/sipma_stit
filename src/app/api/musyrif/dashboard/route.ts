import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyJWT } from '@/lib/auth';

// Force dynamic rendering to prevent build-time data collection
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


/**
 * GET /api/musyrif/dashboard
 * Get dashboard data for Musyrif
 */
export async function GET(request: NextRequest) {
  try {
    // Get token from cookie or Authorization header
    let token = request.cookies.get('auth-token')?.value;

    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - No token' },
        { status: 401 }
      );
    }

    // Verify JWT and get user info
    let payload;
    try {
      payload = verifyJWT(token);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    const userId = payload.userId;

    // Get musyrif data
    const { data: musyrifData, error: musyrifError } = await supabaseAdmin
      .from('users')
      .select('id, nama, email, foto')
      .eq('id', userId)
      .eq('role', 'musyrif')
      .single();

    if (musyrifError || !musyrifData) {
      return NextResponse.json(
        { success: false, error: 'Musyrif tidak ditemukan' },
        { status: 404 }
      );
    }

    // Get mahasiswa count under this musyrif
    const { count: mahasiswaCount } = await supabaseAdmin
      .from('mahasiswa')
      .select('*', { count: 'exact', head: true })
      .eq('musyrif_id', userId)
      .eq('is_active', true);

    // Get pending verifications for Adab & Asrama categories
    const { data: pendingData, count: pendingCount } = await supabaseAdmin
      .from('poin_aktivitas')
      .select(`
        *,
        mahasiswa:mahasiswa_id (
          id,
          nim,
          nama,
          foto,
          musyrif_id
        ),
        kategori_poin:kategori_id (
          id,
          kode,
          nama,
          jenis,
          bobot,
          kategori_utama
        )
      `, { count: 'exact' })
      .eq('status', 'pending')
      .in('kategori_poin.kategori_utama', ['Adab', 'Pelanggaran'])
      .order('created_at', { ascending: false });

    // Filter only mahasiswa under this musyrif
    const filteredPending = pendingData?.filter(
      (item: any) => item.mahasiswa?.musyrif_id === userId
    ) || [];

    // Get approved activities this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: approvedThisMonth } = await supabaseAdmin
      .from('poin_aktivitas')
      .select(`
        *,
        mahasiswa:mahasiswa_id (
          musyrif_id
        )
      `, { count: 'exact', head: true })
      .eq('status', 'approved')
      .eq('mahasiswa.musyrif_id', userId)
      .gte('verified_at', startOfMonth.toISOString());

    // Get recent activities (last 10)
    const { data: recentActivities } = await supabaseAdmin
      .from('poin_aktivitas')
      .select(`
        id,
        tanggal,
        status,
        deskripsi_kegiatan,
        created_at,
        mahasiswa:mahasiswa_id (
          id,
          nim,
          nama,
          foto,
          musyrif_id
        ),
        kategori_poin:kategori_id (
          id,
          nama,
          jenis,
          bobot,
          kategori_utama
        )
      `)
      .in('kategori_poin.kategori_utama', ['Adab', 'Pelanggaran'])
      .order('created_at', { ascending: false })
      .limit(20);

    // Filter and limit to 10
    const filteredRecent = recentActivities
      ?.filter((item: any) => item.mahasiswa?.musyrif_id === userId)
      .slice(0, 10) || [];

    return NextResponse.json({
      success: true,
      data: {
        musyrif: musyrifData,
        summary: {
          pendingCount: filteredPending.length,
          mahasiswaCount: mahasiswaCount || 0,
          approvedThisMonth: approvedThisMonth || 0,
        },
        recentActivities: filteredRecent,
      },
    });
  } catch (error: any) {
    console.error('❌ Error in GET /api/musyrif/dashboard:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

