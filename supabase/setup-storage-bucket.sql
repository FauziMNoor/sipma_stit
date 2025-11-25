-- ============================================================================
-- SETUP SUPABASE STORAGE BUCKET UNTUK UPLOAD FOTO
-- File: supabase/setup-storage-bucket.sql
-- ============================================================================
-- 
-- CARA PENGGUNAAN:
-- 1. Login ke Supabase Dashboard (https://app.supabase.com)
-- 2. Pilih project Anda
-- 3. Klik "SQL Editor" di sidebar
-- 4. Copy paste script ini
-- 5. Klik "Run"
-- ============================================================================

-- Step 1: Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('mahasiswa-photos', 'mahasiswa-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Set bucket policies for public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'mahasiswa-photos' );

-- Step 3: Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'mahasiswa-photos'
);

-- Step 4: Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'mahasiswa-photos' )
WITH CHECK ( bucket_id = 'mahasiswa-photos' );

-- Step 5: Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'mahasiswa-photos' );

-- ============================================================================
-- VERIFICATION QUERY
-- Run this to verify bucket was created successfully:
-- ============================================================================
SELECT * FROM storage.buckets WHERE id = 'mahasiswa-photos';

-- Expected result: 
-- id                | name              | public | created_at
-- mahasiswa-photos  | mahasiswa-photos  | true   | [timestamp]

-- ============================================================================
-- TROUBLESHOOTING
-- ============================================================================
-- 
-- Jika error "Policy already exists":
-- - Ini normal jika sudah pernah run script ini sebelumnya
-- - Bucket dan policies sudah ada, skip error ini
--
-- Jika error "Bucket already exists":
-- - Bucket sudah dibuat sebelumnya
-- - Lanjut ke verification query untuk memastikan
--
-- Jika error "Permission denied":
-- - Pastikan Anda login sebagai owner/admin project
-- - Check project permissions di dashboard
-- ============================================================================
