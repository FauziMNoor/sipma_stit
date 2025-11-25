import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyJWT } from '@/lib/auth';

// Force dynamic rendering to prevent build-time data collection
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/musyrif/riwayat-pelanggaran
 * Get all Pelanggaran records (for monitoring/tracking only)
 * Musyrif can input but cannot approve Pelanggaran (Waket3 approves)
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
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status') || 'all';

    console.log('🔍 [MUSYRIF RIWAYAT PELANGGARAN] User ID:', userId);
    console.log('🔍 Status filter:', statusFilter);

    // 1. Fetch all aktivitas
    let aktivitasQuery = supabaseAdmin
      .from('poin_aktivitas')
      .select(`
        id,
        tanggal,
        status,
        bukti,
        deskripsi_kegiatan,
        notes_verifikator,
        verified_at,
        verifikator_id,
        created_at,
        mahasiswa_id,
        kategori_id
      `)
      .order('created_at', { ascending: false });

    // Filter by status if needed
    if (statusFilter !== 'all') {
      aktivitasQuery = aktivitasQuery.eq('status', statusFilter);
    }

    const { data: aktivitas, error: aktivitasError } = await aktivitasQuery;

    if (aktivitasError) {
      console.error('❌ Error fetching aktivitas:', aktivitasError);
      return NextResponse.json(
        { success: false, error: 'Gagal mengambil data pelanggaran' },
        { status: 500 }
      );
    }

    console.log('📝 Total aktivitas fetched:', aktivitas?.length || 0);

    // 2. Get unique mahasiswa IDs and kategori IDs
    const mahasiswaIds = [...new Set(aktivitas?.map((a: any) => a.mahasiswa_id) || [])];
    const kategoriIds = [...new Set(aktivitas?.map((a: any) => a.kategori_id) || [])];

    // 3. Fetch mahasiswa details
    const { data: mahasiswaDetails, error: mahasiswaError } = await supabaseAdmin
      .from('mahasiswa')
      .select('id, nim, nama, foto')
      .in('id', mahasiswaIds);

    if (mahasiswaError) {
      console.error('❌ Error fetching mahasiswa:', mahasiswaError);
    }

    console.log('👥 Mahasiswa details fetched:', mahasiswaDetails?.length || 0);

    // 4. Fetch kategori Pelanggaran only
    const { data: kategoriDetails, error: kategoriError } = await supabaseAdmin
      .from('kategori_poin')
      .select('id, kode, nama, jenis, bobot, kategori_utama')
      .in('id', kategoriIds)
      .eq('kategori_utama', 'Pelanggaran');

    if (kategoriError) {
      console.error('❌ Error fetching kategori:', kategoriError);
    }

    console.log('📋 Kategori Pelanggaran fetched:', kategoriDetails?.length || 0);

    // 5. Create maps for quick lookup
    const mahasiswaMap = new Map(mahasiswaDetails?.map((m: any) => [m.id, m]) || []);
    const kategoriMap = new Map(kategoriDetails?.map((k: any) => [k.id, k]) || []);

    // 6. Map and filter data - only Pelanggaran
    let formattedData = aktivitas?.map((item: any) => {
      const mahasiswa = mahasiswaMap.get(item.mahasiswa_id);
      const kategori = kategoriMap.get(item.kategori_id);

      // Skip if not Pelanggaran
      if (!kategori) return null;

      return {
        id: item.id,
        mahasiswa: {
          id: mahasiswa?.id || '',
          nim: mahasiswa?.nim || '',
          nama: mahasiswa?.nama || 'Unknown',
          foto: mahasiswa?.foto || null,
        },
        kategori: {
          id: kategori.id,
          kode: kategori.kode,
          nama: kategori.nama,
          jenis: kategori.jenis,
          bobot: kategori.bobot,
          kategori_utama: kategori.kategori_utama,
        },
        tanggal: item.tanggal,
        status: item.status,
        bukti: item.bukti,
        deskripsi_kegiatan: item.deskripsi_kegiatan,
        notes_verifikator: item.notes_verifikator,
        verified_at: item.verified_at,
        verifikator_id: item.verifikator_id,
        created_at: item.created_at,
      };
    }).filter((item: any) => item !== null) || [];

    console.log('📊 Total Pelanggaran:', formattedData.length);

    // 7. Calculate counts
    const counts = {
      all: formattedData.length,
      pending: formattedData.filter((item: any) => item.status === 'pending').length,
      approved: formattedData.filter((item: any) => item.status === 'approved').length,
      rejected: formattedData.filter((item: any) => item.status === 'rejected').length,
    };

    console.log('📊 Counts:', counts);
    console.log('✅ Returning', formattedData.length, 'items to frontend');

    return NextResponse.json({
      success: true,
      data: formattedData,
      counts,
    });
  } catch (error: any) {
    console.error('❌ Error in GET /api/musyrif/riwayat-pelanggaran:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
