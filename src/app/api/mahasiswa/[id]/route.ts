import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

// GET - Fetch single mahasiswa
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from('mahasiswa')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: 'Mahasiswa tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('❌ Error in GET /api/mahasiswa/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// PUT - Update mahasiswa
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('📝 PUT /api/mahasiswa/[id] - ID:', id);
    const body = await request.json();
    console.log('📝 PUT /api/mahasiswa/[id] - Body:', body);
    const { nim, nama, prodi, angkatan, semester, password, foto, is_active, tahun_ajaran_masuk } = body;

    // Validate required fields
    if (!nim || !nama || !prodi || !angkatan || !semester) {
      console.error('❌ Validation failed:', { nim, nama, prodi, angkatan, semester });
      return NextResponse.json(
        { success: false, error: 'Semua field wajib diisi' },
        { status: 400 }
      );
    }

    const updateData: any = {
      nim,
      nama,
      prodi,
      angkatan: typeof angkatan === 'number' ? angkatan : parseInt(angkatan),
      semester: typeof semester === 'number' ? semester : parseInt(semester),
      is_active: is_active !== undefined ? is_active : true,
    };

    // Update tahun_ajaran_masuk if provided
    if (tahun_ajaran_masuk) {
      updateData.tahun_ajaran_masuk = tahun_ajaran_masuk;
    }

    // Update foto if provided
    if (foto !== undefined) {
      updateData.foto = foto;
    }

    // Only update password if provided
    if (password && password.trim() !== '') {
      try {
        console.log('🔐 Hashing password...');
        updateData.password = await bcrypt.hash(password, 10);
        console.log('✅ Password hashed successfully');
      } catch (hashError) {
        console.error('❌ Error hashing password:', hashError);
        return NextResponse.json(
          { success: false, error: 'Gagal mengenkripsi password' },
          { status: 500 }
        );
      }
    }

    console.log('📝 Update data:', updateData);

    const { data, error } = await supabase
      .from('mahasiswa')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating mahasiswa:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { success: false, error: `Gagal mengupdate mahasiswa: ${error.message}` },
        { status: 500 }
      );
    }

    console.log('✅ Update successful:', data);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('❌ Error in PUT /api/mahasiswa/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// DELETE - Delete mahasiswa
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from('mahasiswa')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error deleting mahasiswa:', error);
      return NextResponse.json(
        { success: false, error: 'Gagal menghapus mahasiswa' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Mahasiswa berhasil dihapus' });
  } catch (error: any) {
    console.error('❌ Error in DELETE /api/mahasiswa/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

