import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyJWT } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/admin/profile/[id]
 * Get admin profile data with stats
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify authentication - check cookie first, then Authorization header
    let token = request.cookies.get('auth-token')?.value;

    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Tidak terautentikasi' },
        { status: 401 }
      );
    }

    const payload = verifyJWT(token);
    if (payload.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Hanya admin yang dapat mengakses' },
        { status: 403 }
      );
    }

    // Fetch admin profile
    const { data: admin, error: adminError } = await supabaseAdmin
      .from('users')
      .select('id, nama, email, foto')
      .eq('id', id)
      .eq('role', 'admin')
      .single();

    if (adminError || !admin) {
      console.error('Error fetching admin:', adminError);
      return NextResponse.json(
        { success: false, error: 'Admin tidak ditemukan' },
        { status: 404 }
      );
    }

    // Get total users count
    const { count: totalUsers, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true);

    if (usersError) {
      console.error('Error counting users:', usersError);
    }

    // Get total mahasiswa count
    const { count: totalMahasiswa, error: mahasiswaError } = await supabaseAdmin
      .from('mahasiswa')
      .select('id', { count: 'exact', head: true });

    if (mahasiswaError) {
      console.error('Error counting mahasiswa:', mahasiswaError);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: admin.id,
        nama: admin.nama,
        email: admin.email,
        foto: admin.foto,
        total_users: totalUsers || 0,
        total_mahasiswa: totalMahasiswa || 0,
      },
    });
  } catch (error: any) {
    console.error('❌ Error in GET /api/admin/profile/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/profile/[id]
 * Update admin profile (nama, email)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify authentication - check cookie first, then Authorization header
    let token = request.cookies.get('auth-token')?.value;

    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Tidak terautentikasi' },
        { status: 401 }
      );
    }

    const payload = verifyJWT(token);
    if (payload.role !== 'admin' || payload.userId !== id) {
      return NextResponse.json(
        { success: false, error: 'Tidak memiliki akses' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { nama, email, no_hp, foto } = body;

    if (!nama || !email) {
      return NextResponse.json(
        { success: false, error: 'Nama dan email harus diisi' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      nama,
      email,
      updated_at: new Date().toISOString(),
    };

    if (no_hp !== undefined) updateData.no_hp = no_hp;
    if (foto !== undefined) updateData.foto = foto;

    // Update admin profile
    const { data: updatedAdmin, error: updateError } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', id)
      .eq('role', 'admin')
      .select()
      .single();

    if (updateError) {
      console.error('Error updating admin:', updateError);
      return NextResponse.json(
        { success: false, error: 'Gagal mengupdate profil' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedAdmin,
      message: 'Profil berhasil diupdate',
    });
  } catch (error: any) {
    console.error('❌ Error in PUT /api/admin/profile/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
