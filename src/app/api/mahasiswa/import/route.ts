import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import * as XLSX from 'xlsx';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'File tidak ditemukan' },
        { status: 400 }
      );
    }

    let dataRows: string[][] = [];

    // Check file type and parse accordingly
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      // Parse Excel file
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

      // Skip header row
      dataRows = jsonData.slice(1).filter(row => row && row.length > 0);
    } else if (file.name.endsWith('.csv')) {
      // Parse CSV file
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());

      if (lines.length < 1) {
        return NextResponse.json(
          { success: false, error: 'File kosong atau tidak valid' },
          { status: 400 }
        );
      }

      // Skip header row and parse CSV
      dataRows = lines.slice(1).map(line =>
        line.split(',').map(col => col.trim().replace(/^"|"$/g, ''))
      );
    } else {
      return NextResponse.json(
        { success: false, error: 'Format file tidak didukung. Gunakan .xlsx atau .csv' },
        { status: 400 }
      );
    }

    if (dataRows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'File tidak memiliki data' },
        { status: 400 }
      );
    }
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];

      // Skip empty rows
      if (!row || row.every(col => !col || col === '')) continue;

      const [nim, nama, prodi, angkatan, semester, tahun_ajaran_masuk, password] = row.map(col =>
        typeof col === 'string' ? col.trim() : String(col || '').trim()
      );

      // Validate required fields
      if (!nim || !nama || !prodi || !angkatan || !semester || !password) {
        results.failed++;
        results.errors.push(`Baris ${i + 2}: Data tidak lengkap`);
        continue;
      }

      try {
        // Check if NIM already exists
        const { data: existing } = await supabase
          .from('mahasiswa')
          .select('nim')
          .eq('nim', nim)
          .single();

        if (existing) {
          results.failed++;
          results.errors.push(`Baris ${i + 2}: NIM ${nim} sudah terdaftar`);
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Auto-generate tahun_ajaran_masuk if not provided
        let finalTahunAjaranMasuk = tahun_ajaran_masuk;
        if (!finalTahunAjaranMasuk || finalTahunAjaranMasuk === '') {
          // Get from system settings or calculate from angkatan
          const { data: settingData } = await supabase
            .from('system_settings')
            .select('setting_value')
            .eq('setting_key', 'tahun_ajaran_aktif')
            .single();

          finalTahunAjaranMasuk = settingData?.setting_value || `${angkatan}/${parseInt(angkatan) + 1}`;
        }

        // Insert mahasiswa
        const { error } = await supabase
          .from('mahasiswa')
          .insert({
            nim,
            nama,
            prodi,
            angkatan: parseInt(angkatan),
            semester: parseInt(semester),
            tahun_ajaran_masuk: finalTahunAjaranMasuk,
            password: hashedPassword,
            is_active: true,
          });

        if (error) {
          results.failed++;
          results.errors.push(`Baris ${i + 2}: ${error.message}`);
        } else {
          results.success++;
        }
      } catch (error: any) {
        results.failed++;
        results.errors.push(`Baris ${i + 2}: ${error.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error: any) {
    console.error('❌ Error in POST /api/mahasiswa/import:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

