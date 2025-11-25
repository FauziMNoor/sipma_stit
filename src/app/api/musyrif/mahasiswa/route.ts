import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyJWT } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/musyrif/mahasiswa
 * Get all mahasiswa under this musyrif
 */
export async function GET(request: NextRequest) {
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

    // Get mahasiswa under this musyrif
    let query = supabaseAdmin
      .from('mahasiswa')
      .select('id, nim, nama, foto, musyrif_id')
      .eq('is_active', true)
      .order('nama', { ascending: true });

    // Try to filter by musyrif_id first
    const { data: mahasiswaList, error } = await query.eq('musyrif_id', userId);

    if (error) {
      console.error('Error fetching mahasiswa:', error);
      return NextResponse.json(
        { success: false, error: 'Gagal mengambil data mahasiswa' },
        { status: 500 }
      );
    }

    // If no mahasiswa found for this musyrif, get all mahasiswa as fallback
    let finalData = mahasiswaList || [];
    
    if (finalData.length === 0) {
      console.log('No mahasiswa found for musyrif:', userId);
      console.log('Fetching all active mahasiswa as fallback...');
      
      const { data: allMahasiswa, error: allError } = await supabaseAdmin
        .from('mahasiswa')
        .select('id, nim, nama, foto, musyrif_id')
        .eq('is_active', true)
        .order('nama', { ascending: true });

      if (!allError && allMahasiswa) {
        finalData = allMahasiswa;
        console.log(`Found ${allMahasiswa.length} total mahasiswa`);
      }
    } else {
      console.log(`Found ${finalData.length} mahasiswa for musyrif ${userId}`);
    }

    // Remove musyrif_id from response for cleaner data
    const responseData = finalData.map(({ musyrif_id, ...rest }) => rest);

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error: any) {
    console.error('❌ Error in GET /api/musyrif/mahasiswa:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
