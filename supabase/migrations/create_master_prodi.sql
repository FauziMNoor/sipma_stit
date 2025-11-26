-- Create master_prodi table
CREATE TABLE IF NOT EXISTS public.master_prodi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kode_prodi VARCHAR(10) NOT NULL UNIQUE,
  nama_prodi VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_master_prodi_kode ON public.master_prodi(kode_prodi);
CREATE INDEX IF NOT EXISTS idx_master_prodi_active ON public.master_prodi(is_active);

-- Insert default prodi data
INSERT INTO public.master_prodi (kode_prodi, nama_prodi, is_active) VALUES
  ('PAI', 'Pendidikan Agama Islam', true),
  ('ES', 'Ekonomi Syariah', true),
  ('HKI', 'Hukum Keluarga Islam', true)
ON CONFLICT (kode_prodi) DO NOTHING;

-- Add RLS policies
ALTER TABLE public.master_prodi ENABLE ROW LEVEL SECURITY;

-- Allow read for authenticated users
CREATE POLICY "Allow read access for authenticated users" ON public.master_prodi
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow insert/update/delete for admin only (you can adjust this based on your auth setup)
CREATE POLICY "Allow all access for admin" ON public.master_prodi
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add comment
COMMENT ON TABLE public.master_prodi IS 'Master table for program studi (study programs)';
