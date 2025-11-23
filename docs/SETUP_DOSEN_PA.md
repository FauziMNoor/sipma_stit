# Setup Dosen PA - SIPMA

## 🎯 Overview

Dokumentasi ini menjelaskan cara setup dan testing fitur **Dosen Pembimbing Akademik (Dosen PA)** di SIPMA.

---

## 📋 Prerequisites

1. ✅ Database sudah running (Supabase)
2. ✅ Admin sudah bisa login
3. ✅ Mahasiswa sudah bisa login
4. ✅ Tabel `users`, `mahasiswa`, `poin_aktivitas`, `kategori_poin` sudah ada

---

## 🔧 Setup Steps

### Step 1: Run Database Migration

Jalankan migration untuk menambahkan field `dosen_pa_id` ke tabel `mahasiswa`:

1. Buka Supabase SQL Editor
2. Copy isi file `supabase/migrations/add_dosen_pa_id.sql`
3. Paste dan Run

**File location:** `d:\sipma\supabase\migrations\add_dosen_pa_id.sql`

**Expected result:**
```
column_name    | data_type | is_nullable
---------------|-----------|------------
dosen_pa_id    | uuid      | YES
```

---

### Step 2: Create Test Dosen PA User

Jalankan SQL berikut untuk membuat user dosen PA:

```sql
-- Insert Dosen PA user
INSERT INTO users (
  email,
  password,
  nama,
  nip,
  role,
  is_active,
  created_at,
  updated_at
) VALUES (
  'dosen.pa@stit.ac.id',
  '$2b$10$Ar/9lnkk/hZAQB6S6LxdHOjr1C23WCJJ6ojn72gxYKEB91xH86Mxa',
  'Dr. Ahmad Hidayat, M.Pd.I',
  '198501012010011001',
  'dosen',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  nama = EXCLUDED.nama,
  nip = EXCLUDED.nip,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW()
RETURNING id, email, nama, nip, role;
```

**Login credentials:**
- Email: `dosen.pa@stit.ac.id`
- Password: `password123`

---

### Step 3: Assign Mahasiswa to Dosen PA

Assign mahasiswa yang sudah ada ke dosen PA:

```sql
-- Get dosen PA ID
DO $$
DECLARE
  dosen_pa_uuid UUID;
BEGIN
  -- Get dosen PA ID
  SELECT id INTO dosen_pa_uuid
  FROM users
  WHERE email = 'dosen.pa@stit.ac.id';

  -- Assign mahasiswa to dosen PA
  UPDATE mahasiswa
  SET dosen_pa_id = dosen_pa_uuid
  WHERE nim IN ('2024001', '2024002', '2024003');

  RAISE NOTICE 'Assigned mahasiswa to Dosen PA: %', dosen_pa_uuid;
END $$;

-- Verify
SELECT 
  m.nim,
  m.nama,
  u.nama as dosen_pa_nama
FROM mahasiswa m
LEFT JOIN users u ON m.dosen_pa_id = u.id
WHERE m.nim IN ('2024001', '2024002', '2024003');
```

---

## 🧪 Testing

### Test 1: Login as Dosen PA

1. Buka browser: `http://localhost:3000/login`
2. Login dengan:
   - Email: `dosen.pa@stit.ac.id`
   - Password: `password123`
3. ✅ **Expected:** Redirect ke `/dosen-pa/dashboard`

---

### Test 2: Dashboard Dosen PA

1. Setelah login, lihat dashboard
2. ✅ **Expected:** Melihat:
   - Foto dan nama dosen
   - Alert pending submissions (jika ada)
   - Statistics cards (Total Pengajuan, Diverifikasi, Pending)
   - Menu cards (Verifikasi Kegiatan, Mahasiswa Bimbingan, dll)

---

### Test 3: Verifikasi Kegiatan

1. Klik menu "Verifikasi Kegiatan"
2. ✅ **Expected:** Melihat list pengajuan dari mahasiswa bimbingan
3. Filter by status (Semua, Pending, Disetujui, Ditolak)
4. ✅ **Expected:** Filter berfungsi dengan benar
5. Klik "Lihat Detail" pada salah satu pengajuan
6. ✅ **Expected:** Redirect ke detail page

---

### Test 4: Detail Pengajuan & Verifikasi

1. Di detail page, lihat informasi lengkap
2. ✅ **Expected:** Melihat:
   - Info mahasiswa dengan total poin
   - Detail kegiatan
   - Poin yang diajukan
   - Foto bukti (jika ada)
3. Tambahkan catatan (opsional)
4. Klik "Setujui" atau "Tolak"
5. ✅ **Expected:** 
   - Konfirmasi muncul
   - Setelah confirm, redirect ke list verifikasi
   - Status berubah di database

---

### Test 5: Mahasiswa Bimbingan

1. Klik menu "Daftar Mahasiswa Bimbingan"
2. ✅ **Expected:** Melihat list mahasiswa dengan:
   - Foto, nama, NIM, semester
   - Total poin
   - Status keaktifan (Sangat Aktif, Aktif, Cukup Aktif, Pasif)
   - Progress bar
3. Gunakan search untuk cari mahasiswa
4. ✅ **Expected:** Search berfungsi (by nama atau NIM)

---

### Test 6: Profil Dosen PA

1. Klik menu "Profil Saya" atau icon profil
2. ✅ **Expected:** Melihat:
   - Foto dan info dosen
   - Statistics (Total Mahasiswa Bimbingan, Total Verifikasi)
   - Menu (Edit Profil, Ubah Password, Bantuan, Logout)
3. Klik "Logout"
4. ✅ **Expected:** Redirect ke `/login`

---

## 📁 Files Created

### Components (7 files)
1. `src/components/DashboardDosenPA.tsx` - Main dashboard
2. `src/components/VerifikasiKegiatanDosenPA.tsx` - List verifikasi
3. `src/components/DetailPengajuanDosenPA.tsx` - Detail pengajuan
4. `src/components/MahasiswaBimbinganDosenPA.tsx` - List mahasiswa
5. `src/components/ProfilDosenPA.tsx` - Profil dosen

### API Routes (5 files)
1. `src/app/api/dosen-pa/dashboard/[id]/route.ts` - Dashboard data
2. `src/app/api/dosen-pa/verifikasi/[id]/route.ts` - List & update verifikasi
3. `src/app/api/dosen-pa/verifikasi/detail/[id]/route.ts` - Detail pengajuan
4. `src/app/api/dosen-pa/mahasiswa-bimbingan/[id]/route.ts` - List mahasiswa
5. `src/app/api/dosen-pa/profile/[id]/route.ts` - Profil dosen

### Pages (5 files)
1. `src/app/dosen-pa/dashboard/page.tsx` - Dashboard page
2. `src/app/dosen-pa/verifikasi/page.tsx` - Verifikasi page
3. `src/app/dosen-pa/verifikasi/[id]/page.tsx` - Detail page
4. `src/app/dosen-pa/mahasiswa-bimbingan/page.tsx` - Mahasiswa page
5. `src/app/dosen-pa/profil/page.tsx` - Profil page

---

## 🔍 Troubleshooting

### Issue 1: "Dosen not found"
**Solution:** Pastikan user dengan email `dosen.pa@stit.ac.id` sudah dibuat dan role-nya `dosen`

### Issue 2: "No mahasiswa bimbingan"
**Solution:** Pastikan ada mahasiswa yang `dosen_pa_id`-nya sudah di-assign ke dosen PA

### Issue 3: "Failed to fetch aktivitas"
**Solution:** Pastikan ada data di tabel `poin_aktivitas` untuk mahasiswa bimbingan

---

## ✅ Checklist

- [ ] Migration `add_dosen_pa_id.sql` sudah dijalankan
- [ ] User dosen PA sudah dibuat
- [ ] Mahasiswa sudah di-assign ke dosen PA
- [ ] Login dosen PA berhasil
- [ ] Dashboard menampilkan data dengan benar
- [ ] Verifikasi kegiatan berfungsi
- [ ] Approve/reject berfungsi
- [ ] List mahasiswa bimbingan muncul
- [ ] Profil dosen PA muncul
- [ ] Logout berfungsi

---

**Setup Dosen PA selesai!** ✅

