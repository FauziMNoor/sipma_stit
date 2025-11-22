-- Create system_settings table for application configuration
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  setting_type TEXT NOT NULL CHECK (setting_type IN ('number', 'boolean', 'text', 'json')),
  category TEXT NOT NULL CHECK (category IN ('poin', 'notification', 'general')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON system_settings(category);

-- Insert default settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, category, description) VALUES
  -- Poin Settings
  ('min_poin_kelulusan', '100', 'number', 'poin', 'Minimum poin yang harus dicapai mahasiswa untuk lulus'),
  ('target_poin_semester', '20', 'number', 'poin', 'Target poin yang harus dicapai per semester'),
  ('allow_negative_total', 'false', 'boolean', 'poin', 'Apakah total poin boleh negatif'),
  
  -- Notification Settings
  ('push_notifications_enabled', 'true', 'boolean', 'notification', 'Enable/disable push notifications'),
  ('email_alerts_enabled', 'true', 'boolean', 'notification', 'Enable/disable email alerts'),
  ('reminder_days_before', '7', 'number', 'notification', 'Berapa hari sebelum deadline untuk kirim reminder'),
  
  -- General Settings
  ('app_version', 'v2.1.4', 'text', 'general', 'Versi aplikasi saat ini'),
  ('last_update_date', '2025-01-15', 'text', 'general', 'Tanggal update terakhir'),
  ('support_contact', 'support@stit.ac.id', 'text', 'general', 'Email kontak support'),

  -- Tahun Ajaran Settings
  ('tahun_ajaran_aktif', '2024/2025', 'text', 'general', 'Tahun ajaran yang sedang aktif saat ini'),
  ('semester_aktif', 'ganjil', 'text', 'general', 'Semester yang sedang aktif: ganjil atau genap'),
  ('tanggal_mulai_semester', '2024-08-01', 'text', 'general', 'Tanggal mulai semester aktif'),
  ('tanggal_akhir_semester', '2025-01-31', 'text', 'general', 'Tanggal akhir semester aktif')
ON CONFLICT (setting_key) DO NOTHING;

-- Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_system_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_system_settings_updated_at
  BEFORE UPDATE ON system_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_system_settings_updated_at();

-- Add comment
COMMENT ON TABLE system_settings IS 'Tabel untuk menyimpan konfigurasi sistem aplikasi';

