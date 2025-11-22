-- Seed Users untuk Testing SIPMA
-- Password untuk semua user: password123
-- Hash: $2b$10$Ar/9lnkk/hZAQB6S6LxdHOjr1C23WCJJ6ojn72gxYKEB91xH86Mxa

-- Admin
INSERT INTO users (email, password, nama, role, is_active)
VALUES (
  'admin@stit.ac.id',
  '$2b$10$Ar/9lnkk/hZAQB6S6LxdHOjr1C23WCJJ6ojn72gxYKEB91xH86Mxa',
  'Admin SIPMA',
  'admin',
  true
) ON CONFLICT (email) DO NOTHING;

-- Waket 3
INSERT INTO users (email, password, nama, role, is_active)
VALUES (
  'waket3@stit.ac.id',
  '$2b$10$Ar/9lnkk/hZAQB6S6LxdHOjr1C23WCJJ6ojn72gxYKEB91xH86Mxa',
  'Wakil Ketua 3',
  'waket3',
  true
) ON CONFLICT (email) DO NOTHING;

-- Dosen PA
INSERT INTO users (email, password, nama, role, is_active)
VALUES (
  'dosen.pa@stit.ac.id',
  '$2b$10$Ar/9lnkk/hZAQB6S6LxdHOjr1C23WCJJ6ojn72gxYKEB91xH86Mxa',
  'Dr. Ahmad Fauzi, M.Pd',
  'dosen_pa',
  true
) ON CONFLICT (email) DO NOTHING;

-- Musyrif
INSERT INTO users (email, password, nama, role, is_active)
VALUES (
  'musyrif@stit.ac.id',
  '$2b$10$Ar/9lnkk/hZAQB6S6LxdHOjr1C23WCJJ6ojn72gxYKEB91xH86Mxa',
  'Ustadz Muhammad Ali',
  'musyrif',
  true
) ON CONFLICT (email) DO NOTHING;

-- Mahasiswa 1
INSERT INTO users (email, password, nama, role, is_active)
VALUES (
  'mahasiswa1@stit.ac.id',
  '$2b$10$Ar/9lnkk/hZAQB6S6LxdHOjr1C23WCJJ6ojn72gxYKEB91xH86Mxa',
  'Ahmad Zaki',
  'mahasiswa',
  true
) ON CONFLICT (email) DO NOTHING;

-- Mahasiswa 2
INSERT INTO users (email, password, nama, role, is_active)
VALUES (
  'mahasiswa2@stit.ac.id',
  '$2b$10$Ar/9lnkk/hZAQB6S6LxdHOjr1C23WCJJ6ojn72gxYKEB91xH86Mxa',
  'Fatimah Azzahra',
  'mahasiswa',
  true
) ON CONFLICT (email) DO NOTHING;

-- ============================================
-- INSERT DATA MAHASISWA
-- ============================================

-- Mahasiswa 1: Ahmad Zaki
INSERT INTO mahasiswa (user_id, nim, nama, prodi, angkatan)
SELECT
  u.id,
  '2024001',
  'Ahmad Zaki',
  'Pendidikan Agama Islam',
  2024
FROM users u
WHERE u.email = 'mahasiswa1@stit.ac.id'
ON CONFLICT (nim) DO NOTHING;

-- Mahasiswa 2: Fatimah Azzahra
INSERT INTO mahasiswa (user_id, nim, nama, prodi, angkatan)
SELECT
  u.id,
  '2024002',
  'Fatimah Azzahra',
  'Pendidikan Agama Islam',
  2024
FROM users u
WHERE u.email = 'mahasiswa2@stit.ac.id'
ON CONFLICT (nim) DO NOTHING;

