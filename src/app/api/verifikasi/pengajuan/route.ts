import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/verifikasi/pengajuan
 * Get all pengajuan poin aktivitas for verification
 * Query params: status (all, pending, approved, rejected), kategori, prodi
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status') || 'all';
    const kategoriFilter = searchParams.get('kategori');
    const prodiFilter = searchParams.get('prodi');

    console.log('🔍 [Admin Verifikasi] Fetching pengajuan with filters:', { statusFilter, kategoriFilter, prodiFilter });

    // Build query with joins - ALWAYS get ALL data for accurate counts
    let query = supabase
      .from('poin_aktivitas')
      .select(`
        id,
        tanggal,
        deskripsi_kegiatan,
        bukti,
        status,
        notes_verifikator,
        created_at,
        updated_at,
        mahasiswa_id,
        kategori_id,
        mahasiswa:mahasiswa_id (
          id,
          nim,
          nama,
          foto,
          prodi,
          semester
        ),
        kategori_poin:kategori_id (
          id,
          kode,
          nama,
          kategori_utama,
          bobot,
          jenis
        )
      `)
      .order('created_at', { ascending: false });

    // DO NOT filter by status in query - we need all data for accurate counts
    // Filter will be applied in post-processing

    const { data, error } = await query;

    console.log('📊 [Admin Verifikasi] Query result:', { 
      success: !error, 
      count: data?.length, 
      sampleData: data?.[0] 
    });

    if (error) {
      console.error('❌ [Admin Verifikasi] Error fetching pengajuan:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Post-process filtering
    let filteredData = data || [];

    // Filter by status (moved from query to post-processing)
    if (statusFilter !== 'all') {
      filteredData = filteredData.filter(
        (item: any) => item.status === statusFilter
      );
    }

    // Filter by kategori_utama
    if (kategoriFilter && kategoriFilter !== 'all') {
      filteredData = filteredData.filter(
        (item: any) => item.kategori_poin?.kategori_utama === kategoriFilter
      );
    }

    // Filter by prodi
    if (prodiFilter && prodiFilter !== 'all') {
      filteredData = filteredData.filter(
        (item: any) => item.mahasiswa?.prodi === prodiFilter
      );
    }

    // Calculate counts from ALL data (before filtering)
    // This ensures counts are always accurate regardless of active filter
    const counts = {
      all: data?.length || 0,
      pending: data?.filter((item: any) => item.status === 'pending').length || 0,
      approved: data?.filter((item: any) => item.status === 'approved').length || 0,
      rejected: data?.filter((item: any) => item.status === 'rejected').length || 0,
    };

    console.log('✅ [Admin Verifikasi] Returning data:', { 
      filteredCount: filteredData.length, 
      counts,
      sampleFilteredData: filteredData[0]
    });

    return NextResponse.json({
      success: true,
      data: filteredData,
      counts,
    });
  } catch (error) {
    console.error('Error in GET /api/verifikasi/pengajuan:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/verifikasi/pengajuan
 * Update status pengajuan (approve/reject)
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'ID dan status wajib diisi' },
        { status: 400 }
      );
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Status harus approved atau rejected' },
        { status: 400 }
      );
    }

    // Update poin_aktivitas
    const { data, error } = await supabase
      .from('poin_aktivitas')
      .update({
        status,
        notes_verifikator: notes || null,
        verified_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating pengajuan:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in PUT /api/verifikasi/pengajuan:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

