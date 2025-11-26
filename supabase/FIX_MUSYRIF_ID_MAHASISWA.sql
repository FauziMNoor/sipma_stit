-- ========================================
-- FIX MUSYRIF_ID DI TABEL MAHASISWA
-- ========================================

-- STEP 1: CEK USER MUSYRIF YANG ADA
-- Copy ID musyrif yang Anda gunakan untuk login
SELECT 
  id as musyrif_id,
  nama as musyrif_nama,
  email as musyrif_email,
  role
FROM users 
WHERE role = 'musyrif'
ORDER BY nama;

-- Contoh hasil:
-- musyrif_id: 550e8400-e29b-41d4-a716-446655440000
-- musyrif_nama: Ustadz Ahmad
-- musyrif_email: musyrif@example.com


-- ========================================
-- STEP 2: CEK MAHASISWA YANG INPUT KEGIATAN ADAB
-- ========================================

-- Cek mahasiswa Muhammad, Sultan, Ahmad Zaki ilham
SELECT 
  m.id as mahasiswa_id,
  m.nim,
  m.nama as mahasiswa_nama,
  m.musyrif_id,
  u.nama as musyrif_nama_sekarang,
  m.is_active
FROM mahasiswa m
LEFT JOIN users u ON m.musyrif_id = u.id
WHERE m.nama IN ('Muhammad', 'Sultan', 'Ahmad Zaki ilham')
ORDER BY m.nama;

-- Jika musyrif_id = NULL atau tidak sesuai, lanjut ke STEP 3


-- ========================================
-- STEP 3: UPDATE musyrif_id UNTUK MAHASISWA
-- ========================================

-- GANTI 'YOUR_MUSYRIF_ID_HERE' dengan ID dari STEP 1
-- Contoh: '550e8400-e29b-41d4-a716-446655440000'

UPDATE mahasiswa 
SET musyrif_id = 'YOUR_MUSYRIF_ID_HERE'
WHERE nama IN ('Muhammad', 'Sultan', 'Ahmad Zaki ilham')
  AND is_active = true;

-- Contoh konkret:
-- UPDATE mahasiswa 
-- SET musyrif_id = '550e8400-e29b-41d4-a716-446655440000'
-- WHERE nama IN ('Muhammad', 'Sultan', 'Ahmad Zaki ilham')
--   AND is_active = true;


-- ========================================
-- STEP 4: VERIFIKASI UPDATE BERHASIL
-- ========================================

SELECT 
  m.nim,
  m.nama as mahasiswa_nama,
  u.nama as musyrif_nama,
  m.musyrif_id,
  m.is_active
FROM mahasiswa m
LEFT JOIN users u ON m.musyrif_id = u.id
WHERE m.nama IN ('Muhammad', 'Sultan', 'Ahmad Zaki ilham')
ORDER BY m.nama;

-- Expected result:
-- nim     | mahasiswa_nama    | musyrif_nama  | musyrif_id              | is_active
-- 2024001 | Ahmad Zaki ilham  | Ustadz Ahmad  | 550e8400-e29b...        | true
-- 2024003 | Muhammad          | Ustadz Ahmad  | 550e8400-e29b...        | true
-- 2024002 | Sultan            | Ustadz Ahmad  | 550e8400-e29b...        | true


-- ========================================
-- STEP 5: CEK KEGIATAN ADAB PENDING DENGAN MUSYRIF
-- ========================================

-- Setelah update, cek apakah kegiatan sudah ter-link dengan musyrif
SELECT 
  pa.id as kegiatan_id,
  pa.status,
  pa.created_at,
  m.nim,
  m.nama as mahasiswa_nama,
  m.musyrif_id,
  u.nama as musyrif_nama,
  k.nama as kategori_nama,
  k.kategori_utama
FROM poin_aktivitas pa
JOIN mahasiswa m ON pa.mahasiswa_id = m.id
LEFT JOIN users u ON m.musyrif_id = u.id
JOIN kategori_poin k ON pa.kategori_id = k.id
WHERE k.kategori_utama = 'Adab'
  AND pa.status = 'pending'
ORDER BY pa.created_at DESC;

-- Expected result: Semua kegiatan Adab pending harus punya musyrif_nama yang terisi


-- ========================================
-- BONUS: UPDATE SEMUA MAHASISWA AKTIF KE SATU MUSYRIF
-- ========================================

-- Jika ingin assign SEMUA mahasiswa aktif ke satu musyrif:
-- UPDATE mahasiswa 
-- SET musyrif_id = 'YOUR_MUSYRIF_ID_HERE'
-- WHERE is_active = true 
--   AND musyrif_id IS NULL;


-- ========================================
-- TESTING: CEK BERAPA MAHASISWA BELUM PUNYA MUSYRIF
-- ========================================

SELECT 
  COUNT(*) as total_mahasiswa,
  COUNT(musyrif_id) as mahasiswa_dengan_musyrif,
  COUNT(*) - COUNT(musyrif_id) as mahasiswa_tanpa_musyrif
FROM mahasiswa 
WHERE is_active = true;

-- Idealnya: mahasiswa_tanpa_musyrif = 0
