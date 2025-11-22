-- ============================================
-- ALTER TABLE MAHASISWA
-- ============================================
-- Menambahkan kolom password dan is_active ke tabel mahasiswa
-- Agar mahasiswa bisa login dengan NIM tanpa perlu tabel users
-- ============================================

-- 1. Tambah kolom password (jika belum ada)
ALTER TABLE mahasiswa 
ADD COLUMN IF NOT EXISTS password TEXT;

-- 2. Tambah kolom is_active (jika belum ada)
ALTER TABLE mahasiswa 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 3. Ubah user_id menjadi nullable (opsional, untuk backward compatibility)
ALTER TABLE mahasiswa 
ALTER COLUMN user_id DROP NOT NULL;

-- 4. Verify struktur tabel
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'mahasiswa'
ORDER BY ordinal_position;

