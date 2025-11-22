# Setup Database - SIPMA

## 🎯 Masalah yang Diperbaiki

1. ✅ **Tabel users masih kosong** - Tidak ada data admin
2. ✅ **Onboarding tidak muncul** - Flow splash → login (skip onboarding)

---

## 📋 Langkah-langkah Setup Database

### Step 1: Buka Supabase SQL Editor

1. Login ke Supabase: https://supabase.com
2. Pilih project: **ijwfqsgednjfzugwnhtv**
3. Klik menu **SQL Editor** di sidebar kiri
4. Klik **New Query**

### Step 2: Alter Table Mahasiswa (Tambah Kolom Password)

Copy semua isi file `scripts/alter-mahasiswa-table.sql` dan paste ke SQL Editor, lalu klik **Run**.

**File location:** `d:\sipma\scripts\alter-mahasiswa-table.sql`

SQL ini akan:
- ✅ Tambah kolom `password` di tabel mahasiswa
- ✅ Tambah kolom `is_active` di tabel mahasiswa
- ✅ Ubah `user_id` menjadi nullable

### Step 3: Insert Users & Mahasiswa

Copy semua isi file `scripts/insert-admin.sql` dan paste ke SQL Editor, lalu klik **Run**.

**File location:** `d:\sipma\scripts\insert-admin.sql`

SQL ini akan insert:
- ✅ 1 Admin (tabel users)
- ✅ 1 Waket 3 (tabel users)
- ✅ 1 Dosen PA (tabel users)
- ✅ 1 Musyrif (tabel users)
- ✅ 3 Mahasiswa (tabel mahasiswa, **BUKAN tabel users**)

### Step 4: Verify Data

Setelah SQL berhasil dijalankan, Anda akan melihat hasil query di bagian bawah:

**Expected Output - Tabel Users (Staff):**
```
id | email                  | nama                  | role      | is_active | created_at
---+------------------------+-----------------------+-----------+-----------+------------
1  | admin@stit.ac.id       | Admin SIPMA           | admin     | true      | 2024-...
2  | waket3@stit.ac.id      | Wakil Ketua 3         | waket3    | true      | 2024-...
3  | dosen.pa@stit.ac.id    | Dr. Ahmad Fauzi, M.Pd | dosen_pa  | true      | 2024-...
4  | musyrif@stit.ac.id     | Ustadz Muhammad Ali   | musyrif   | true      | 2024-...
```

**Expected Output - Tabel Mahasiswa:**
```
id | nim     | nama              | prodi                    | angkatan | is_active
---+---------+-------------------+--------------------------+----------+-----------
1  | 2024001 | Ahmad Zaki        | Pendidikan Agama Islam   | 2024     | true
2  | 2024002 | Fatimah Azzahra   | Pendidikan Agama Islam   | 2024     | true
3  | 2024003 | Muhammad Rizki    | Pendidikan Agama Islam   | 2024     | true
```

---

## 🔐 Test Credentials

Semua user menggunakan password yang sama:

**Password:** `password123`

### Admin
- **Email:** `admin@stit.ac.id`
- **Password:** `password123`
- **Role:** admin
- **Redirect:** `/admin` (Admin Dashboard)

### Waket 3
- **Email:** `waket3@stit.ac.id`
- **Password:** `password123`
- **Role:** waket3

### Dosen PA
- **Email:** `dosen.pa@stit.ac.id`
- **Password:** `password123`
- **Role:** dosen_pa

### Musyrif
- **Email:** `musyrif@stit.ac.id`
- **Password:** `password123`
- **Role:** musyrif

### Mahasiswa 1
- **NIM:** `2024001`
- **Password:** `password123`
- **Nama:** Ahmad Zaki

### Mahasiswa 2
- **NIM:** `2024002`
- **Password:** `password123`
- **Nama:** Fatimah Azzahra

### Mahasiswa 3
- **NIM:** `2024003`
- **Password:** `password123`
- **Nama:** Muhammad Rizki

---

## 🎨 Flow Onboarding yang Sudah Diperbaiki

### Flow Baru:
```
1. Splash Screen (3 detik)
   ↓
2. Onboarding (3 slides) - HANYA untuk first-time user
   ↓
3. Login Page
   ↓
4. Dashboard (sesuai role)
```

### Cara Reset Onboarding:

Jika Anda ingin melihat onboarding lagi:

1. Buka **Developer Tools** di browser (F12)
2. Pilih tab **Console**
3. Ketik: `localStorage.removeItem('hasSeenOnboarding')`
4. Tekan Enter
5. Refresh halaman (F5)

Atau buka **Application** tab → **Local Storage** → hapus key `hasSeenOnboarding`

---

## 🧪 Testing Flow

### Test 1: First-time User (Onboarding)
1. Clear localStorage (lihat cara di atas)
2. Buka http://localhost:3000
3. **Expected:**
   - Splash screen (3 detik) ✅
   - Onboarding slide 1, 2, 3 ✅
   - Klik "Get Started" → Login page ✅

### Test 2: Returning User (Skip Onboarding)
1. Buka http://localhost:3000 (setelah pernah login)
2. **Expected:**
   - Splash screen (3 detik) ✅
   - Langsung ke Login page (skip onboarding) ✅

### Test 3: Login as Admin
1. Buka http://localhost:3000/login
2. Login dengan:
   - Email: `admin@stit.ac.id`
   - Password: `password123`
3. **Expected:**
   - Redirect ke `/admin` ✅
   - Muncul Admin Dashboard ✅

### Test 4: Login as Mahasiswa
1. Logout (jika sudah login)
2. Login dengan:
   - **NIM:** `2024001` (bukan email!)
   - **Password:** `password123`
3. **Expected:**
   - Redirect ke `/dashboard` ✅
   - Muncul Dashboard biasa (bukan admin) ✅

---

## 🔧 Troubleshooting

### Problem: "Email atau password salah"
**Solution:** Pastikan SQL sudah dijalankan di Supabase SQL Editor

### Problem: Onboarding tidak muncul
**Solution:** 
1. Clear localStorage: `localStorage.removeItem('hasSeenOnboarding')`
2. Pastikan tidak sedang login (logout dulu)
3. Refresh halaman

### Problem: Redirect loop
**Solution:** Clear cookies dan localStorage, lalu refresh

---

## ✅ Checklist

- [ ] SQL sudah dijalankan di Supabase
- [ ] Data users terlihat di Supabase Table Editor
- [ ] Login admin berhasil
- [ ] Redirect ke `/admin` berhasil
- [ ] Admin Dashboard muncul
- [ ] Onboarding muncul untuk first-time user
- [ ] Icon mata di password field berfungsi

---

**Status:** Ready for Testing 🚀
**Date:** 2024

