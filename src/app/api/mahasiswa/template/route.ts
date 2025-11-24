import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function GET() {
  try {
    // Create Excel workbook
    const workbook = XLSX.utils.book_new();

    // Create worksheet with headers only (no example data)
    const headers = [['NIM', 'Nama Lengkap', 'Email', 'No. Telepon', 'Program Studi', 'Angkatan', 'Semester', 'Alamat', 'Tahun Ajaran Masuk', 'Password']];
    const worksheet = XLSX.utils.aoa_to_sheet(headers);

    // Set column widths for better readability
    worksheet['!cols'] = [
      { wch: 15 },  // NIM
      { wch: 25 },  // Nama Lengkap
      { wch: 25 },  // Email
      { wch: 15 },  // No. Telepon
      { wch: 30 },  // Program Studi
      { wch: 10 },  // Angkatan
      { wch: 10 },  // Semester
      { wch: 40 },  // Alamat
      { wch: 18 },  // Tahun Ajaran Masuk
      { wch: 15 },  // Password
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Mahasiswa');

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="template_mahasiswa.xlsx"',
      },
    });
  } catch (error: any) {
    console.error('❌ Error generating template:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal membuat template' },
      { status: 500 }
    );
  }
}

