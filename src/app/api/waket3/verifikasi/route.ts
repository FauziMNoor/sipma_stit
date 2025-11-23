import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Fetch all pengajuan with mahasiswa and kategori data
    const { data: pengajuanList, error: pengajuanError } = await supabaseAdmin
      .from('poin_aktivitas')
      .select(`
        id,
        mahasiswa_id,
        kategori_id,
        deskripsi_kegiatan,
        tanggal,
        bukti,
        status,
        created_at,
        mahasiswa:mahasiswa_id (
          nama,
          nim,
          foto
        ),
        kategori_poin:kategori_id (
          nama,
          bobot
        )
      `)
      .order('created_at', { ascending: false });

    if (pengajuanError) {
      console.error('Error fetching pengajuan:', pengajuanError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch pengajuan' },
        { status: 500 }
      );
    }

    // Format the data
    const formattedData = (pengajuanList || []).map((item: any) => ({
      id: item.id,
      mahasiswa_id: item.mahasiswa_id,
      mahasiswa_nama: item.mahasiswa?.nama || 'Unknown',
      mahasiswa_nim: item.mahasiswa?.nim || 'Unknown',
      mahasiswa_foto: item.mahasiswa?.foto || null,
      kategori_id: item.kategori_id,
      kategori_nama: item.kategori_poin?.nama || 'Unknown',
      kategori_poin: item.kategori_poin?.bobot || 0,
      deskripsi_kegiatan: item.deskripsi_kegiatan,
      tanggal: item.tanggal,
      bukti: item.bukti,
      status: item.status,
      created_at: item.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error('Error in waket3 verifikasi API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

