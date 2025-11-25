-- ============================================================================
-- SETUP BUCKET STORAGE UNTUK FOTO PELANGGARAN MAHASISWA
-- File: supabase/setup-pelanggaran-bucket.sql
-- ============================================================================
-- 
-- CARA PENGGUNAAN:
-- 1. Login ke Supabase Dashboard (https://app.supabase.com)
-- 2. Pilih project Anda
-- 3. Klik "SQL Editor" di sidebar
-- 4. Copy paste script ini
-- 5. Klik "Run"
-- ============================================================================

-- Step 1: Create storage bucket khusus pelanggaran
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pelanggaran-mahasiswa', 
  'pelanggaran-mahasiswa', 
  true,
  2097152, -- 2MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- Step 2: Set bucket policies for public read access
CREATE POLICY IF NOT EXISTS "Public Access Pelanggaran"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'pelanggaran-mahasiswa' );

-- Step 3: Allow authenticated users to upload
CREATE POLICY IF NOT EXISTS "Authenticated users can upload pelanggaran"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pelanggaran-mahasiswa'
);

-- Step 4: Allow authenticated users to update their uploads
CREATE POLICY IF NOT EXISTS "Authenticated users can update pelanggaran"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'pelanggaran-mahasiswa' )
WITH CHECK ( bucket_id = 'pelanggaran-mahasiswa' );

-- Step 5: Allow authenticated users to delete their uploads
CREATE POLICY IF NOT EXISTS "Authenticated users can delete pelanggaran"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'pelanggaran-mahasiswa' );

-- ============================================================================
-- VERIFICATION QUERY
-- Run this to verify bucket was created successfully:
-- ============================================================================
SELECT 
  id, 
  name, 
  public, 
  file_size_limit,
  allowed_mime_types,
  created_at 
FROM storage.buckets 
WHERE id = 'pelanggaran-mahasiswa';

-- Expected result: 
-- id                      | name                    | public | file_size_limit | allowed_mime_types
-- pelanggaran-mahasiswa   | pelanggaran-mahasiswa   | true   | 2097152         | {image/jpeg,...}

-- ============================================================================
-- NOTES
-- ============================================================================
--
-- Bucket ini khusus untuk foto bukti pelanggaran yang diinput oleh Musyrif
-- - Public: true (agar foto bisa diakses di UI)
-- - Max size: 2MB
-- - Allowed types: JPG, PNG, WEBP
-- - Upload by: Musyrif (authenticated)
-- - Validate by: Waket3
--
-- ============================================================================
