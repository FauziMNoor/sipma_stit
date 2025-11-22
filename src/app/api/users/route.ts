import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

// GET - Get all users or filter by role
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    let query = supabase
      .from('users')
      .select('id, email, nama, role, foto, is_active, created_at')
      .order('created_at', { ascending: false });

    if (role) {
      query = query.eq('role', role);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error fetching users:', error);
      return NextResponse.json(
        { success: false, error: 'Gagal mengambil data pengguna' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('❌ Error in GET /api/users:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// POST - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, nama, role, password } = body;

    // Validation
    if (!email || !nama || !role || !password) {
      return NextResponse.json(
        { success: false, error: 'Semua field wajib diisi' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['admin', 'dosen_pa', 'musyrif', 'waket3'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Role tidak valid' },
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
        role,
        password: hashedPassword,
        is_active: true,
      })
      .select('id, email, nama, role, foto, is_active, created_at')
      .single();

    if (error) {
      console.error('❌ Error creating user:', error);
      return NextResponse.json(
        { success: false, error: 'Gagal membuat pengguna' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('❌ Error in POST /api/users:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

