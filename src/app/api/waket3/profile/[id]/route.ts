import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Get waket3 profile
    const { data: waket3, error: waket3Error } = await supabaseAdmin
      .from('users')
      .select('id, nama, nip, email, foto')
      .eq('id', id)
      .eq('role', 'waket3')
      .single();

    if (waket3Error || !waket3) {
      return NextResponse.json(
        { success: false, error: 'Waket3 not found' },
        { status: 404 }
      );
    }

    // Get verification stats
    const { count: totalVerified } = await supabaseAdmin
      .from('kegiatan_mahasiswa')
      .select('*', { count: 'exact', head: true })
      .eq('verified_by', id)
      .in('status', ['approved', 'rejected']);

    const { count: totalApproved } = await supabaseAdmin
      .from('kegiatan_mahasiswa')
      .select('*', { count: 'exact', head: true })
      .eq('verified_by', id)
      .eq('status', 'approved');

    const { count: totalRejected } = await supabaseAdmin
      .from('kegiatan_mahasiswa')
      .select('*', { count: 'exact', head: true })
      .eq('verified_by', id)
      .eq('status', 'rejected');

    return NextResponse.json({
      success: true,
      data: {
        ...waket3,
        stats: {
          total_verified: totalVerified || 0,
          total_approved: totalApproved || 0,
          total_rejected: totalRejected || 0,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching waket3 profile:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { nama, nip, email, no_hp, foto } = body;

    if (!nama || !email) {
      return NextResponse.json(
        { success: false, error: 'Nama dan email wajib diisi' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      nama,
      email,
      updated_at: new Date().toISOString(),
    };

    if (nip !== undefined) updateData.nip = nip;
    if (no_hp !== undefined) updateData.no_hp = no_hp;
    if (foto !== undefined) updateData.foto = foto;

    // Update user profile
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', id)
      .eq('role', 'waket3')
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return NextResponse.json(
        { success: false, error: 'Gagal memperbarui profil' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error in PUT profile API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
