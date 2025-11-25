import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET - Fetch rekap poin mahasiswa
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: dosenId } = await context.params;
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    // 1. Fetch all active mahasiswa
    let query = supabaseAdmin
      .from('mahasiswa')
      .select('id, nim, nama, foto, is_active')
      .eq('is_active', true)
      .order('nama', { ascending: true });

    // Apply search filter if provided
    if (search) {
      query = query.or(`nama.ilike.%${search}%,nim.ilike.%${search}%`);
    }

    const { data: mahasiswaList, error: mahasiswaError } = await query;

    if (mahasiswaError) {
      console.error('Error fetching mahasiswa:', mahasiswaError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch mahasiswa' },
        { status: 500 }
      );
    }

    // 2. For each mahasiswa, calculate total poin from approved activities
    const mahasiswaWithPoin = await Promise.all(
      (mahasiswaList || []).map(async (mhs) => {
        // Get all approved aktivitas with kategori details
        const { data: aktivitas } = await supabaseAdmin
          .from('poin_aktivitas')
          .select(`
            id,
            kategori:kategori_id (
              bobot,
              jenis
            )
          `)
          .eq('mahasiswa_id', mhs.id)
          .eq('status', 'approved');

        // Calculate total poin
        let totalPoin = 0;
        if (aktivitas && aktivitas.length > 0) {
          aktivitas.forEach((akt: any) => {
            const kategori = akt.kategori;
            if (kategori) {
              const bobot = kategori.bobot || 0;
              const jenis = kategori.jenis;
              
              // Add or subtract based on jenis
              if (jenis === 'positif') {
                totalPoin += bobot;
              } else if (jenis === 'negatif') {
                totalPoin -= bobot;
              }
            }
          });
        }

        return {
          id: mhs.id,
          nim: mhs.nim,
          nama: mhs.nama,
          foto: mhs.foto,
          is_active: mhs.is_active,
          total_poin: totalPoin,
        };
      })
    );

    // Sort by total poin descending
    mahasiswaWithPoin.sort((a, b) => b.total_poin - a.total_poin);

    return NextResponse.json({
      success: true,
      data: mahasiswaWithPoin,
    });
  } catch (error) {
    console.error('Error in rekap-poin API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

