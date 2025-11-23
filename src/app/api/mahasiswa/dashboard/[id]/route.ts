import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/mahasiswa/dashboard/[id]
 * Get dashboard data for mahasiswa (poin summary, status kelulusan, recent activities)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Fetch mahasiswa data
    const { data: mahasiswa, error: mahasiswaError } = await supabase
      .from('mahasiswa')
      .select('id, nim, nama, prodi, angkatan, semester, foto')
      .eq('id', id)
      .single();

    if (mahasiswaError || !mahasiswa) {
      return NextResponse.json(
        { success: false, error: 'Mahasiswa tidak ditemukan' },
        { status: 404 }
      );
    }

    // 2. Fetch poin summary
    const { data: poinSummary, error: poinError } = await supabase
      .from('poin_summary')
      .select('*')
      .eq('mahasiswa_id', id)
      .single();

    // If no summary exists, create default
    const summary = poinSummary || {
      mahasiswa_id: id,
      total_poin: 0,
      total_poin_positif: 0,
      total_poin_negatif: 0,
      total_akademik: 0,
      total_dakwah: 0,
      total_sosial: 0,
      total_adab: 0,
      total_pelanggaran: 0,
    };

    // 3. Calculate status kelulusan
    let statusKelulusan = {
      kategori: 'Pasif',
      status: 'Belum memenuhi syarat',
      warna: 'text-muted-foreground',
      progress: 0,
    };

    const totalPoin = summary.total_poin || 0;
    const minPoinKelulusan = 250; // Default, bisa diambil dari settings

    if (totalPoin >= 300) {
      statusKelulusan = {
        kategori: 'Sangat Aktif',
        status: 'Sangat aktif dan teladan',
        warna: 'text-green-600',
        progress: 100,
      };
    } else if (totalPoin >= 250) {
      statusKelulusan = {
        kategori: 'Aktif',
        status: 'Aktif dan layak lulus',
        warna: 'text-primary',
        progress: Math.round((totalPoin / 300) * 100),
      };
    } else if (totalPoin >= 150) {
      statusKelulusan = {
        kategori: 'Cukup Aktif',
        status: 'Cukup aktif, tingkatkan lagi',
        warna: 'text-yellow-600',
        progress: Math.round((totalPoin / 300) * 100),
      };
    } else {
      statusKelulusan = {
        kategori: 'Pasif',
        status: 'Belum memenuhi syarat',
        warna: 'text-destructive',
        progress: Math.round((totalPoin / 300) * 100),
      };
    }

    // 4. Fetch recent activities (last 5)
    const { data: recentActivities, error: activitiesError } = await supabase
      .from('poin_aktivitas')
      .select(`
        id,
        tanggal,
        keterangan,
        poin,
        status_verifikasi,
        created_at,
        kategori_poin:kategori_poin_id (
          id,
          kode,
          nama,
          kategori_utama,
          jenis
        )
      `)
      .eq('mahasiswa_id', id)
      .order('created_at', { ascending: false })
      .limit(5);

    // 5. Count pending submissions
    const { data: pendingCount } = await supabase
      .from('poin_aktivitas')
      .select('id', { count: 'exact', head: true })
      .eq('mahasiswa_id', id)
      .eq('status_verifikasi', 'pending');

    return NextResponse.json({
      success: true,
      data: {
        mahasiswa,
        poinSummary: summary,
        statusKelulusan,
        recentActivities: recentActivities || [],
        pendingCount: pendingCount || 0,
      },
    });
  } catch (error: any) {
    console.error('❌ Error in GET /api/mahasiswa/dashboard/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

