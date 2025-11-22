-- Add foto column to mahasiswa table if not exists
-- This migration adds support for storing photo URLs

-- Check if column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'mahasiswa' 
        AND column_name = 'foto'
    ) THEN
        ALTER TABLE mahasiswa ADD COLUMN foto TEXT;
        COMMENT ON COLUMN mahasiswa.foto IS 'URL foto mahasiswa dari Supabase Storage';
    END IF;
END $$;

-- Create index for faster queries (optional)
CREATE INDEX IF NOT EXISTS idx_mahasiswa_foto ON mahasiswa(foto) WHERE foto IS NOT NULL;

