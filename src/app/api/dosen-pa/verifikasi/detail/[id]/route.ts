import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: aktivitasId } = await context.params;

    // 1. Fetch aktivitas detail
    const { data: aktivitas, error: aktivitasError } = await supabaseAdmin
      .from('poin_aktivitas')
      .select(`
        id,
        tanggal,
        deskripsi_kegiatan,
        bukti,
        status,
        notes_verifikator,
        mahasiswa_id,
        kategori_id
      `)
      .eq('id', aktivitasId)
      .single();

    if (aktivitasError || !aktivitas) {
      return NextResponse.json(
        { success: false, error: 'Aktivitas not found' },
        { status: 404 }
      );
    }

    // 2. Fetch mahasiswa detail with total poin
    const { data: mahasiswa, error: mahasiswaError } = await supabaseAdmin
      .from('mahasiswa')
      .select('id, nim, nama, foto')
      .eq('id', aktivitas.mahasiswa_id)
      .single();

    if (mahasiswaError) {
      console.error('Error fetching mahasiswa:', mahasiswaError);
    }

    // 3. Get total poin from poin_summary
    const { data: poinSummary, error: poinError } = await supabaseAdmin
      .from('poin_summary')
      .select('total_poin')
      .eq('mahasiswa_id', aktivitas.mahasiswa_id)
      .single();

    if (poinError) {
      console.error('Error fetching poin summary:', poinError);
    }

    // 4. Fetch kategori detail
    const { data: kategori, error: kategoriError } = await supabaseAdmin
      .from('kategori_poin')
      .select('id, nama, kategori_utama, bobot, jenis')
      .eq('id', aktivitas.kategori_id)
      .single();

    if (kategoriError) {
      console.error('Error fetching kategori:', kategoriError);
    }

    // 5. Format response
    const formattedData = {
      id: aktivitas.id,
      tanggal: aktivitas.tanggal,
      deskripsi_kegiatan: aktivitas.deskripsi_kegiatan,
      bukti: aktivitas.bukti,
      status: aktivitas.status,
      notes_verifikator: aktivitas.notes_verifikator,
      mahasiswa: {
        id: mahasiswa?.id || '',
        nim: mahasiswa?.nim || '',
        nama: mahasiswa?.nama || 'Unknown',
        foto: mahasiswa?.foto || null,
        total_poin: poinSummary?.total_poin || 0,
      },
      kategori: {
        nama: kategori?.nama || 'Unknown',
        kategori_utama: kategori?.kategori_utama || 'Unknown',
        bobot: kategori?.bobot || 0,
        jenis: kategori?.jenis || 'positif',
      },
    };

    return NextResponse.json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error('Error in detail API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

