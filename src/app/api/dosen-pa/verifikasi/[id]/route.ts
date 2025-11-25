import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Force dynamic rendering to prevent build-time data collection
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


// GET - Fetch all aktivitas kategori Akademik dari SEMUA mahasiswa
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: dosenId } = await context.params;

    // NOTE: Dosen PA bisa melihat dan approve kategori Akademik dari SEMUA mahasiswa
    // Karena belum ada sistem pembagian mahasiswa bimbingan per dosen

    // 1. Fetch all aktivitas (akan difilter berdasarkan kategori Akademik nanti)
    const { data: aktivitas, error: aktivitasError } = await supabaseAdmin
      .from('poin_aktivitas')
      .select(`
        id,
        tanggal,
        deskripsi_kegiatan,
        bukti,
        status,
        created_at,
        mahasiswa_id,
        kategori_id
      `)
      .order('created_at', { ascending: false });

    if (aktivitasError) {
      console.error('Error fetching aktivitas:', aktivitasError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch aktivitas' },
        { status: 500 }
      );
    }

    // 2. Get unique mahasiswa IDs and kategori IDs from aktivitas
    const mahasiswaIds = [...new Set(aktivitas?.map((a: any) => a.mahasiswa_id) || [])];
    const kategoriIds = [...new Set(aktivitas?.map((a: any) => a.kategori_id) || [])];

    // 3. Fetch mahasiswa details
    const { data: mahasiswaDetails, error: mahasiswaDetailsError } = await supabaseAdmin
      .from('mahasiswa')
      .select('id, nim, nama, foto')
      .in('id', mahasiswaIds);

    if (mahasiswaDetailsError) {
      console.error('Error fetching mahasiswa details:', mahasiswaDetailsError);
    }

    // 4. Fetch kategori details
    const { data: kategoriDetails, error: kategoriError } = await supabaseAdmin
      .from('kategori_poin')
      .select('id, nama, kategori_utama, bobot, jenis')
      .in('id', kategoriIds);

    if (kategoriError) {
      console.error('Error fetching kategori:', kategoriError);
    }

    // 5. Map data and filter only Akademik category
    const mahasiswaMap = new Map(mahasiswaDetails?.map((m: any) => [m.id, m]) || []);
    const kategoriMap = new Map(kategoriDetails?.map((k: any) => [k.id, k]) || []);

    const formattedData = aktivitas?.map((item: any) => {
      const mahasiswa = mahasiswaMap.get(item.mahasiswa_id);
      const kategori = kategoriMap.get(item.kategori_id);

      return {
        id: item.id,
        tanggal: item.tanggal,
        deskripsi_kegiatan: item.deskripsi_kegiatan,
        bukti: item.bukti,
        status: item.status,
        created_at: item.created_at,
        mahasiswa: {
          id: mahasiswa?.id || '',
          nim: mahasiswa?.nim || '',
          nama: mahasiswa?.nama || 'Unknown',
          foto: mahasiswa?.foto || null,
        },
        kategori: {
          nama: kategori?.nama || 'Unknown',
          kategori_utama: kategori?.kategori_utama || 'Unknown',
          bobot: kategori?.bobot || 0,
          jenis: kategori?.jenis || 'positif',
        },
      };
    })
    // Filter hanya kategori Akademik
    .filter((item: any) => item.kategori.kategori_utama === 'Akademik') || [];

    return NextResponse.json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error('Error in verifikasi API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Approve or reject aktivitas
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: aktivitasId } = await context.params;
    const body = await request.json();
    const { action, notes, dosenId } = body;

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      );
    }

    // 1. Get aktivitas with kategori info
    const { data: aktivitas, error: fetchError } = await supabaseAdmin
      .from('poin_aktivitas')
      .select(`
        *,
        kategori_poin:kategori_id (
          kategori_utama
        )
      `)
      .eq('id', aktivitasId)
      .single();

    if (fetchError || !aktivitas) {
      return NextResponse.json(
        { success: false, error: 'Aktivitas tidak ditemukan' },
        { status: 404 }
      );
    }

    // 2. Verify kategori is Akademik
    // NOTE: Dosen PA bisa approve untuk SEMUA mahasiswa (belum ada sistem bimbingan per dosen)

    // 3. Verify kategori is Akademik
    if (aktivitas.kategori_poin?.kategori_utama !== 'Akademik') {
      return NextResponse.json(
        {
          success: false,
          error: 'Dosen PA hanya bisa memverifikasi kategori Akademik'
        },
        { status: 403 }
      );
    }

    const status = action === 'approve' ? 'approved' : 'rejected';
    const now = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('poin_aktivitas')
      .update({
        status,
        notes_verifikator: notes,
        verified_at: now,
        verifikator_id: dosenId || null,
      })
      .eq('id', aktivitasId)
      .select()
      .single();

    if (error) {
      console.error('Error updating aktivitas:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update aktivitas' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error in verifikasi PATCH API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

