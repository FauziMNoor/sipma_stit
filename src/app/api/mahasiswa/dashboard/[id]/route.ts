import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Force dynamic rendering to prevent build-time data collection
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


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

    // 2. Calculate poin summary from approved activities
    const { data: approvedActivities, error: activitiesError } = await supabase
      .from('poin_aktivitas')
      .select(`
        kategori:kategori_id (
          kategori_utama,
          jenis,
          bobot
        )
      `)
      .eq('mahasiswa_id', id)
      .eq('status', 'approved');

    // Initialize summary
    let summary = {
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

    // Calculate totals from approved activities
    if (approvedActivities && approvedActivities.length > 0) {
      approvedActivities.forEach((activity: any) => {
        const kategori = activity.kategori;
        if (!kategori) return;

        const bobot = kategori.bobot || 0;
        const jenis = kategori.jenis;
        const kategoriUtama = kategori.kategori_utama;

        // Add to total poin
        if (jenis === 'positif') {
          summary.total_poin_positif += bobot;
          summary.total_poin += bobot;
        } else if (jenis === 'negatif') {
          summary.total_poin_negatif += bobot;
          summary.total_poin -= bobot;
        }

        // Add to category totals
        if (kategoriUtama === 'Akademik') {
          summary.total_akademik += bobot;
        } else if (kategoriUtama === 'Dakwah') {
          summary.total_dakwah += bobot;
        } else if (kategoriUtama === 'Sosial') {
          summary.total_sosial += bobot;
        } else if (kategoriUtama === 'Adab') {
          summary.total_adab += bobot;
        } else if (kategoriUtama === 'Pelanggaran') {
          summary.total_pelanggaran += bobot;
        }
      });
    }

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

    // 4. Fetch all activities (for riwayat page)
    const { data: allActivities, error: allActivitiesError } = await supabase
      .from('poin_aktivitas')
      .select(`
        id,
        tanggal,
        deskripsi_kegiatan,
        status,
        created_at,
        kategori:kategori_id (
          id,
          kode,
          nama,
          kategori_utama,
          jenis,
          bobot
        )
      `)
      .eq('mahasiswa_id', id)
      .order('tanggal', { ascending: false });

    // Format activities for frontend
    const formattedActivities = (allActivities || []).map((item: any) => ({
      id: item.id,
      tanggal: item.tanggal,
      deskripsi_kegiatan: item.deskripsi_kegiatan,
      status: item.status,
      kategori: {
        nama: item.kategori?.nama || 'Unknown',
        kategori_utama: item.kategori?.kategori_utama || 'Unknown',
        bobot: item.kategori?.bobot || 0,
        jenis: item.kategori?.jenis || 'positif',
      },
    }));

    // 5. Count pending submissions
    const { count: pendingCount } = await supabase
      .from('poin_aktivitas')
      .select('id', { count: 'exact', head: true })
      .eq('mahasiswa_id', id)
      .eq('status', 'pending');

    return NextResponse.json({
      success: true,
      data: {
        mahasiswa,
        total_poin: summary.total_poin || 0,
        total_poin_positif: summary.total_poin_positif || 0,
        total_poin_negatif: summary.total_poin_negatif || 0,
        total_akademik: summary.total_akademik || 0,
        total_dakwah: summary.total_dakwah || 0,
        total_sosial: summary.total_sosial || 0,
        total_adab: summary.total_adab || 0,
        total_pelanggaran: summary.total_pelanggaran || 0,
        status_kelulusan: statusKelulusan.status,
        progress_percentage: statusKelulusan.progress,
        aktivitas: formattedActivities,
        pending_count: pendingCount || 0,
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

