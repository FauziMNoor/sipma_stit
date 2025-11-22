import { supabase } from './supabase';

const BUCKET_NAME = 'bukti-aktivitas';

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(file: File, mahasiswaId: string): Promise<string> {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${mahasiswaId}/${timestamp}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error('Gagal upload file');
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Gagal upload file');
  }
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    // Extract file path from URL
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split('/');
    const fileName = pathParts.slice(-2).join('/'); // Get last 2 parts (mahasiswaId/filename)

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName]);

    if (error) {
      console.error('Delete error:', error);
      throw new Error('Gagal hapus file');
    }
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error('Gagal hapus file');
  }
}

/**
 * Get file URL from storage
 */
export function getFileUrl(fileName: string): string {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  return data.publicUrl;
}

