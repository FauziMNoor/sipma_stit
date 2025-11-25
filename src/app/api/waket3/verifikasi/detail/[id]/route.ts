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

    // Fetch pengajuan detail with all related data
    const { data: pengajuan, error: pengajuanError } = await supabaseAdmin
      .from('poin_aktivitas')
      .select(`
        id,
        mahasiswa_id,
        kategori_id,
        deskripsi_kegiatan,
        tanggal,
        bukti,
        status,
        notes_verifikator,
        verified_at,
        created_at,
        mahasiswa:mahasiswa_id (
          nama,
          nim,
          prodi,
          angkatan,
          foto
        ),
        kategori_poin:kategori_id (
          nama,
          bobot
        ),
        verifikator:verifikator_id (
          nama
        )
      `)
      .eq('id', id)
      .single();

    if (pengajuanError || !pengajuan) {
      console.error('Error fetching pengajuan detail:', pengajuanError);
      return NextResponse.json(
        { success: false, error: 'Pengajuan not found' },
        { status: 404 }
      );
    }

    // Format the data
    // Handle mahasiswa as array (Supabase returns array for foreign key relations)
    const mahasiswaData = Array.isArray(pengajuan.mahasiswa) ? pengajuan.mahasiswa[0] : pengajuan.mahasiswa;
    const kategoriData = Array.isArray(pengajuan.kategori_poin) ? pengajuan.kategori_poin[0] : pengajuan.kategori_poin;
    const verifikatorData = Array.isArray(pengajuan.verifikator) ? pengajuan.verifikator[0] : pengajuan.verifikator;

    const formattedData = {
      id: pengajuan.id,
      mahasiswa_id: pengajuan.mahasiswa_id,
      mahasiswa_nama: mahasiswaData?.nama || 'Unknown',
      mahasiswa_nim: mahasiswaData?.nim || 'Unknown',
      mahasiswa_prodi: mahasiswaData?.prodi || 'Unknown',
      mahasiswa_angkatan: mahasiswaData?.angkatan || 'Unknown',
      mahasiswa_foto: mahasiswaData?.foto || null,
      kategori_id: pengajuan.kategori_id,
      kategori_nama: kategoriData?.nama || 'Unknown',
      kategori_poin: kategoriData?.bobot || 0,
      deskripsi_kegiatan: pengajuan.deskripsi_kegiatan,
      tanggal: pengajuan.tanggal,
      bukti: pengajuan.bukti,
      status: pengajuan.status,
      notes_verifikator: pengajuan.notes_verifikator,
      verified_at: pengajuan.verified_at,
      verifikator_nama: verifikatorData?.nama || null,
      created_at: pengajuan.created_at,
    };

    return NextResponse.json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error('Error in waket3 verifikasi detail API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

