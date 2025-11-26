import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/master-prodi
 * Get all prodi or filter by active status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active_only') === 'true';

    let query = supabase
      .from('master_prodi')
      .select('*')
      .order('nama_prodi', { ascending: true });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching prodi:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch prodi' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error('Error in GET /api/master-prodi:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/master-prodi
 * Create new prodi
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kode_prodi, nama_prodi, is_active = true } = body;

    // Validation
    if (!kode_prodi || !nama_prodi) {
      return NextResponse.json(
        { success: false, error: 'Kode prodi dan nama prodi wajib diisi' },
        { status: 400 }
      );
    }

    // Check if kode_prodi already exists
    const { data: existing } = await supabaseAdmin
      .from('master_prodi')
      .select('id')
      .eq('kode_prodi', kode_prodi)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Kode prodi sudah digunakan' },
        { status: 400 }
      );
    }

    // Insert new prodi
    const { data, error } = await supabaseAdmin
      .from('master_prodi')
      .insert({
        kode_prodi: kode_prodi.toUpperCase(),
        nama_prodi,
        is_active,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating prodi:', error);
      return NextResponse.json(
        { success: false, error: 'Gagal menambahkan prodi' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Prodi berhasil ditambahkan',
    });
  } catch (error) {
    console.error('Error in POST /api/master-prodi:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/master-prodi
 * Update prodi
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, kode_prodi, nama_prodi, is_active } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID prodi wajib diisi' },
        { status: 400 }
      );
    }

    // Build update object
    const updateData: any = { updated_at: new Date().toISOString() };
    if (kode_prodi !== undefined) updateData.kode_prodi = kode_prodi.toUpperCase();
    if (nama_prodi !== undefined) updateData.nama_prodi = nama_prodi;
    if (is_active !== undefined) updateData.is_active = is_active;

    // Update prodi
    const { data, error } = await supabaseAdmin
      .from('master_prodi')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating prodi:', error);
      return NextResponse.json(
        { success: false, error: 'Gagal mengupdate prodi' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Prodi berhasil diupdate',
    });
  } catch (error) {
    console.error('Error in PUT /api/master-prodi:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/master-prodi
 * Delete prodi (soft delete by setting is_active to false)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID prodi wajib diisi' },
        { status: 400 }
      );
    }

    // Check if prodi is used by any mahasiswa
    const { data: mahasiswaCount } = await supabaseAdmin
      .from('mahasiswa')
      .select('id', { count: 'exact', head: true })
      .eq('prodi', id);

    // Soft delete (set is_active to false) instead of hard delete
    const { error } = await supabaseAdmin
      .from('master_prodi')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error deleting prodi:', error);
      return NextResponse.json(
        { success: false, error: 'Gagal menghapus prodi' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Prodi berhasil dinonaktifkan',
    });
  } catch (error) {
    console.error('Error in DELETE /api/master-prodi:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
