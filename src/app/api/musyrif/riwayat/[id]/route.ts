import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Force dynamic rendering to prevent build-time data collection
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/musyrif/riwayat/[id]
 * Get riwayat verifikasi for Musyrif (only Adab activities they verified)
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // This is musyrif user_id

    console.log('🔍 [MUSYRIF RIWAYAT] Fetching riwayat for musyrif ID:', id);

    // Fetch all verified Adab activities by this musyrif
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
          bobot,
          kategori_utama
        )
      `)
      .eq('verifikator_id', id)
      .in('status', ['approved', 'rejected'])
      .order('verified_at', { ascending: false });

    if (riwayatError) {
      console.error('❌ Error fetching riwayat:', riwayatError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch riwayat' },
        { status: 500 }
      );
    }

    console.log('📝 Total riwayat fetched:', riwayatList?.length || 0);

    // Filter only Adab kategori (Musyrif only verifies Adab)
    const filteredRiwayat = (riwayatList || []).filter((item: any) => {
      return item.kategori_poin?.kategori_utama === 'Adab';
    });

    console.log('✅ Filtered Adab riwayat:', filteredRiwayat.length);

    // Format the data
    const formattedData = filteredRiwayat.map((item: any) => ({
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

    console.log('✅ Returning', formattedData.length, 'riwayat items');

    return NextResponse.json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error('❌ Error in musyrif riwayat API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
