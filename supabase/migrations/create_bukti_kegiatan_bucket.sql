-- ============================================
-- CREATE STORAGE BUCKET FOR BUKTI KEGIATAN
-- ============================================
-- Bucket untuk menyimpan foto bukti kegiatan mahasiswa
-- Terpisah dari bucket "photos" yang digunakan untuk foto profil user/admin
-- ============================================

-- 1. Create bucket "bukti-kegiatan" (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'bukti-kegiatan',
  'bukti-kegiatan',
  true,
  5242880, -- 5MB in bytes (lebih besar untuk foto bukti kegiatan)
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- 2. Policy: Public Read Access
-- Semua orang bisa melihat foto bukti kegiatan (untuk display di web)
DROP POLICY IF EXISTS "Public Read Access Bukti Kegiatan" ON storage.objects;
CREATE POLICY "Public Read Access Bukti Kegiatan"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'bukti-kegiatan');

-- 3. Policy: Authenticated Upload
-- Hanya user yang login (mahasiswa) bisa upload foto bukti
DROP POLICY IF EXISTS "Authenticated Upload Bukti Kegiatan" ON storage.objects;
CREATE POLICY "Authenticated Upload Bukti Kegiatan"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'bukti-kegiatan');

-- 4. Policy: Authenticated Update
-- Hanya user yang login bisa update foto bukti
DROP POLICY IF EXISTS "Authenticated Update Bukti Kegiatan" ON storage.objects;
CREATE POLICY "Authenticated Update Bukti Kegiatan"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'bukti-kegiatan')
WITH CHECK (bucket_id = 'bukti-kegiatan');

-- 5. Policy: Authenticated Delete
-- Hanya user yang login bisa delete foto bukti
DROP POLICY IF EXISTS "Authenticated Delete Bukti Kegiatan" ON storage.objects;
CREATE POLICY "Authenticated Delete Bukti Kegiatan"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'bukti-kegiatan');

-- ============================================
-- VERIFY SETUP
-- ============================================

-- Check bucket
SELECT 
  id, 
  name, 
  public, 
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets
WHERE id = 'bukti-kegiatan';

-- Check policies
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
AND policyname LIKE '%Bukti Kegiatan%'
ORDER BY policyname;

-- ============================================
-- EXPECTED RESULT
-- ============================================
-- Bucket:
--   id: bukti-kegiatan
--   name: bukti-kegiatan
--   public: true
--   file_size_limit: 5242880 (5MB)
--   allowed_mime_types: {image/jpeg, image/jpg, image/png, image/webp}
--
-- Policies:
--   1. Public Read Access Bukti Kegiatan (SELECT)
--   2. Authenticated Upload Bukti Kegiatan (INSERT)
--   3. Authenticated Update Bukti Kegiatan (UPDATE)
--   4. Authenticated Delete Bukti Kegiatan (DELETE)
-- ============================================

