import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyJWT } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/musyrif/pelanggaran
 * Musyrif input pelanggaran mahasiswa (Waket3 yang approve)
 */
export async function POST(request: NextRequest) {
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

    if (payload.role !== 'musyrif') {
      return NextResponse.json(
        { success: false, error: 'Hanya musyrif yang bisa input pelanggaran' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { mahasiswa_id, kategori_poin_id, tanggal, keterangan, bukti } = body;

    // Validation
    if (!mahasiswa_id || !kategori_poin_id || !tanggal || !keterangan) {
      return NextResponse.json(
        { success: false, error: 'Mahasiswa, kategori, tanggal, dan keterangan harus diisi' },
        { status: 400 }
      );
    }

    // Verify kategori is Pelanggaran
    const { data: kategori, error: kategoriError } = await supabaseAdmin
      .from('kategori_poin')
      .select('id, nama, bobot, jenis, kategori_utama')
      .eq('id', kategori_poin_id)
      .single();

    if (kategoriError || !kategori) {
      return NextResponse.json(
        { success: false, error: 'Kategori tidak ditemukan' },
        { status: 404 }
      );
    }

    if (kategori.kategori_utama !== 'Pelanggaran') {
      return NextResponse.json(
        { success: false, error: 'Kategori harus bertipe Pelanggaran' },
        { status: 400 }
      );
    }

    // Verify mahasiswa exists
    // Musyrif can input pelanggaran for ANY mahasiswa (not limited to their bimbingan)
    const { data: mahasiswa, error: mahasiswaError } = await supabaseAdmin
      .from('mahasiswa')
      .select('id, nama, nim')
      .eq('id', mahasiswa_id)
      .eq('is_active', true)
      .single();

    if (mahasiswaError || !mahasiswa) {
      return NextResponse.json(
        { success: false, error: 'Mahasiswa tidak ditemukan atau tidak aktif' },
        { status: 404 }
      );
    }

    console.log('✅ Mahasiswa verified:', mahasiswa.nim, '-', mahasiswa.nama);

    // Get tahun ajaran and semester aktif
    const { data: settings, error: settingsError } = await supabaseAdmin
      .from('system_settings')
      .select('setting_key, setting_value')
      .in('setting_key', ['tahun_ajaran_aktif', 'semester_aktif']);

    if (settingsError) {
      console.error('❌ Error fetching settings:', settingsError);
    }

    const tahunAjaranSetting = settings?.find(s => s.setting_key === 'tahun_ajaran_aktif');
    const semesterSetting = settings?.find(s => s.setting_key === 'semester_aktif');

    const tahun_ajaran = tahunAjaranSetting?.setting_value || '2024/2025';
    const semester_type = semesterSetting?.setting_value || 'ganjil';

    console.log('📅 Settings:', { tahun_ajaran, semester_type });

    // Insert pelanggaran
    const insertData = {
      mahasiswa_id,
      kategori_id: kategori_poin_id,
      tanggal,
      deskripsi_kegiatan: keterangan,
      bukti: bukti || null,
      status: 'pending',
      tahun_ajaran,
      semester_type,
    };

    console.log('📝 Inserting pelanggaran:', insertData);

    const { data: pelanggaran, error: insertError } = await supabaseAdmin
      .from('poin_aktivitas')
      .insert(insertData)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error inserting pelanggaran:', insertError);
      console.error('Insert error details:', JSON.stringify(insertError, null, 2));
      return NextResponse.json(
        { 
          success: false, 
          error: 'Gagal menyimpan pelanggaran',
          details: insertError.message || insertError.hint || 'Unknown error'
        },
        { status: 500 }
      );
    }

    console.log('✅ Pelanggaran inserted successfully:', pelanggaran);

    return NextResponse.json({
      success: true,
      data: pelanggaran,
      message: 'Pelanggaran berhasil dicatat dan menunggu validasi Waket3',
    });
  } catch (error: any) {
    console.error('❌ Error in POST /api/musyrif/pelanggaran:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
