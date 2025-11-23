import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

/**
 * GET /api/users
 * Get all users with optional filters
 * Query params: role (all, admin, dosen, staff), search
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roleFilter = searchParams.get('role');
    const searchQuery = searchParams.get('search');

    // Build query
    let query = supabase
      .from('users')
      .select('id, email, nama, nip, role, foto, is_active, created_at')
      .order('created_at', { ascending: false });

    // Filter by role
    if (roleFilter && roleFilter !== 'all') {
      query = query.eq('role', roleFilter);
    }

    // Search by name or email
    if (searchQuery) {
      query = query.or(`nama.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error fetching users:', error);
      return NextResponse.json(
        { success: false, error: 'Gagal mengambil data pengguna' },
        { status: 500 }
      );
    }

    // Calculate counts
    const { data: allUsers } = await supabase.from('users').select('role');
    const counts = {
      all: allUsers?.length || 0,
      admin: allUsers?.filter((u: any) => u.role === 'admin').length || 0,
      dosen: allUsers?.filter((u: any) => u.role === 'dosen').length || 0,
      dosen_pa: allUsers?.filter((u: any) => u.role === 'dosen_pa').length || 0,
      musyrif: allUsers?.filter((u: any) => u.role === 'musyrif').length || 0,
      waket3: allUsers?.filter((u: any) => u.role === 'waket3').length || 0,
      staff: allUsers?.filter((u: any) => u.role === 'staff').length || 0,
      mahasiswa: allUsers?.filter((u: any) => u.role === 'mahasiswa').length || 0,
    };

    return NextResponse.json({
      success: true,
      data,
      counts,
    });
  } catch (error: any) {
    console.error('❌ Error in GET /api/users:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users
 * Create new user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, nama, nip, role, password, is_active = true } = body;

    // Validation
    if (!email || !nama || !role || !password) {
      return NextResponse.json(
        { success: false, error: 'Email, nama, role, dan password wajib diisi' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['mahasiswa', 'dosen', 'dosen_pa', 'musyrif', 'waket3', 'admin', 'staff'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Role tidak valid' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password minimal 8 karakter' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existing } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const { data, error } = await supabase
      .from('users')
      .insert({
        email,
        nama,
        nip: nip || null,
        role,
        password: hashedPassword,
        is_active,
      })
      .select('id, email, nama, nip, role, foto, is_active, created_at')
      .single();

    if (error) {
      console.error('❌ Error creating user:', error);
      return NextResponse.json(
        { success: false, error: 'Gagal membuat pengguna' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Pengguna berhasil ditambahkan',
    });
  } catch (error: any) {
    console.error('❌ Error in POST /api/users:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/users
 * Update user (edit or toggle status or reset password)
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, email, nama, nip, role, foto, is_active, new_password } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID pengguna wajib diisi' },
        { status: 400 }
      );
    }

    // Handle different actions
    if (action === 'toggle_status') {
      // Toggle active status
      const { data, error } = await supabase
        .from('users')
        .update({ is_active })
        .eq('id', id)
        .select('id, email, nama, nip, role, foto, is_active, created_at')
        .single();

      if (error) {
        console.error('❌ Error toggling status:', error);
        return NextResponse.json(
          { success: false, error: 'Gagal mengubah status' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data,
        message: `Status pengguna berhasil diubah menjadi ${is_active ? 'aktif' : 'nonaktif'}`,
      });
    } else if (action === 'reset_password') {
      // Reset password
      if (!new_password || new_password.length < 8) {
        return NextResponse.json(
          { success: false, error: 'Password baru minimal 8 karakter' },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(new_password, 10);

      const { data, error } = await supabase
        .from('users')
        .update({ password: hashedPassword })
        .eq('id', id)
        .select('id, email, nama, nip, role, foto, is_active, created_at')
        .single();

      if (error) {
        console.error('❌ Error resetting password:', error);
        return NextResponse.json(
          { success: false, error: 'Gagal reset password' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data,
        message: 'Password berhasil direset',
      });
    } else {
      // Update user data (edit)
      if (!email || !nama || !role) {
        return NextResponse.json(
          { success: false, error: 'Email, nama, dan role wajib diisi' },
          { status: 400 }
        );
      }

      const validRoles = ['mahasiswa', 'dosen', 'dosen_pa', 'musyrif', 'waket3', 'admin', 'staff'];
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { success: false, error: 'Role tidak valid' },
          { status: 400 }
        );
      }

      // Check if email already exists (except current user)
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .neq('id', id)
        .single();

      if (existing) {
        return NextResponse.json(
          { success: false, error: 'Email sudah digunakan pengguna lain' },
          { status: 400 }
        );
      }

      // Build update object
      const updateData: any = { email, nama, role };
      if (nip !== undefined) {
        updateData.nip = nip || null;
      }
      if (foto !== undefined) {
        updateData.foto = foto;
      }

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select('id, email, nama, nip, role, foto, is_active, created_at')
        .single();

      if (error) {
        console.error('❌ Error updating user:', error);
        return NextResponse.json(
          { success: false, error: 'Gagal mengupdate pengguna' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data,
        message: 'Data pengguna berhasil diupdate',
      });
    }
  } catch (error: any) {
    console.error('❌ Error in PUT /api/users:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users
 * Delete user
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID pengguna wajib diisi' },
        { status: 400 }
      );
    }

    const { error } = await supabase.from('users').delete().eq('id', id);

    if (error) {
      console.error('❌ Error deleting user:', error);
      return NextResponse.json(
        { success: false, error: 'Gagal menghapus pengguna' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Pengguna berhasil dihapus',
    });
  } catch (error: any) {
    console.error('❌ Error in DELETE /api/users:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

