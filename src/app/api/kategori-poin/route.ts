import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyJWT } from '@/lib/auth';

/**
 * GET /api/kategori-poin
 * Get all kategori poin (active only by default)
 * Note: No auth required - page-level protection is sufficient
 */
export async function GET(request: NextRequest) {
  try {
    // Get query params
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('include_inactive') === 'true';
    const kategoriUtama = searchParams.get('kategori_utama');

    // Build query
    let query = supabase
      .from('kategori_poin')
      .select('*')
      .order('kategori_utama', { ascending: true })
      .order('nama', { ascending: true });

    // Filter by active status
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    // Filter by kategori_utama
    if (kategoriUtama) {
      query = query.eq('kategori_utama', kategoriUtama);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching kategori poin:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in GET /api/kategori-poin:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/kategori-poin
 * Create new kategori poin
 */
export async function POST(request: NextRequest) {
  try {
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

    // Only admin can create kategori poin
    if (payload.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { kode, nama, jenis, bobot, deskripsi, kategori_utama, requires_verification } = body;

    // Validation
    if (!kode || !nama || !jenis || bobot === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if kode already exists
    const { data: existing } = await supabase
      .from('kategori_poin')
      .select('id')
      .eq('kode', kode)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Kode sudah digunakan' },
        { status: 400 }
      );
    }

    // Insert new kategori poin
    const { data, error } = await supabase
      .from('kategori_poin')
      .insert({
        kode,
        nama,
        jenis,
        bobot,
        deskripsi: deskripsi || null,
        kategori_utama: kategori_utama || null,
        requires_verification: requires_verification !== undefined ? requires_verification : true,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating kategori poin:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/kategori-poin:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

