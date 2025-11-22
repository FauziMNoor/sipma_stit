'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { generateJWT } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  console.log('🔐 Server Action - Login attempt:', { email, passwordLength: password?.length });

  if (!email || !password) {
    return {
      success: false,
      error: 'Email dan password harus diisi',
    };
  }

  let user: any = null;
  let isMahasiswa = false;

  try {

    // Auto-detect: Email or NIM
    if (email.includes('@')) {
      console.log('📧 Detected: Email login (Staff)');
      // Login with Email (Staff)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        console.log('❌ User not found');
        return {
          success: false,
          error: 'Email atau password salah',
        };
      }

      // Verify password
      const isValid = await bcrypt.compare(password, data.password);
      if (!isValid) {
        console.log('❌ Password mismatch');
        return {
          success: false,
          error: 'Email atau password salah',
        };
      }

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

      if (mahasiswaError || !mahasiswa) {
        console.log('❌ Mahasiswa not found');
        return {
          success: false,
          error: 'NIM atau password salah',
        };
      }

      // Verify password
      const isValid = await bcrypt.compare(password, mahasiswa.password);
      if (!isValid) {
        console.log('❌ Password mismatch');
        return {
          success: false,
          error: 'NIM atau password salah',
        };
      }

      // Transform mahasiswa data to user format
      user = {
        id: mahasiswa.id,
        email: mahasiswa.nim,
        nama: mahasiswa.nama,
        role: 'mahasiswa',
        is_active: mahasiswa.is_active,
        nim: mahasiswa.nim,
        prodi: mahasiswa.prodi,
        angkatan: mahasiswa.angkatan,
      };
      isMahasiswa = true;
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

    // Set cookie using Server Action (more reliable)
    const cookieStore = await cookies();

    // Try to set cookie with explicit await
    await cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    console.log('✅ Cookie set via Server Action');

    // Verify cookie was set
    const verifyToken = cookieStore.get('auth-token');
    console.log('🔍 Verify cookie after set:', { hasToken: !!verifyToken, tokenLength: verifyToken?.value?.length });
  } catch (error: any) {
    console.error('❌ Login error:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan saat login',
    };
  }

  // Redirect based on role (outside try-catch so redirect() can throw properly)
  const redirectPath = user.role === 'admin' ? '/admin' : '/dashboard';
  console.log('🚀 Redirecting to:', redirectPath);
  redirect(redirectPath);
}

