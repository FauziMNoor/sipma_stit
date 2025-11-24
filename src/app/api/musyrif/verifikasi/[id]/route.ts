import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyJWT } from '@/lib/auth';

/**
 * PUT /api/musyrif/verifikasi/[id]
 * Approve or reject pengajuan
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get token from cookie or Authorization header
    let token = request.cookies.get('auth-token')?.value;

    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - No token' },
        { status: 401 }
      );
    }

    // Verify JWT and get user info
    let payload;
    try {
      payload = verifyJWT(token);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    const userId = payload.userId;
    const { id } = await params;
    const body = await request.json();
    const { action, notes } = body;

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Action harus approve atau reject' },
        { status: 400 }
      );
    }

    // Get pengajuan data
    const { data: pengajuan, error: fetchError } = await supabaseAdmin
      .from('poin_aktivitas')
      .select(`
        *,
        mahasiswa:mahasiswa_id (
          musyrif_id
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

    // Check if this musyrif is responsible for this mahasiswa
    if (pengajuan.mahasiswa?.musyrif_id !== userId) {
      return NextResponse.json(
        { success: false, error: 'Anda tidak berwenang memverifikasi pengajuan ini' },
        { status: 403 }
      );
    }

    // Update status
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    const { data, error } = await supabaseAdmin
      .from('poin_aktivitas')
      .update({
        status: newStatus,
        verifikator_id: userId,
        notes_verifikator: notes || null,
        verified_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        id,
        tanggal,
        status,
        bukti,
        deskripsi_kegiatan,
        notes_verifikator,
        verified_at,
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
          jenis,
          bobot,
          kategori_utama
        )
      `)
      .single();

    if (error) {
      console.error('❌ Error updating pengajuan:', error);
      return NextResponse.json(
        { success: false, error: 'Gagal memperbarui status pengajuan' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: `Pengajuan berhasil ${action === 'approve' ? 'disetujui' : 'ditolak'}`,
    });
  } catch (error: any) {
    console.error('❌ Error in PUT /api/musyrif/verifikasi/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

