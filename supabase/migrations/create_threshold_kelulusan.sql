-- ============================================
-- CREATE TABLE: threshold_kelulusan
-- Tabel untuk menyimpan syarat kelulusan berdasarkan poin
-- ============================================

CREATE TABLE IF NOT EXISTS threshold_kelulusan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kategori VARCHAR(50) NOT NULL,
  min_poin INTEGER NOT NULL,
  max_poin INTEGER,
  status VARCHAR(50) NOT NULL,
  keterangan TEXT,
  warna VARCHAR(20),
  dapat_yudisium BOOLEAN DEFAULT false,
  dapat_penghargaan BOOLEAN DEFAULT false,
  wajib_pembinaan BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INSERT DATA THRESHOLD KELULUSAN
-- Berdasarkan Briefing Klien
-- ============================================

INSERT INTO threshold_kelulusan (kategori, min_poin, max_poin, status, keterangan, warna, dapat_yudisium, dapat_penghargaan, wajib_pembinaan) VALUES
('Sangat Aktif', 300, NULL, 'Sangat aktif dan teladan', 'Dapat penghargaan & sertifikat', 'green', true, true, false),
('Aktif', 200, 299, 'Aktif dan layak lulus', 'Syarat kelulusan terpenuhi', 'blue', true, false, false),
('Cukup Aktif', 150, 199, 'Cukup aktif', 'Wajib pembinaan tambahan', 'yellow', true, false, true),
('Pasif', 0, 149, 'Pasif', 'Tidak bisa yudisium sampai memenuhi poin minimal', 'red', false, false, true);

-- ============================================
-- CREATE FUNCTION: get_status_kelulusan
-- Function untuk mendapatkan status kelulusan berdasarkan total poin
-- ============================================

CREATE OR REPLACE FUNCTION get_status_kelulusan(total_poin INTEGER)
RETURNS TABLE (
  kategori VARCHAR,
  status VARCHAR,
  keterangan TEXT,
  warna VARCHAR,
  dapat_yudisium BOOLEAN,
  dapat_penghargaan BOOLEAN,
  wajib_pembinaan BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.kategori,
    t.status,
    t.keterangan,
    t.warna,
    t.dapat_yudisium,
    t.dapat_penghargaan,
    t.wajib_pembinaan
  FROM threshold_kelulusan t
  WHERE 
    total_poin >= t.min_poin 
    AND (t.max_poin IS NULL OR total_poin <= t.max_poin)
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- CREATE VIEW: v_mahasiswa_status_kelulusan
-- View untuk melihat status kelulusan setiap mahasiswa
-- ============================================

CREATE OR REPLACE VIEW v_mahasiswa_status_kelulusan AS
SELECT 
  m.id,
  m.nim,
  m.nama,
  m.prodi,
  m.angkatan,
  COALESCE(ps.total_poin, 0) as total_poin,
  COALESCE(ps.total_poin_positif, 0) as total_poin_positif,
  COALESCE(ps.total_poin_negatif, 0) as total_poin_negatif,
  CASE 
    WHEN COALESCE(ps.total_poin, 0) >= 300 THEN 'Sangat Aktif'
    WHEN COALESCE(ps.total_poin, 0) >= 200 THEN 'Aktif'
    WHEN COALESCE(ps.total_poin, 0) >= 150 THEN 'Cukup Aktif'
    ELSE 'Pasif'
  END as kategori_status,
  CASE 
    WHEN COALESCE(ps.total_poin, 0) >= 300 THEN 'Sangat aktif dan teladan'
    WHEN COALESCE(ps.total_poin, 0) >= 200 THEN 'Aktif dan layak lulus'
    WHEN COALESCE(ps.total_poin, 0) >= 150 THEN 'Cukup aktif'
    ELSE 'Pasif'
  END as status,
  CASE 
    WHEN COALESCE(ps.total_poin, 0) >= 300 THEN 'Dapat penghargaan & sertifikat'
    WHEN COALESCE(ps.total_poin, 0) >= 200 THEN 'Syarat kelulusan terpenuhi'
    WHEN COALESCE(ps.total_poin, 0) >= 150 THEN 'Wajib pembinaan tambahan'
    ELSE 'Tidak bisa yudisium sampai memenuhi poin minimal'
  END as keterangan,
  CASE 
    WHEN COALESCE(ps.total_poin, 0) >= 300 THEN 'green'
    WHEN COALESCE(ps.total_poin, 0) >= 200 THEN 'blue'
    WHEN COALESCE(ps.total_poin, 0) >= 150 THEN 'yellow'
    ELSE 'red'
  END as warna,
  CASE 
    WHEN COALESCE(ps.total_poin, 0) >= 150 THEN true
    ELSE false
  END as dapat_yudisium,
  CASE 
    WHEN COALESCE(ps.total_poin, 0) >= 300 THEN true
    ELSE false
  END as dapat_penghargaan,
  CASE 
    WHEN COALESCE(ps.total_poin, 0) < 200 THEN true
    ELSE false
  END as wajib_pembinaan
FROM mahasiswa m
LEFT JOIN poin_summary ps ON m.id = ps.mahasiswa_id;

-- ============================================
-- INDEXES untuk performa
-- ============================================

CREATE INDEX IF NOT EXISTS idx_threshold_min_poin ON threshold_kelulusan(min_poin);
CREATE INDEX IF NOT EXISTS idx_threshold_max_poin ON threshold_kelulusan(max_poin);

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE threshold_kelulusan IS 'Tabel threshold untuk menentukan status kelulusan mahasiswa berdasarkan total poin';
COMMENT ON FUNCTION get_status_kelulusan IS 'Function untuk mendapatkan status kelulusan berdasarkan total poin mahasiswa';
COMMENT ON VIEW v_mahasiswa_status_kelulusan IS 'View untuk melihat status kelulusan setiap mahasiswa beserta kategori dan keterangan';

