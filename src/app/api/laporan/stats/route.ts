import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Force dynamic rendering to prevent build-time data collection
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


/**
 * GET /api/laporan/stats
 * Get statistics for reports
 * Query params: startDate, endDate, semester, prodi
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const semester = searchParams.get('semester');
    const prodi = searchParams.get('prodi');

    // 1. Get total poin per kategori
    let poinQuery = supabase
      .from('poin_aktivitas')
      .select('kategori_poin(kategori_utama, bobot), status');

    if (startDate && endDate) {
      poinQuery = poinQuery
        .gte('tanggal_aktivitas', startDate)
        .lte('tanggal_aktivitas', endDate);
    }

    const { data: poinData, error: poinError } = await poinQuery.eq('status', 'approved');

    if (poinError) {
      console.error('Error fetching poin data:', poinError);
    }

    // Calculate poin per kategori
    const kategoriStats: Record<string, number> = {};
    let totalPoin = 0;

    poinData?.forEach((item: any) => {
      const kategori = item.kategori_poin?.kategori_utama || 'Lainnya';
      const bobot = item.kategori_poin?.bobot || 0;
      kategoriStats[kategori] = (kategoriStats[kategori] || 0) + bobot;
      totalPoin += bobot;
    });

    // 2. Get top 10 mahasiswa
    let summaryQuery = supabase
      .from('poin_summary')
      .select('mahasiswa_id, total_poin, mahasiswa(nama)')
      .order('total_poin', { ascending: false })
      .limit(10);

    const { data: topMahasiswa, error: topError } = await summaryQuery;

    if (topError) {
      console.error('Error fetching top mahasiswa:', topError);
    }

    // 3. Get status kelulusan distribution
    const { data: allSummary, error: summaryError } = await supabase
      .from('poin_summary')
      .select('total_poin');

    if (summaryError) {
      console.error('Error fetching summary:', summaryError);
    }

    // Calculate status distribution
    const statusDistribution = {
      sangat_aktif: 0, // >= 300
      aktif: 0, // 200-299
      cukup_aktif: 0, // 150-199
      pasif: 0, // < 150
    };

    allSummary?.forEach((item: any) => {
      const poin = item.total_poin || 0;
      if (poin >= 300) statusDistribution.sangat_aktif++;
      else if (poin >= 200) statusDistribution.aktif++;
      else if (poin >= 150) statusDistribution.cukup_aktif++;
      else statusDistribution.pasif++;
    });

    const totalMahasiswa = allSummary?.length || 0;

    // 4. Calculate rata-rata poin
    const rataRataPoin = totalMahasiswa > 0
      ? Math.round(allSummary!.reduce((sum: number, item: any) => sum + (item.total_poin || 0), 0) / totalMahasiswa)
      : 0;

    // 5. Get kegiatan terbanyak
    const { data: kegiatanData, error: kegiatanError } = await supabase
      .from('poin_aktivitas')
      .select('kategori_poin_id, kategori_poin(nama)')
      .eq('status', 'approved');

    if (kegiatanError) {
      console.error('Error fetching kegiatan:', kegiatanError);
    }

    // Count kegiatan
    const kegiatanCount: Record<string, { nama: string; count: number }> = {};
    kegiatanData?.forEach((item: any) => {
      const id = item.kategori_poin_id;
      const nama = item.kategori_poin?.nama || 'Unknown';
      if (!kegiatanCount[id]) {
        kegiatanCount[id] = { nama, count: 0 };
      }
      kegiatanCount[id].count++;
    });

    const kegiatanTerbanyak = Object.values(kegiatanCount).sort((a, b) => b.count - a.count)[0]?.nama || '-';

    // 6. Kategori paling aktif
    const kategoriPalingAktif = Object.entries(kategoriStats).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

    return NextResponse.json({
      success: true,
      data: {
        kategoriStats,
        totalPoin,
        topMahasiswa: topMahasiswa?.map((item: any) => ({
          nama: item.mahasiswa?.nama || 'Unknown',
          poin: item.total_poin || 0,
        })) || [],
        statusDistribution,
        totalMahasiswa,
        rataRataPoin,
        kegiatanTerbanyak,
        kategoriPalingAktif,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/laporan/stats:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

