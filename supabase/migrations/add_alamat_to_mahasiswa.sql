-- Migration: Add alamat, email, and no_telepon columns to mahasiswa table
-- Created: 2025-11-24
-- Description: Add alamat (address), email, and no_telepon fields to mahasiswa table for student profile

-- Add alamat column to mahasiswa table
ALTER TABLE mahasiswa
ADD COLUMN IF NOT EXISTS alamat text NULL;

-- Add email column to mahasiswa table
ALTER TABLE mahasiswa
ADD COLUMN IF NOT EXISTS email text NULL;

-- Add no_telepon column to mahasiswa table
ALTER TABLE mahasiswa
ADD COLUMN IF NOT EXISTS no_telepon text NULL;

-- Add comments to columns
COMMENT ON COLUMN mahasiswa.alamat IS 'Alamat lengkap mahasiswa';
COMMENT ON COLUMN mahasiswa.email IS 'Email mahasiswa';
COMMENT ON COLUMN mahasiswa.no_telepon IS 'Nomor telepon mahasiswa';

-- Update existing records to have empty string instead of NULL (optional)
-- UPDATE mahasiswa SET alamat = '' WHERE alamat IS NULL;
-- UPDATE mahasiswa SET email = '' WHERE email IS NULL;
-- UPDATE mahasiswa SET no_telepon = '' WHERE no_telepon IS NULL;

