import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/dashboard/stats
 * Get dashboard statistics
 * Note: No auth required - page-level protection is sufficient
 */
export async function GET(request: NextRequest) {
  try {
    // Get total mahasiswa
    const { count: totalMahasiswa, error: mahasiswaError } = await supabase
      .from('mahasiswa')
      .select('*', { count: 'exact', head: true });

    if (mahasiswaError) {
      console.error('Error counting mahasiswa:', mahasiswaError);
    }

    // Get total kategori kegiatan (active only)
    const { count: totalKegiatan, error: kegiatanError } = await supabase
      .from('kategori_poin')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    if (kegiatanError) {
      console.error('Error counting kegiatan:', kegiatanError);
    }

    // Get pending verifications (poin_aktivitas with status pending)
    const { count: pendingVerifikasi, error: pendingError } = await supabase
      .from('poin_aktivitas')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (pendingError) {
      console.error('Error counting pending:', pendingError);
    }

    // Get total poin from poin_summary
    const { data: poinData, error: poinError } = await supabase
      .from('poin_summary')
      .select('total_poin');

    if (poinError) {
      console.error('Error fetching poin:', poinError);
    }

    // Calculate total poin across all students
    const totalPoin = poinData?.reduce((sum, row) => sum + (row.total_poin || 0), 0) || 0;

    return NextResponse.json({
      success: true,
      data: {
        totalMahasiswa: totalMahasiswa || 0,
        totalKegiatan: totalKegiatan || 0,
        pendingVerifikasi: pendingVerifikasi || 0,
        totalPoin: totalPoin,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/dashboard/stats:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

