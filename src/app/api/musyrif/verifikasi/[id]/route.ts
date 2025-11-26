import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Force dynamic rendering to prevent build-time data collection
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET - Fetch detail pengajuan
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const { data, error } = await supabaseAdmin
      .from('poin_aktivitas')
      .select(`
        id,
        mahasiswa_id,
        kategori_id,
        tanggal,
        deskripsi_kegiatan,
        bukti,
        status,
        notes_verifikator,
        verified_at,
        verifikator_id,
        created_at,
        mahasiswa:mahasiswa_id (
          id,
          nim,
          nama,
          foto
        ),
        kategori_poin:kategori_id (
          id,
          kode,
          nama,
          bobot,
          jenis,
          kategori_utama
        ),
        verifikator:verifikator_id (
          nama
        )
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching pengajuan:', error);
      return NextResponse.json(
        { success: false, error: 'Pengajuan tidak ditemukan' },
        { status: 404 }
      );
    }

    // Format response
    const mahasiswa = Array.isArray(data.mahasiswa) ? data.mahasiswa[0] : data.mahasiswa;
    const kategoriPoin = Array.isArray(data.kategori_poin) ? data.kategori_poin[0] : data.kategori_poin;
    const verifikator = Array.isArray(data.verifikator) ? data.verifikator[0] : data.verifikator;

    const formattedData = {
      id: data.id,
      mahasiswa_id: data.mahasiswa_id,
      mahasiswa_nama: mahasiswa?.nama || '',
      mahasiswa_nim: mahasiswa?.nim || '',
      mahasiswa_foto: mahasiswa?.foto,
      kategori_id: data.kategori_id,
      kategori_nama: kategoriPoin?.nama || '',
      kategori_poin: kategoriPoin?.bobot || 0,
      kategori_jenis: kategoriPoin?.jenis || 'positif',
      kategori_utama: kategoriPoin?.kategori_utama || '',
      deskripsi_kegiatan: data.deskripsi_kegiatan,
      tanggal: data.tanggal,
      bukti: data.bukti,
      status: data.status,
      notes_verifikator: data.notes_verifikator,
      verified_at: data.verified_at,
      verifikator_nama: verifikator?.nama,
      created_at: data.created_at,
    };

    return NextResponse.json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error('Error in musyrif verifikasi GET API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update pengajuan (approve/reject)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { action, musyrif_id, notes } = body;

    if (!action || !musyrif_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      );
    }

    // 1. Get pengajuan with kategori info
    const { data: pengajuan, error: fetchError } = await supabaseAdmin
      .from('poin_aktivitas')
      .select(`
        *,
        kategori_poin:kategori_id (
          kategori_utama
        )
      `)
      .eq('id', id)
      .single();

    if (fetchError || !pengajuan) {
      return NextResponse.json(
        { success: false, error: 'Pengajuan tidak ditemukan' },
        { status: 404 }
      );
    }

    // 2. Verify kategori is Adab (musyrif only handles Adab)
    const kategoriUtama = pengajuan.kategori_poin?.kategori_utama;
    if (kategoriUtama !== 'Adab') {
      return NextResponse.json(
        {
          success: false,
          error: 'Musyrif hanya bisa memverifikasi kategori Adab'
        },
        { status: 403 }
      );
    }

    // Update the pengajuan
    const updateData: any = {
      status: action === 'approve' ? 'approved' : 'rejected',
      verifikator_id: musyrif_id,
      verified_at: new Date().toISOString(),
    };

    if (notes) {
      updateData.notes_verifikator = notes;
    }

    const { data, error } = await supabaseAdmin
      .from('poin_aktivitas')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating pengajuan:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update pengajuan' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('Error in musyrif verifikasi PATCH API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
