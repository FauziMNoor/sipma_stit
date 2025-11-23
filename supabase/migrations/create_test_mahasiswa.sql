-- ============================================
-- CREATE TEST MAHASISWA WITH PASSWORD
-- ============================================
-- Password: "password123" (bcrypt hash)
-- Hash: $2b$10$vPxt.Dt3tuCvnUMGwkxH1.fsRX7c6YQfR77nk/0kaW.R5E7nxLsQa
-- ============================================

-- Check if mahasiswa with NIM 2024001 already exists
DO $$
DECLARE
  mahasiswa_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM mahasiswa WHERE nim = '2024001'
  ) INTO mahasiswa_exists;

  IF mahasiswa_exists THEN
    -- Update existing mahasiswa with password
    UPDATE mahasiswa
    SET password = '$2b$10$vPxt.Dt3tuCvnUMGwkxH1.fsRX7c6YQfR77nk/0kaW.R5E7nxLsQa'
    WHERE nim = '2024001';

    RAISE NOTICE 'Updated existing mahasiswa with NIM 2024001';
  ELSE
    -- Insert new mahasiswa
    INSERT INTO mahasiswa (
      nim,
      nama,
      prodi,
      angkatan,
      semester,
      password,
      is_active,
      created_at
    ) VALUES (
      '2024001',
      'Ahmad Fauzi',
      'Pendidikan Agama Islam',
      2024,
      1,
      '$2b$10$vPxt.Dt3tuCvnUMGwkxH1.fsRX7c6YQfR77nk/0kaW.R5E7nxLsQa',
      true,
      NOW()
    );

    RAISE NOTICE 'Created new mahasiswa with NIM 2024001';
  END IF;
END $$;

-- Verify
SELECT 
  nim,
  nama,
  prodi,
  angkatan,
  semester,
  is_active,
  CASE 
    WHEN password IS NOT NULL THEN 'Password set (length: ' || LENGTH(password) || ')'
    ELSE 'No password'
  END as password_status,
  created_at
FROM mahasiswa
WHERE nim = '2024001';

