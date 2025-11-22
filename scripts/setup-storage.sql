-- Script untuk setup Supabase Storage
-- Jalankan di Supabase SQL Editor

-- 1. Create bucket (jika belum ada)
INSERT INTO storage.buckets (id, name, public)
VALUES ('mahasiswa-photos', 'mahasiswa-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS (Row Level Security)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow public read
CREATE POLICY IF NOT EXISTS "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'mahasiswa-photos' );

-- 4. Policy: Allow authenticated upload
CREATE POLICY IF NOT EXISTS "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'mahasiswa-photos' );

-- 5. Policy: Allow authenticated update
CREATE POLICY IF NOT EXISTS "Authenticated Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'mahasiswa-photos' );

-- 6. Policy: Allow authenticated delete
CREATE POLICY IF NOT EXISTS "Authenticated Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'mahasiswa-photos' );

-- 7. Policy: Allow anonymous upload (untuk development)
-- UNCOMMENT jika ingin allow upload tanpa auth (tidak recommended untuk production)
-- CREATE POLICY IF NOT EXISTS "Anonymous Upload"
-- ON storage.objects FOR INSERT
-- TO anon
-- WITH CHECK ( bucket_id = 'mahasiswa-photos' );

-- Verify bucket created
SELECT * FROM storage.buckets WHERE id = 'mahasiswa-photos';

