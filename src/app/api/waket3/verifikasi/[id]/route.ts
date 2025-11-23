import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// This route is for updating specific pengajuan (PATCH only)
// For listing all pengajuan, use /api/waket3/verifikasi route (without [id])

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // This is pengajuan_id
    const body = await request.json();
    const { action, verifikator_id, notes } = body;

    if (!action || !verifikator_id) {
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

    // Update the pengajuan
    const updateData: any = {
      status: action === 'approve' ? 'approved' : 'rejected',
      verifikator_id: verifikator_id,
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
    console.error('Error in waket3 verifikasi PATCH API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

