import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { verifyJWT } from '@/lib/auth';

// Force dynamic rendering to prevent build-time data collection
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


/**
 * GET /api/mahasiswa/kegiatan
 * Get all activities for a mahasiswa with optional status filter
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mahasiswa_id = searchParams.get('mahasiswa_id');
    const status = searchParams.get('status');

    if (!mahasiswa_id) {
      return NextResponse.json(
        { success: false, error: 'mahasiswa_id is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('poin_aktivitas')
      .select(`
        id,
        tanggal,
        deskripsi_kegiatan,
        status,
        bukti,
        created_at,
        kategori_poin:kategori_id (
          id,
          kode,
          nama,
          kategori_utama,
          jenis,
          bobot
        )
      `)
      .eq('mahasiswa_id', mahasiswa_id)
      .order('tanggal', { ascending: false });

    // Apply status filter if provided
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: activities, error } = await query;

    if (error) {
      console.error('Error fetching activities:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch activities' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: activities || [],
    });
  } catch (error: any) {
    console.error('❌ Error in GET /api/mahasiswa/kegiatan:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/mahasiswa/kegiatan
 * Submit new activity for verification
 */
export async function POST(request: NextRequest) {
  try {
    // Get token from Authorization header or cookie
    const authHeader = request.headers.get('authorization');
    let token: string | undefined;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      token = request.cookies.get('auth-token')?.value;
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Tidak terautentikasi' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyJWT(token);
    if (payload.role !== 'mahasiswa') {
      return NextResponse.json(
        { success: false, error: 'Hanya mahasiswa yang bisa mengajukan kegiatan' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { kategori_poin_id, tanggal, keterangan, bukti } = body;

    console.log('📝 Request body:', { kategori_poin_id, tanggal, keterangan, bukti: bukti ? 'ada' : 'tidak ada' });

    // Validation
    if (!kategori_poin_id || !tanggal || !keterangan) {
      return NextResponse.json(
        { success: false, error: 'Kategori, tanggal, dan keterangan harus diisi' },
        { status: 400 }
      );
    }

    // Get kategori poin details
    const { data: kategori, error: kategoriError } = await supabase
      .from('kategori_poin')
      .select('id, bobot, jenis')
      .eq('id', kategori_poin_id)
      .single();

    if (kategoriError || !kategori) {
      console.error('Error fetching kategori:', kategoriError);
      return NextResponse.json(
        { success: false, error: 'Kategori tidak ditemukan' },
        { status: 404 }
      );
    }

    console.log('📊 Kategori found:', kategori);

    // Determine semester_type based on tanggal
    const tanggalObj = new Date(tanggal);
    const month = tanggalObj.getMonth() + 1; // 1-12
    const semester_type = (month >= 2 && month <= 7) ? 'genap' : 'ganjil';

    // Get current tahun ajaran (you can make this dynamic later)
    const tahun_ajaran = '2024/2025';

    // Insert poin_aktivitas
    // Note: Column name is 'kategori_id' not 'kategori_poin_id'
    const insertData = {
      mahasiswa_id: payload.userId,
      kategori_id: kategori_poin_id,  // Changed from kategori_poin_id
      tanggal,
      deskripsi_kegiatan: keterangan,  // Changed from keterangan
      bukti,
      status: 'pending',  // Changed from status_verifikasi
      tahun_ajaran,       // Required field
      semester_type,      // Required field
    };

    console.log('📝 Insert data:', insertData);

    // Use supabaseAdmin to bypass RLS
    const { data: aktivitas, error: aktivitasError } = await supabaseAdmin
      .from('poin_aktivitas')
      .insert(insertData)
      .select()
      .single();

    if (aktivitasError) {
      console.error('Error inserting aktivitas:', aktivitasError);
      return NextResponse.json(
        { success: false, error: 'Gagal menyimpan kegiatan' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: aktivitas,
      message: 'Kegiatan berhasil diajukan',
    });
  } catch (error: any) {
    console.error('❌ Error in POST /api/mahasiswa/kegiatan:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

