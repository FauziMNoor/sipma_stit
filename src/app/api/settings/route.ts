import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Get all settings or specific category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = supabase
      .from('system_settings')
      .select('*')
      .order('category', { ascending: true })
      .order('setting_key', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error fetching settings:', error);
      return NextResponse.json(
        { success: false, error: 'Gagal mengambil pengaturan' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('❌ Error in GET /api/settings:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// PUT - Update a setting
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { setting_key, setting_value } = body;

    if (!setting_key || setting_value === undefined) {
      return NextResponse.json(
        { success: false, error: 'setting_key dan setting_value wajib diisi' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('system_settings')
      .update({ setting_value: String(setting_value) })
      .eq('setting_key', setting_key)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating setting:', error);
      return NextResponse.json(
        { success: false, error: 'Gagal mengupdate pengaturan' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('❌ Error in PUT /api/settings:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

