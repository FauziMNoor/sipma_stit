-- =====================================================
-- Migration: Add Tahun Ajaran Support
-- Description: Add tahun_ajaran fields to mahasiswa and poin_aktivitas tables
--              Add tahun ajaran settings to system_settings
-- Date: 2025-11-22
-- =====================================================

-- =====================================================
-- 1. ADD TAHUN AJARAN TO MAHASISWA TABLE
-- =====================================================

-- Add tahun_ajaran_masuk column to mahasiswa table
ALTER TABLE mahasiswa 
ADD COLUMN IF NOT EXISTS tahun_ajaran_masuk TEXT NOT NULL DEFAULT '2024/2025';

-- Add comment for documentation
COMMENT ON COLUMN mahasiswa.tahun_ajaran_masuk IS 'Tahun ajaran saat mahasiswa pertama kali masuk (e.g., 2024/2025)';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_mahasiswa_tahun_ajaran_masuk ON mahasiswa(tahun_ajaran_masuk);

-- =====================================================
-- 2. ADD TAHUN AJARAN TO POIN_AKTIVITAS TABLE
-- =====================================================

-- Add tahun_ajaran column to poin_aktivitas table
ALTER TABLE poin_aktivitas 
ADD COLUMN IF NOT EXISTS tahun_ajaran TEXT NOT NULL DEFAULT '2024/2025';

-- Add semester_type column (ganjil/genap)
ALTER TABLE poin_aktivitas 
ADD COLUMN IF NOT EXISTS semester_type TEXT NOT NULL DEFAULT 'ganjil' 
CHECK (semester_type IN ('ganjil', 'genap'));

-- Add comments for documentation
COMMENT ON COLUMN poin_aktivitas.tahun_ajaran IS 'Tahun ajaran saat aktivitas dilakukan (e.g., 2024/2025)';
COMMENT ON COLUMN poin_aktivitas.semester_type IS 'Jenis semester: ganjil (Agustus-Januari) atau genap (Februari-Juli)';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_poin_aktivitas_tahun_ajaran ON poin_aktivitas(tahun_ajaran);
CREATE INDEX IF NOT EXISTS idx_poin_aktivitas_semester_type ON poin_aktivitas(semester_type);
CREATE INDEX IF NOT EXISTS idx_poin_aktivitas_tahun_semester ON poin_aktivitas(tahun_ajaran, semester_type);

-- =====================================================
-- 3. ADD TAHUN AJARAN SETTINGS
-- =====================================================

-- Insert tahun ajaran aktif setting
INSERT INTO system_settings (setting_key, setting_value, setting_type, category, description)
VALUES (
  'tahun_ajaran_aktif',
  '2024/2025',
  'text',
  'general',
  'Tahun ajaran yang sedang aktif saat ini'
)
ON CONFLICT (setting_key) DO NOTHING;

-- Insert semester aktif setting
INSERT INTO system_settings (setting_key, setting_value, setting_type, category, description)
VALUES (
  'semester_aktif',
  'ganjil',
  'text',
  'general',
  'Semester yang sedang aktif: ganjil atau genap'
)
ON CONFLICT (setting_key) DO NOTHING;

-- Insert tanggal mulai semester setting
INSERT INTO system_settings (setting_key, setting_value, setting_type, category, description)
VALUES (
  'tanggal_mulai_semester',
  '2024-08-01',
  'text',
  'general',
  'Tanggal mulai semester aktif'
)
ON CONFLICT (setting_key) DO NOTHING;

-- Insert tanggal akhir semester setting
INSERT INTO system_settings (setting_key, setting_value, setting_type, category, description)
VALUES (
  'tanggal_akhir_semester',
  '2025-01-31',
  'text',
  'general',
  'Tanggal akhir semester aktif'
)
ON CONFLICT (setting_key) DO NOTHING;

-- =====================================================
-- 4. UPDATE EXISTING DATA (OPTIONAL)
-- =====================================================

-- Update existing mahasiswa records
-- Set tahun_ajaran_masuk based on angkatan
UPDATE mahasiswa 
SET tahun_ajaran_masuk = angkatan || '/' || (angkatan + 1)
WHERE tahun_ajaran_masuk = '2024/2025'; -- Only update default values

-- Update existing poin_aktivitas records (if table exists and has data)
-- Set tahun_ajaran and semester_type based on tanggal
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'poin_aktivitas') THEN
    -- Set semester_type based on month
    UPDATE poin_aktivitas 
    SET semester_type = CASE 
      WHEN EXTRACT(MONTH FROM tanggal) BETWEEN 2 AND 7 THEN 'genap'
      ELSE 'ganjil'
    END
    WHERE semester_type = 'ganjil' AND tahun_ajaran = '2024/2025'; -- Only update default values
  END IF;
END $$;

-- =====================================================
-- 5. CREATE HELPER FUNCTION (OPTIONAL)
-- =====================================================

-- Function to get tahun ajaran from angkatan and semester
CREATE OR REPLACE FUNCTION get_tahun_ajaran(p_angkatan INTEGER, p_semester INTEGER)
RETURNS TEXT AS $$
DECLARE
  tahun_mulai INTEGER;
  tahun_akhir INTEGER;
BEGIN
  tahun_mulai := p_angkatan + FLOOR((p_semester - 1) / 2);
  tahun_akhir := tahun_mulai + 1;
  RETURN tahun_mulai || '/' || tahun_akhir;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Example usage:
-- SELECT get_tahun_ajaran(2024, 1); -- Returns '2024/2025'
-- SELECT get_tahun_ajaran(2024, 3); -- Returns '2025/2026'
-- SELECT get_tahun_ajaran(2024, 5); -- Returns '2026/2027'

COMMENT ON FUNCTION get_tahun_ajaran(INTEGER, INTEGER) IS 'Calculate tahun ajaran from angkatan and semester number';

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

