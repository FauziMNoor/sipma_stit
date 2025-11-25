import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Force dynamic rendering to prevent build-time data collection
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = (formData.get('bucket') as string) || 'mahasiswa-photos'; // Default bucket

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'File tidak ditemukan' },
        { status: 400 }
      );
    }

    console.log('📤 Upload request - Bucket:', bucket, 'File:', file.name);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Tipe file tidak didukung. Gunakan JPG, PNG, atau WEBP' },
        { status: 400 }
      );
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Ukuran file maksimal 2MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomString}.${extension}`;

    // Convert File to ArrayBuffer then to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    console.log('📤 Uploading to bucket:', bucket, '| File:', filename, '| Size:', buffer.length, 'bytes');
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('❌ Error uploading to Supabase:', error);
      console.error('Bucket:', bucket, '| Error details:', JSON.stringify(error, null, 2));
      
      // Check if bucket doesn't exist
      if (error.message?.includes('Bucket not found') || error.message?.includes('bucket')) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Bucket "${bucket}" belum dibuat. Silakan setup Supabase Storage terlebih dahulu.`,
            details: `Run SQL script: supabase/setup-${bucket === 'pelanggaran-mahasiswa' ? 'pelanggaran' : 'storage'}-bucket.sql`
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: `Gagal mengupload foto: ${error.message}` },
        { status: 500 }
      );
    }

    console.log('✅ Upload successful to bucket:', bucket, '| Data:', data);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename);

    console.log('🔗 Public URL:', publicUrl);

    return NextResponse.json({
      success: true,
      data: {
        filename,
        url: publicUrl,
        bucket,
      },
    });
  } catch (error: any) {
    console.error('❌ Error in POST /api/upload:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    const bucket = searchParams.get('bucket') || 'mahasiswa-photos'; // Default bucket

    if (!filename) {
      return NextResponse.json(
        { success: false, error: 'Filename tidak ditemukan' },
        { status: 400 }
      );
    }

    console.log('🗑️ Deleting file:', filename, 'from bucket:', bucket);

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filename]);

    if (error) {
      console.error('❌ Error deleting from Supabase:', error);
      return NextResponse.json(
        { success: false, error: 'Gagal menghapus foto' },
        { status: 500 }
      );
    }

    console.log('✅ File deleted successfully');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('❌ Error in DELETE /api/upload:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

