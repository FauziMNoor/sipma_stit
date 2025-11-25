import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyPassword, generateJWT } from '@/lib/auth';
import { loginSchema } from '@/lib/validation';

// Force dynamic rendering to prevent build-time data collection
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = loginSchema.parse(body);
    const { email, password } = validatedData;

    console.log('🔐 Login attempt:', { email, passwordLength: password.length });

    let user = null;
    let isMahasiswa = false;

    // Auto-detect: Email or NIM
    if (email.includes('@')) {
      console.log('📧 Detected: Email login (Staff)');
      // Login with Email (Staff: admin, waket3, dosen_pa, musyrif)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      console.log('📊 Query result:', { found: !!data, error: error?.message });

      if (error || !data) {
        console.log('❌ User not found in users table');
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_CREDENTIALS',
              message: 'Email atau password salah',
            },
          },
          { status: 401 }
        );
      }

      console.log('✅ User found:', { email: data.email, role: data.role });
      user = data;
      isMahasiswa = false;
    } else {
      console.log('🎓 Detected: NIM login (Mahasiswa)');
      // Login with NIM (Mahasiswa)
      const { data: mahasiswa, error: mahasiswaError } = await supabase
        .from('mahasiswa')
        .select('*')
        .eq('nim', email)
        .eq('is_active', true)
        .single();

      console.log('📊 Query result:', { found: !!mahasiswa, error: mahasiswaError?.message });

      if (mahasiswaError || !mahasiswa) {
        console.log('❌ Mahasiswa not found in mahasiswa table');
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_CREDENTIALS',
              message: 'NIM atau password salah',
            },
          },
          { status: 401 }
        );
      }

      console.log('✅ Mahasiswa found:', { nim: mahasiswa.nim, nama: mahasiswa.nama });
      console.log('🔑 Password check:', {
        hasPassword: !!mahasiswa.password,
        passwordLength: mahasiswa.password?.length
      });

      // Verify password for mahasiswa
      const isPasswordValid = await verifyPassword(password, mahasiswa.password);

      console.log('🔐 Password verification:', { isValid: isPasswordValid });

      if (!isPasswordValid) {
        console.log('❌ Password mismatch for mahasiswa');
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_CREDENTIALS',
              message: 'NIM atau password salah',
            },
          },
          { status: 401 }
        );
      }

      // Transform mahasiswa data to user format
      user = {
        id: mahasiswa.id,
        email: mahasiswa.nim, // Use NIM as email for consistency
        nama: mahasiswa.nama,
        role: 'mahasiswa',
        is_active: mahasiswa.is_active,
        nim: mahasiswa.nim,
        prodi: mahasiswa.prodi,
        angkatan: mahasiswa.angkatan,
      };
      isMahasiswa = true;
    }

    // Verify password for non-mahasiswa users
    if (!isMahasiswa) {
      console.log('🔑 Password check for staff:', {
        hasPassword: !!user.password,
        passwordLength: user.password?.length
      });

      const isPasswordValid = await verifyPassword(password, user.password);

      console.log('🔐 Password verification:', { isValid: isPasswordValid });

      if (!isPasswordValid) {
        console.log('❌ Password mismatch for staff');
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_CREDENTIALS',
              message: 'Email atau password salah',
            },
          },
          { status: 401 }
        );
      }
    }

    console.log('✅ Login successful:', { role: user.role, nama: user.nama });

    // Generate JWT token
    const token = generateJWT({
      userId: user.id,
      email: user.email || user.nim,
      role: user.role,
      nama: user.nama,
    });

    console.log('🔑 JWT token generated:', { tokenLength: token.length });

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;

    // Create cookie string manually for better compatibility
    const maxAge = 60 * 60 * 24 * 7; // 7 days
    const cookieValue = `auth-token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${
      process.env.NODE_ENV === 'production' ? '; Secure' : ''
    }`;

    console.log('🍪 Setting cookie:', {
      cookieLength: cookieValue.length,
      hasHttpOnly: cookieValue.includes('HttpOnly'),
      hasPath: cookieValue.includes('Path=/'),
    });

    // Create response with cookie AND token in body (for localStorage fallback)
    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token: token, // Send token in response body for localStorage
      message: 'Login berhasil',
    }, {
      headers: {
        'Set-Cookie': cookieValue,
      },
    });

    console.log('✅ Response created with Set-Cookie header and token in body');

    return response;
  } catch (error: any) {
    console.error('Login error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Data tidak valid',
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }

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

