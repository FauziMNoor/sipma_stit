import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Try to get token from Authorization header (localStorage fallback)
    const authHeader = request.headers.get('authorization');
    let token: string | undefined;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
      console.log('📊 Token from Authorization header:', { tokenLength: token.length });
    } else {
      // Fallback to cookie
      token = request.cookies.get('auth-token')?.value;
      console.log('📊 Token from cookie:', { hasToken: !!token });
    }

    if (!token) {
      console.log('❌ No token found');
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Tidak terautentikasi',
          },
        },
        { status: 401 }
      );
    }

    // Verify JWT
    const currentUser = verifyJWT(token);
    console.log('📊 /api/auth/me - Current user from JWT:', currentUser);

    if (!currentUser) {
      console.log('❌ No current user found in JWT');
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Tidak terautentikasi',
          },
        },
        { status: 401 }
      );
    }

    let user = null;

    // Check if user is mahasiswa (role = 'mahasiswa')
    if (currentUser.role === 'mahasiswa') {
      console.log('🎓 Fetching mahasiswa data...');
      // Fetch from mahasiswa table
      const { data: mahasiswaData, error: mahasiswaError } = await supabase
        .from('mahasiswa')
        .select('id, nim, nama, prodi, angkatan, foto, is_active, created_at, updated_at')
        .eq('id', currentUser.userId)
        .single();

      if (mahasiswaError || !mahasiswaData) {
        console.log('❌ Mahasiswa not found:', mahasiswaError?.message);
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'USER_NOT_FOUND',
              message: 'Mahasiswa tidak ditemukan',
            },
          },
          { status: 404 }
        );
      }

      // Transform to user format
      user = {
        id: mahasiswaData.id,
        email: mahasiswaData.nim,
        nama: mahasiswaData.nama,
        role: 'mahasiswa',
        foto: mahasiswaData.foto,
        is_active: mahasiswaData.is_active,
        nim: mahasiswaData.nim,
        prodi: mahasiswaData.prodi,
        angkatan: mahasiswaData.angkatan,
        created_at: mahasiswaData.created_at,
        updated_at: mahasiswaData.updated_at,
      };
    } else {
      console.log('👤 Fetching staff/admin data...');
      // Fetch from users table (staff/admin)
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, nama, role, foto, is_active, created_at, updated_at')
        .eq('id', currentUser.userId)
        .single();

      if (userError || !userData) {
        console.log('❌ User not found:', userError?.message);
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'USER_NOT_FOUND',
              message: 'User tidak ditemukan',
            },
          },
          { status: 404 }
        );
      }

      user = userData;
    }

    console.log('✅ User data fetched:', { id: user.id, role: user.role, nama: user.nama });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('❌ Get current user error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Terjadi kesalahan server',
        },
      },
      { status: 500 }
    );
  }
}

