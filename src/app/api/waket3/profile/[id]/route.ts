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
    const { id } = await context.params;

    // 1. Fetch waket3 data
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

    // 2. Count verification statistics
    // Total verified (approved + rejected)
    const { count: totalVerified, error: verifiedError } = await supabaseAdmin
      .from('poin_aktivitas')
      .select('*', { count: 'exact', head: true })
      .eq('verifikator_id', id)
      .in('status', ['approved', 'rejected']);

    if (verifiedError) {
      console.error('Error counting total verified:', verifiedError);
    }

    // Total approved
    const { count: totalApproved, error: approvedError } = await supabaseAdmin
      .from('poin_aktivitas')
      .select('*', { count: 'exact', head: true })
      .eq('verifikator_id', id)
      .eq('status', 'approved');

    if (approvedError) {
      console.error('Error counting approved:', approvedError);
    }

    // Total rejected
    const { count: totalRejected, error: rejectedError } = await supabaseAdmin
      .from('poin_aktivitas')
      .select('*', { count: 'exact', head: true })
      .eq('verifikator_id', id)
      .eq('status', 'rejected');

    if (rejectedError) {
      console.error('Error counting rejected:', rejectedError);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: waket3.id,
        nama: waket3.nama,
        nip: waket3.nip,
        email: waket3.email,
        foto: waket3.foto,
        stats: {
          total_verified: totalVerified || 0,
          total_approved: totalApproved || 0,
          total_rejected: totalRejected || 0,
        },
      },
    });
  } catch (error) {
    console.error('Error in waket3 profile API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

