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

    // Build query with joins
    let query = supabase
      .from('poin_aktivitas')
      .select(`
        *,
        mahasiswa:mahasiswa_id (
          id,
          nim,
          nama,
          foto,
          prodi,
          semester
        ),
        kategori_poin:kategori_poin_id (
          id,
          kode,
          nama,
          kategori_utama,
          bobot,
          jenis
        )
      `)
      .order('created_at', { ascending: false });

    // Filter by status
    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    // Filter by kategori
    if (kategoriFilter && kategoriFilter !== 'all') {
      // We need to filter by kategori_utama from kategori_poin
      // This requires a subquery or post-processing
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching pengajuan:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Post-process filtering
    let filteredData = data || [];

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

    // Calculate counts
    const counts = {
      all: data?.length || 0,
      pending: data?.filter((item: any) => item.status === 'pending').length || 0,
      approved: data?.filter((item: any) => item.status === 'approved').length || 0,
      rejected: data?.filter((item: any) => item.status === 'rejected').length || 0,
    };

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

