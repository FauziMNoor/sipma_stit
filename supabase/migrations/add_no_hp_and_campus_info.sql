-- Migration: Add no_hp column to users table and campus info to settings
-- Created: 2024-11-25
-- Description: Adds phone number field to users and campus information settings

-- =====================================================
-- 1. Add no_hp column to users table
-- =====================================================
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS no_hp VARCHAR(20);

COMMENT ON COLUMN users.no_hp IS 'Nomor HP/WhatsApp pengguna';

-- =====================================================
-- 2. Add campus information settings to system_settings
-- =====================================================
INSERT INTO system_settings (setting_key, setting_value, setting_type, category, description, created_at, updated_at) VALUES
('campus_name', 'STIT Riyadhussholihiin', 'text', 'general', 'Nama kampus', NOW(), NOW()),
('campus_address', 'Jl. Pendidikan No. 123, Kota, Provinsi', 'text', 'general', 'Alamat lengkap kampus', NOW(), NOW()),
('campus_phone', '+6281234567890', 'text', 'general', 'Nomor telepon kampus/admin sistem', NOW(), NOW()),
('campus_email_admin', 'admin@stit.ac.id', 'text', 'general', 'Email administrator sistem', NOW(), NOW()),
('campus_email_akademik', 'akademik@stit.ac.id', 'text', 'general', 'Email bagian akademik', NOW(), NOW()),
('campus_phone_akademik', '+6281234567891', 'text', 'general', 'Nomor telepon bagian akademik', NOW(), NOW()),
('campus_operational_hours', 'Senin - Jumat: 08.00 - 16.00 WIB', 'text', 'general', 'Jam operasional kampus', NOW(), NOW())
ON CONFLICT (setting_key) DO UPDATE 
SET setting_value = EXCLUDED.setting_value, updated_at = NOW();

-- =====================================================
-- Verification Queries (Comment these out after verification)
-- =====================================================

-- Verify no_hp column
-- SELECT column_name, data_type, character_maximum_length 
-- FROM information_schema.columns 
-- WHERE table_name = 'users' AND column_name = 'no_hp';

-- Verify campus settings
-- SELECT key, value 
-- FROM settings 
-- WHERE key LIKE 'campus%' 
-- ORDER BY key;
