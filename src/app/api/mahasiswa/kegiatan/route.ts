import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { verifyJWT } from '@/lib/auth';

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

