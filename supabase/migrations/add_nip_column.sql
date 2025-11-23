-- =====================================================
-- Migration: Add NIP Column to Users Table
-- Description: Add NIP (Nomor Induk Pegawai) field for dosen and staff
-- Date: 2025-11-23
-- =====================================================

-- Add nip column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS nip TEXT;

-- Add comment for documentation
COMMENT ON COLUMN users.nip IS 'Nomor Induk Pegawai (NIP) untuk dosen dan staff';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_users_nip ON users(nip) WHERE nip IS NOT NULL;

-- Add unique constraint for NIP (optional, uncomment if NIP should be unique)
-- ALTER TABLE users ADD CONSTRAINT users_nip_unique UNIQUE (nip);

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'nip';

