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

    // Get kategori IDs for Adab only (dashboard shows only Adab for verification)
    // Note: Pelanggaran will be shown in separate "Riwayat Pelanggaran" page
    const { data: kategoriAdab, error: kategoriError } = await supabaseAdmin
      .from('kategori_poin')
      .select('id, nama, kategori_utama, jenis, bobot, kode')
      .eq('kategori_utama', 'Adab');

    if (kategoriError) {
      console.error('Error fetching kategori:', kategoriError);
    }

    const kategoriIds = kategoriAdab?.map((k) => k.id) || [];
    console.log('📋 Kategori IDs for Adab only (dashboard):', kategoriIds);

    // Get pending verifications for Adab only (Pelanggaran shown in separate page)
    const { data: pendingData } = await supabaseAdmin
      .from('poin_aktivitas')
      .select(`
        id,
        tanggal,
        status,
        bukti,
        deskripsi_kegiatan,
        created_at,
        mahasiswa_id,
        kategori_id
      `)
      .in('kategori_id', kategoriIds)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    console.log('📝 Total pending data fetched:', pendingData?.length || 0);

    // Get unique mahasiswa IDs from pending data
    const pendingMahasiswaIds = [...new Set(pendingData?.map((a: any) => a.mahasiswa_id) || [])];
    
    // Fetch mahasiswa details for pending
    const { data: pendingMahasiswaDetails } = await supabaseAdmin
      .from('mahasiswa')
      .select('id, nim, nama, foto, musyrif_id')
      .in('id', pendingMahasiswaIds);

    console.log('👥 Mahasiswa details fetched:', pendingMahasiswaDetails?.length || 0);

    // Create maps
    const kategoriMap = new Map(kategoriAdab?.map((k: any) => [k.id, k]) || []);
    const mahasiswaMap = new Map(pendingMahasiswaDetails?.map((m: any) => [m.id, m]) || []);

    // Map and filter pending data
    // NOTE: Only show Adab in dashboard (Pelanggaran has separate riwayat page)
    const filteredPending = pendingData?.map((item: any) => {
      const mahasiswa = mahasiswaMap.get(item.mahasiswa_id);
      const kategori = kategoriMap.get(item.kategori_id);

      // Skip if mahasiswa not found
      if (!mahasiswa) {
        console.log('⏭️ Skipping - mahasiswa not found');
        return null;
      }

      console.log('✅ Including pending activity:', {
        mahasiswa: mahasiswa?.nama,
        kategori: kategori?.nama,
        status: item.status
      });

      return {
        ...item,
        mahasiswa,
        kategori_poin: kategori
      };
    }).filter((item: any) => item !== null) || [];

    console.log('✅ Filtered pending count:', filteredPending.length);

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

    // Get recent activities (last 50, then filter to 10)
    const { data: recentActivities } = await supabaseAdmin
      .from('poin_aktivitas')
      .select(`
        id,
        tanggal,
        status,
        deskripsi_kegiatan,
        created_at,
        mahasiswa_id,
        kategori_id
      `)
      .in('kategori_id', kategoriIds)
      .order('created_at', { ascending: false })
      .limit(50);

    console.log('📝 Total recent activities fetched:', recentActivities?.length || 0);

    // Get unique mahasiswa IDs from recent activities
    const recentMahasiswaIds = [...new Set(recentActivities?.map((a: any) => a.mahasiswa_id) || [])];
    
    // Fetch mahasiswa details for recent
    const { data: recentMahasiswaDetails } = await supabaseAdmin
      .from('mahasiswa')
      .select('id, nim, nama, foto, musyrif_id')
      .in('id', recentMahasiswaIds);

    // Create mahasiswa map for recent
    const recentMahasiswaMap = new Map(recentMahasiswaDetails?.map((m: any) => [m.id, m]) || []);

    // Filter and limit to 10
    // NOTE: Show activities from ALL mahasiswa (no musyrif_id filter)
    const filteredRecent = recentActivities
      ?.map((item: any) => {
        const mahasiswa = recentMahasiswaMap.get(item.mahasiswa_id);
        const kategori = kategoriMap.get(item.kategori_id);

        // Skip if mahasiswa not found
        if (!mahasiswa) return null;

        return {
          ...item,
          mahasiswa,
          kategori_poin: kategori
        };
      })
      .filter((item: any) => item !== null)
      .slice(0, 10) || [];

    console.log('✅ Filtered recent count:', filteredRecent.length);

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

