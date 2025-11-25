import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET - Fetch riwayat verifikasi yang sudah dilakukan dosen PA
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: dosenId } = await context.params;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    console.log('[Riwayat Verifikasi] Fetching for dosenId:', dosenId);
    console.log('[Riwayat Verifikasi] Filters:', { status, startDate, endDate });

    // 1. Get kategori Akademik IDs
    const { data: kategoriAkademik, error: kategoriError } = await supabaseAdmin
      .from('kategori_poin')
      .select('id, kode, nama')
      .eq('kategori_utama', 'Akademik');

    console.log('[Riwayat Verifikasi] Kategori Akademik found:', kategoriAkademik?.length || 0);

    if (kategoriError) {
      console.error('[Riwayat Verifikasi] Error fetching kategori:', kategoriError);
    }

    const kategoriAkademikIds = kategoriAkademik?.map((k) => k.id) || [];

    if (kategoriAkademikIds.length === 0) {
      console.log('[Riwayat Verifikasi] No Akademik categories found');
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    // 2. Fetch aktivitas that have been verified (approved or rejected)
    // NOTE: Tidak filter by verified_by karena mungkin kolom ini tidak terisi
    let query = supabaseAdmin
      .from('poin_aktivitas')
      .select(`
        id,
        tanggal,
        deskripsi_kegiatan,
        bukti,
        status,
        notes_verifikator,
        created_at,
        updated_at,
        mahasiswa_id,
        kategori_id,
        verifikator_id
      `)
      .in('kategori_id', kategoriAkademikIds)
      .in('status', ['approved', 'rejected'])
      .order('updated_at', { ascending: false });

    // Apply status filter
    if (status !== 'all') {
      query = query.eq('status', status);
    }

    // Apply date range filter
    if (startDate) {
      query = query.gte('updated_at', startDate);
    }
    if (endDate) {
      // Add one day to include the end date
      const endDateTime = new Date(endDate);
      endDateTime.setDate(endDateTime.getDate() + 1);
      query = query.lt('updated_at', endDateTime.toISOString());
    }

    const { data: aktivitas, error: aktivitasError } = await query;

    console.log('[Riwayat Verifikasi] Aktivitas found:', aktivitas?.length || 0);

    if (aktivitasError) {
      console.error('[Riwayat Verifikasi] Error fetching aktivitas:', aktivitasError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch aktivitas' },
        { status: 500 }
      );
    }

    if (!aktivitas || aktivitas.length === 0) {
      console.log('[Riwayat Verifikasi] No verified aktivitas found');
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    // 3. Fetch related data (mahasiswa, kategori)
    const mahasiswaIds = [...new Set(aktivitas?.map((a) => a.mahasiswa_id) || [])];
    const kategoriIds = [...new Set(aktivitas?.map((a) => a.kategori_id) || [])];

    const [mahasiswaResult, kategoriResult] = await Promise.all([
      supabaseAdmin
        .from('mahasiswa')
        .select('id, nim, nama, foto')
        .in('id', mahasiswaIds),
      supabaseAdmin
        .from('kategori_poin')
        .select('id, kode, nama, bobot, jenis, kategori_utama')
        .in('id', kategoriIds),
    ]);

    // 4. Format response
    const formattedData = (aktivitas || []).map((item) => {
      const mahasiswa = mahasiswaResult.data?.find((m) => m.id === item.mahasiswa_id);
      const kategori = kategoriResult.data?.find((k) => k.id === item.kategori_id);

      return {
        id: item.id,
        tanggal: item.tanggal,
        deskripsi_kegiatan: item.deskripsi_kegiatan,
        bukti: item.bukti,
        status: item.status,
        notes_verifikator: item.notes_verifikator,
        created_at: item.created_at,
        updated_at: item.updated_at,
        mahasiswa: mahasiswa
          ? {
              id: mahasiswa.id,
              nim: mahasiswa.nim,
              nama: mahasiswa.nama,
              foto: mahasiswa.foto,
            }
          : null,
        kategori: kategori
          ? {
              id: kategori.id,
              kode: kategori.kode,
              nama: kategori.nama,
              bobot: kategori.bobot,
              jenis: kategori.jenis,
              kategori_utama: kategori.kategori_utama,
            }
          : null,
      };
    });

    console.log('[Riwayat Verifikasi] Returning formatted data:', formattedData.length);

    return NextResponse.json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error('Error in riwayat-verifikasi API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

