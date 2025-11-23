-- =====================================================
-- Migration: Add Dosen PA ID to Mahasiswa Table
-- Description: Add dosen_pa_id field to link mahasiswa with their academic advisor (Dosen PA)
-- Date: 2025-11-23
-- =====================================================

-- Add dosen_pa_id column to mahasiswa table
ALTER TABLE mahasiswa 
ADD COLUMN IF NOT EXISTS dosen_pa_id UUID REFERENCES users(id);

-- Add comment for documentation
COMMENT ON COLUMN mahasiswa.dosen_pa_id IS 'ID dosen pembimbing akademik (Dosen PA) untuk mahasiswa ini';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_mahasiswa_dosen_pa_id ON mahasiswa(dosen_pa_id);

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'mahasiswa' AND column_name = 'dosen_pa_id';

