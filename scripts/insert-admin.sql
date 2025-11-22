-- ============================================
-- INSERT USERS UNTUK SIPMA
-- ============================================
-- Password untuk semua user: password123
-- Hash bcrypt: $2b$10$Ar/9lnkk/hZAQB6S6LxdHOjr1C23WCJJ6ojn72gxYKEB91xH86Mxa
-- ============================================

-- 1. Insert Admin User
INSERT INTO users (email, password, nama, role, is_active, created_at, updated_at)
VALUES (
  'admin@stit.ac.id',
  '$2b$10$Ar/9lnkk/hZAQB6S6LxdHOjr1C23WCJJ6ojn72gxYKEB91xH86Mxa',
  'Admin SIPMA',
  'admin',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  nama = EXCLUDED.nama,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- 2. Insert Waket 3
INSERT INTO users (email, password, nama, role, is_active, created_at, updated_at)
VALUES (
  'waket3@stit.ac.id',
  '$2b$10$Ar/9lnkk/hZAQB6S6LxdHOjr1C23WCJJ6ojn72gxYKEB91xH86Mxa',
  'Wakil Ketua 3',
  'waket3',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- 3. Insert Dosen PA
INSERT INTO users (email, password, nama, role, is_active, created_at, updated_at)
VALUES (
  'dosen.pa@stit.ac.id',
  '$2b$10$Ar/9lnkk/hZAQB6S6LxdHOjr1C23WCJJ6ojn72gxYKEB91xH86Mxa',
  'Dr. Ahmad Fauzi, M.Pd',
  'dosen_pa',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- 4. Insert Musyrif
INSERT INTO users (email, password, nama, role, is_active, created_at, updated_at)
VALUES (
  'musyrif@stit.ac.id',
  '$2b$10$Ar/9lnkk/hZAQB6S6LxdHOjr1C23WCJJ6ojn72gxYKEB91xH86Mxa',
  'Ustadz Muhammad Ali',
  'musyrif',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- ============================================
-- INSERT DATA MAHASISWA
-- ============================================
-- Mahasiswa login menggunakan NIM, bukan email
-- Password disimpan di tabel mahasiswa

-- Mahasiswa 1: Ahmad Zaki
INSERT INTO mahasiswa (nim, password, nama, prodi, angkatan, is_active, created_at, updated_at)
VALUES (
  '2024001',
  '$2b$10$Ar/9lnkk/hZAQB6S6LxdHOjr1C23WCJJ6ojn72gxYKEB91xH86Mxa',
  'Ahmad Zaki',
  'Pendidikan Agama Islam',
  2024,
  true,
  NOW(),
  NOW()
) ON CONFLICT (nim) DO UPDATE SET
  password = EXCLUDED.password,
  nama = EXCLUDED.nama,
  prodi = EXCLUDED.prodi,
  angkatan = EXCLUDED.angkatan,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Mahasiswa 2: Fatimah Azzahra
INSERT INTO mahasiswa (nim, password, nama, prodi, angkatan, is_active, created_at, updated_at)
VALUES (
  '2024002',
  '$2b$10$Ar/9lnkk/hZAQB6S6LxdHOjr1C23WCJJ6ojn72gxYKEB91xH86Mxa',
  'Fatimah Azzahra',
  'Pendidikan Agama Islam',
  2024,
  true,
  NOW(),
  NOW()
) ON CONFLICT (nim) DO NOTHING;

-- Mahasiswa 3: Muhammad Rizki
INSERT INTO mahasiswa (nim, password, nama, prodi, angkatan, is_active, created_at, updated_at)
VALUES (
  '2024003',
  '$2b$10$Ar/9lnkk/hZAQB6S6LxdHOjr1C23WCJJ6ojn72gxYKEB91xH86Mxa',
  'Muhammad Rizki',
  'Pendidikan Agama Islam',
  2024,
  true,
  NOW(),
  NOW()
) ON CONFLICT (nim) DO NOTHING;

-- ============================================
-- VERIFY INSERTS
-- ============================================

-- Check all staff/admin users (login dengan email)
SELECT id, email, nama, role, is_active, created_at
FROM users
ORDER BY
  CASE role
    WHEN 'admin' THEN 1
    WHEN 'waket3' THEN 2
    WHEN 'dosen_pa' THEN 3
    WHEN 'musyrif' THEN 4
  END;

-- Check mahasiswa data (login dengan NIM)
SELECT id, nim, nama, prodi, angkatan, is_active, created_at
FROM mahasiswa
ORDER BY nim;

