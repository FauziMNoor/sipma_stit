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

    // 1. Get total poin per kategori with proper joins
    let poinQuery = supabase
      .from('poin_aktivitas')
      .select(`
        kategori_id,
        mahasiswa_id,
        kategori_poin:kategori_id (
          id,
          nama,
          kategori_utama, 
          bobot,
          jenis
        ),
        mahasiswa:mahasiswa_id (
          semester,
          prodi
        ),
        status,
        tanggal
      `);

    // Apply date filter using 'tanggal' field
    if (startDate && endDate) {
      poinQuery = poinQuery
        .gte('tanggal', startDate)
        .lte('tanggal', endDate);
    }

    const { data: poinData, error: poinError } = await poinQuery.eq('status', 'approved');

    if (poinError) {
      console.error('Error fetching poin data:', poinError);
    }

    console.log('📊 API Laporan Stats Debug:');
    console.log('- Filters:', { startDate, endDate, semester, prodi });
    console.log('- Total poin_aktivitas fetched:', poinData?.length || 0);
    console.log('- Sample data:', poinData?.[0]);

    // Calculate poin per kategori with proper filtering
    const kategoriStats: Record<string, number> = {};
    let totalPoin = 0;

    poinData?.forEach((item: any) => {
      // Apply semester filter - only if semester is NOT 'all' AND semester value exists
      if (semester && semester !== 'all') {
        if (!item.mahasiswa?.semester || item.mahasiswa.semester.toString() !== semester) {
          return;
        }
      }

      // Apply prodi filter - only if prodi is NOT 'all' AND prodi value exists
      if (prodi && prodi !== 'all') {
        if (!item.mahasiswa?.prodi || item.mahasiswa.prodi !== prodi) {
          return;
        }
      }

      const kategori = item.kategori_poin?.kategori_utama || 'Lainnya';
      const bobot = item.kategori_poin?.bobot || 0;
      const jenis = item.kategori_poin?.jenis || 'positif';

      // Calculate points based on jenis (positif/negatif)
      const poinValue = jenis === 'positif' ? bobot : -bobot;

      kategoriStats[kategori] = (kategoriStats[kategori] || 0) + poinValue;
      totalPoin += poinValue;
    });

    // 2. Calculate mahasiswa stats from filtered data
    // Group poin by mahasiswa
    const mahasiswaPoin: Record<string, { nama: string; poin: number }> = {};

    poinData?.forEach((item: any) => {
      // Apply semester filter - only if semester is NOT 'all'
      if (semester && semester !== 'all') {
        if (!item.mahasiswa?.semester || item.mahasiswa.semester.toString() !== semester) {
          return;
        }
      }

      // Apply prodi filter - only if prodi is NOT 'all'
      if (prodi && prodi !== 'all') {
        if (!item.mahasiswa?.prodi || item.mahasiswa.prodi !== prodi) {
          return;
        }
      }

      const mahasiswaId = item.mahasiswa_id;
      const bobot = item.kategori_poin?.bobot || 0;
      const jenis = item.kategori_poin?.jenis || 'positif';
      const poinValue = jenis === 'positif' ? bobot : -bobot;

      if (!mahasiswaPoin[mahasiswaId]) {
        mahasiswaPoin[mahasiswaId] = { nama: 'Unknown', poin: 0 };
      }
      mahasiswaPoin[mahasiswaId].poin += poinValue;
    });

    // Get mahasiswa names (no need to filter again, already filtered above)
    const mahasiswaIds = Object.keys(mahasiswaPoin);
    
    let mahasiswaData = null;
    if (mahasiswaIds.length > 0) {
      const { data } = await supabase
        .from('mahasiswa')
        .select('id, nama')
        .in('id', mahasiswaIds);
      mahasiswaData = data;
    }

    // Update nama in mahasiswaPoin
    mahasiswaData?.forEach((mhs: any) => {
      if (mahasiswaPoin[mhs.id]) {
        mahasiswaPoin[mhs.id].nama = mhs.nama;
      }
    });

    // Sort and get top 10
    const topMahasiswa = Object.entries(mahasiswaPoin)
      .map(([id, data]) => ({ nama: data.nama, poin: data.poin }))
      .sort((a, b) => b.poin - a.poin)
      .slice(0, 10);

    // 3. Calculate status distribution from mahasiswaPoin
    const statusDistribution = {
      sangat_aktif: 0, // >= 300
      aktif: 0, // 200-299
      cukup_aktif: 0, // 150-199
      pasif: 0, // < 150
    };

    Object.values(mahasiswaPoin).forEach((data) => {
      const poin = data.poin;
      if (poin >= 300) statusDistribution.sangat_aktif++;
      else if (poin >= 200) statusDistribution.aktif++;
      else if (poin >= 150) statusDistribution.cukup_aktif++;
      else statusDistribution.pasif++;
    });

    const totalMahasiswa = Object.keys(mahasiswaPoin).length;

    // 4. Calculate rata-rata poin
    const totalPoinAllMahasiswa = Object.values(mahasiswaPoin).reduce(
      (sum, data) => sum + data.poin,
      0
    );
    const rataRataPoin = totalMahasiswa > 0
      ? Math.round(totalPoinAllMahasiswa / totalMahasiswa)
      : 0;

    // 5. Count kegiatan terbanyak from filtered data
    const kegiatanCount: Record<string, { nama: string; count: number }> = {};
    
    poinData?.forEach((item: any) => {
      // Apply semester filter - only if semester is NOT 'all'
      if (semester && semester !== 'all') {
        if (!item.mahasiswa?.semester || item.mahasiswa.semester.toString() !== semester) {
          return;
        }
      }

      // Apply prodi filter - only if prodi is NOT 'all'
      if (prodi && prodi !== 'all') {
        if (!item.mahasiswa?.prodi || item.mahasiswa.prodi !== prodi) {
          return;
        }
      }

      const id = item.kategori_id;
      const nama = item.kategori_poin?.nama || 'Unknown';
      if (!kegiatanCount[id]) {
        kegiatanCount[id] = { nama, count: 0 };
      }
      kegiatanCount[id].count++;
    });

    const kegiatanTerbanyak = Object.values(kegiatanCount).length > 0
      ? Object.values(kegiatanCount).sort((a, b) => b.count - a.count)[0].nama
      : '-';

    // 6. Kategori paling aktif
    const kategoriPalingAktif = Object.entries(kategoriStats).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

    console.log('📊 API Laporan Stats Results:');
    console.log('- Total Poin:', totalPoin);
    console.log('- Total Mahasiswa:', totalMahasiswa);
    console.log('- Kategori Stats:', kategoriStats);
    console.log('- Top Mahasiswa count:', topMahasiswa.length);
    console.log('---');

    return NextResponse.json({
      success: true,
      data: {
        kategoriStats,
        totalPoin,
        topMahasiswa,
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

