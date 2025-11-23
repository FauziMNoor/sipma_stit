import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // This is waket3 user_id

    // Fetch all verified activities by this waket3
    const { data: riwayatList, error: riwayatError } = await supabaseAdmin
      .from('poin_aktivitas')
      .select(`
        id,
        mahasiswa_id,
        kategori_id,
        deskripsi_kegiatan,
        tanggal,
        status,
        verified_at,
        notes_verifikator,
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
      .eq('verifikator_id', id)
      .in('status', ['approved', 'rejected'])
      .order('verified_at', { ascending: false });

    if (riwayatError) {
      console.error('Error fetching riwayat:', riwayatError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch riwayat' },
        { status: 500 }
      );
    }

    // Format the data
    const formattedData = (riwayatList || []).map((item: any) => ({
      id: item.id,
      mahasiswa_nama: item.mahasiswa?.nama || 'Unknown',
      mahasiswa_nim: item.mahasiswa?.nim || 'Unknown',
      mahasiswa_foto: item.mahasiswa?.foto || null,
      deskripsi_kegiatan: item.deskripsi_kegiatan,
      kategori_nama: item.kategori_poin?.nama || 'Unknown',
      kategori_poin: item.kategori_poin?.bobot || 0,
      tanggal: item.tanggal,
      status: item.status,
      verified_at: item.verified_at,
      notes_verifikator: item.notes_verifikator,
    }));

    return NextResponse.json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error('Error in waket3 riwayat API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

