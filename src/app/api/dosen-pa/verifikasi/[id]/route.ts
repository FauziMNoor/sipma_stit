import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET - Fetch all aktivitas from mahasiswa bimbingan
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: dosenId } = await context.params;

    // 1. Get mahasiswa IDs for this dosen
    const { data: mahasiswaList, error: mahasiswaError } = await supabaseAdmin
      .from('mahasiswa')
      .select('id')
      .eq('dosen_pa_id', dosenId)
      .eq('is_active', true);

    if (mahasiswaError) {
      console.error('Error fetching mahasiswa:', mahasiswaError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch mahasiswa' },
        { status: 500 }
      );
    }

    const mahasiswaIds = mahasiswaList?.map((m) => m.id) || [];

    if (mahasiswaIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    // 2. Fetch all aktivitas from mahasiswa bimbingan
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
      .in('mahasiswa_id', mahasiswaIds)
      .order('created_at', { ascending: false });

    if (aktivitasError) {
      console.error('Error fetching aktivitas:', aktivitasError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch aktivitas' },
        { status: 500 }
      );
    }

    // 3. Fetch mahasiswa details
    const { data: mahasiswaDetails, error: mahasiswaDetailsError } = await supabaseAdmin
      .from('mahasiswa')
      .select('id, nim, nama, foto')
      .in('id', mahasiswaIds);

    if (mahasiswaDetailsError) {
      console.error('Error fetching mahasiswa details:', mahasiswaDetailsError);
    }

    // 4. Fetch kategori details
    const kategoriIds = [...new Set(aktivitas?.map((a: any) => a.kategori_id) || [])];
    const { data: kategoriDetails, error: kategoriError } = await supabaseAdmin
      .from('kategori_poin')
      .select('id, nama, kategori_utama, bobot, jenis')
      .in('id', kategoriIds);

    if (kategoriError) {
      console.error('Error fetching kategori:', kategoriError);
    }

    // 5. Map data
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
    }) || [];

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
    const { action, notes } = body;

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Get user ID from request (you might want to add auth middleware)
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    // For now, we'll get verifikator_id from the request body or use a default
    // In production, you should verify the JWT token and get the user ID from it

    const status = action === 'approve' ? 'approved' : 'rejected';
    const now = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('poin_aktivitas')
      .update({
        status,
        notes_verifikator: notes,
        verified_at: now,
        // verifikator_id: userId, // Add this when you have proper auth
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

