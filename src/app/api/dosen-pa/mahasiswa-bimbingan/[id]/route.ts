import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Force dynamic rendering to prevent build-time data collection
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: dosenId } = await context.params;

    // 1. Fetch mahasiswa bimbingan
    const { data: mahasiswaList, error: mahasiswaError } = await supabaseAdmin
      .from('mahasiswa')
      .select('id, nim, nama, semester, foto')
      .eq('dosen_pa_id', dosenId)
      .eq('is_active', true)
      .order('nama', { ascending: true });

    if (mahasiswaError) {
      console.error('Error fetching mahasiswa:', mahasiswaError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch mahasiswa' },
        { status: 500 }
      );
    }

    if (!mahasiswaList || mahasiswaList.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    // 2. Fetch poin summary for each mahasiswa
    const mahasiswaIds = mahasiswaList.map((m) => m.id);
    const { data: poinSummaries, error: poinError } = await supabaseAdmin
      .from('poin_summary')
      .select('mahasiswa_id, total_poin')
      .in('mahasiswa_id', mahasiswaIds);

    if (poinError) {
      console.error('Error fetching poin summaries:', poinError);
    }

    // 3. Create a map of poin summaries
    const poinMap = new Map(
      poinSummaries?.map((p: any) => [p.mahasiswa_id, p.total_poin]) || []
    );

    // 4. Calculate status and progress for each mahasiswa
    const formattedData = mahasiswaList.map((mahasiswa) => {
      const totalPoin = poinMap.get(mahasiswa.id) || 0;
      
      // Calculate progress percentage (assuming 300 is max poin for graduation)
      const maxPoin = 300;
      const progressPercentage = Math.min(Math.round((totalPoin / maxPoin) * 100), 100);

      // Determine status based on progress
      let statusKeaktifan = 'Pasif';
      let statusColor = 'red';

      if (progressPercentage >= 90) {
        statusKeaktifan = 'Sangat Aktif';
        statusColor = 'green';
      } else if (progressPercentage >= 70) {
        statusKeaktifan = 'Aktif';
        statusColor = 'blue';
      } else if (progressPercentage >= 50) {
        statusKeaktifan = 'Cukup Aktif';
        statusColor = 'yellow';
      }

      return {
        id: mahasiswa.id,
        nim: mahasiswa.nim,
        nama: mahasiswa.nama,
        semester: mahasiswa.semester,
        foto: mahasiswa.foto,
        total_poin: totalPoin,
        progress_percentage: progressPercentage,
        status_keaktifan: statusKeaktifan,
        status_color: statusColor,
      };
    });

    // Sort by total poin descending
    formattedData.sort((a, b) => b.total_poin - a.total_poin);

    return NextResponse.json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error('Error in mahasiswa-bimbingan API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

