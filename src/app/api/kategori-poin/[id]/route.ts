import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyJWT } from '@/lib/auth';

// Force dynamic rendering to prevent build-time data collection
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


/**
 * GET /api/kategori-poin/[id]
 * Get single kategori poin by ID
 * Note: No auth required - page-level protection is sufficient
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const { data, error } = await supabase
      .from('kategori_poin')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching kategori poin:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in GET /api/kategori-poin/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/kategori-poin/[id]
 * Update kategori poin
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Verify authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let payload;
    try {
      payload = verifyJWT(token);
    } catch (error) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin can update kategori poin
    if (payload.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { kode, nama, jenis, bobot, deskripsi, kategori_utama, requires_verification } = body;

    // Check if kategori exists
    const { data: existing } = await supabase
      .from('kategori_poin')
      .select('id, kode')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    // Check if kode is being changed and if new kode already exists
    if (kode && kode !== existing.kode) {
      const { data: duplicate } = await supabase
        .from('kategori_poin')
        .select('id')
        .eq('kode', kode)
        .neq('id', id)
        .single();

      if (duplicate) {
        return NextResponse.json(
          { success: false, error: 'Kode sudah digunakan' },
          { status: 400 }
        );
      }
    }

    // Update kategori poin
    const { data, error } = await supabase
      .from('kategori_poin')
      .update({
        kode,
        nama,
        jenis,
        bobot,
        deskripsi: deskripsi || null,
        kategori_utama: kategori_utama || null,
        requires_verification: requires_verification !== undefined ? requires_verification : true,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating kategori poin:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in PUT /api/kategori-poin/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/kategori-poin/[id]
 * Delete (soft delete) kategori poin
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Verify authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let payload;
    try {
      payload = verifyJWT(token);
    } catch (error) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin can delete kategori poin
    if (payload.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    // Soft delete: set is_active to false
    const { data, error } = await supabase
      .from('kategori_poin')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error deleting kategori poin:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in DELETE /api/kategori-poin/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

