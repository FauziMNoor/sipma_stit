import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyJWT } from '@/lib/auth';

// Force dynamic rendering to prevent build-time data collection
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


/**
 * GET /api/musyrif/verifikasi
 * Get all pengajuan for Adab & Asrama verification
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
    const searchQuery = searchParams.get('search') || '';

    // Build query
    let query = supabaseAdmin
      .from('poin_aktivitas')
      .select(`
        id,
        tanggal,
        status,
        bukti,
        deskripsi_kegiatan,
        notes_verifikator,
        verified_at,
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
          kode,
          nama,
          jenis,
          bobot,
          kategori_utama
        )
      `)
      .in('kategori_poin.kategori_utama', ['Adab', 'Pelanggaran'])
      .order('created_at', { ascending: false });

    // Filter by status
    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error fetching pengajuan:', error);
      return NextResponse.json(
        { success: false, error: 'Gagal mengambil data pengajuan' },
        { status: 500 }
      );
    }

    // Filter only mahasiswa under this musyrif
    let filteredData = data?.filter(
      (item: any) => item.mahasiswa?.musyrif_id === userId
    ) || [];

    // Search filter
    if (searchQuery) {
      const lowerSearch = searchQuery.toLowerCase();
      filteredData = filteredData.filter((item: any) =>
        item.mahasiswa?.nama?.toLowerCase().includes(lowerSearch) ||
        item.mahasiswa?.nim?.toLowerCase().includes(lowerSearch) ||
        item.kategori_poin?.nama?.toLowerCase().includes(lowerSearch)
      );
    }

    // Calculate counts
    const allData = data?.filter(
      (item: any) => item.mahasiswa?.musyrif_id === userId
    ) || [];
    
    const counts = {
      all: allData.length,
      pending: allData.filter((item: any) => item.status === 'pending').length,
      approved: allData.filter((item: any) => item.status === 'approved').length,
      rejected: allData.filter((item: any) => item.status === 'rejected').length,
    };

    // Format data
    const formattedData = filteredData.map((item: any) => ({
      id: item.id,
      mahasiswa: {
        id: item.mahasiswa?.id,
        nim: item.mahasiswa?.nim,
        nama: item.mahasiswa?.nama,
        foto: item.mahasiswa?.foto,
      },
      kategori: {
        id: item.kategori_poin?.id,
        kode: item.kategori_poin?.kode,
        nama: item.kategori_poin?.nama,
        jenis: item.kategori_poin?.jenis,
        bobot: item.kategori_poin?.bobot,
        kategori_utama: item.kategori_poin?.kategori_utama,
      },
      tanggal: item.tanggal,
      status: item.status,
      bukti: item.bukti,
      deskripsi_kegiatan: item.deskripsi_kegiatan,
      notes_verifikator: item.notes_verifikator,
      verified_at: item.verified_at,
      created_at: item.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: formattedData,
      counts,
    });
  } catch (error: any) {
    console.error('❌ Error in GET /api/musyrif/verifikasi:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

