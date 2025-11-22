import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

// GET - Fetch all mahasiswa
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const prodi = searchParams.get('prodi');

    let query = supabase
      .from('mahasiswa')
      .select('*')
      .order('nama', { ascending: true });

    if (search) {
      query = query.or(`nama.ilike.%${search}%,nim.ilike.%${search}%`);
    }

    if (prodi) {
      query = query.eq('prodi', prodi);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error fetching mahasiswa:', error);
      return NextResponse.json(
        { success: false, error: 'Gagal mengambil data mahasiswa' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('❌ Error in GET /api/mahasiswa:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// POST - Create new mahasiswa
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nim, nama, prodi, angkatan, semester, password, foto, tahun_ajaran_masuk } = body;

    // Validation
    if (!nim || !nama || !prodi || !angkatan || !semester || !password) {
      return NextResponse.json(
        { success: false, error: 'Semua field wajib diisi' },
        { status: 400 }
      );
    }

    // Auto-generate tahun_ajaran_masuk if not provided
    let tahunAjaranMasuk = tahun_ajaran_masuk;
    if (!tahunAjaranMasuk) {
      // Get from system settings or calculate from angkatan
      const { data: settingData } = await supabase
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', 'tahun_ajaran_aktif')
        .single();

      tahunAjaranMasuk = settingData?.setting_value || `${angkatan}/${parseInt(angkatan) + 1}`;
    }

    // Check if NIM already exists
    const { data: existing } = await supabase
      .from('mahasiswa')
      .select('nim')
      .eq('nim', nim)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'NIM sudah terdaftar' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert mahasiswa
    const { data, error } = await supabase
      .from('mahasiswa')
      .insert({
        nim,
        nama,
        prodi,
        angkatan: typeof angkatan === 'number' ? angkatan : parseInt(angkatan),
        semester: typeof semester === 'number' ? semester : parseInt(semester),
        tahun_ajaran_masuk: tahunAjaranMasuk,
        password: hashedPassword,
        foto: foto || null,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating mahasiswa:', error);
      return NextResponse.json(
        { success: false, error: 'Gagal menambahkan mahasiswa' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('❌ Error in POST /api/mahasiswa:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

