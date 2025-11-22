import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

// GET - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from('users')
      .select('id, email, nama, role, foto, is_active, created_at')
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Error fetching user:', error);
      return NextResponse.json(
        { success: false, error: 'Pengguna tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('❌ Error in GET /api/users/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// PUT - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { email, nama, role, password, is_active } = body;

    // Validate required fields
    if (!email || !nama || !role) {
      return NextResponse.json(
        { success: false, error: 'Email, nama, dan role wajib diisi' },
        { status: 400 }
      );
    }

    const updateData: any = {
      email,
      nama,
      role,
      is_active: is_active !== undefined ? is_active : true,
    };

    // Only update password if provided
    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select('id, email, nama, role, foto, is_active, created_at')
      .single();

    if (error) {
      console.error('❌ Error updating user:', error);
      return NextResponse.json(
        { success: false, error: 'Gagal mengupdate pengguna' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('❌ Error in PUT /api/users/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error deleting user:', error);
      return NextResponse.json(
        { success: false, error: 'Gagal menghapus pengguna' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('❌ Error in DELETE /api/users/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

