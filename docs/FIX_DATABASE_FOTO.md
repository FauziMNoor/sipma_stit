# 🔧 FIX: Error 500 Saat Upload Foto

## ❌ Masalah

Error 500 saat update mahasiswa dengan foto. Kemungkinan besar **kolom `foto` belum ada** di tabel `mahasiswa`.

## ✅ Solusi

### **STEP 1: Tambah Kolom `foto` di Database**

1. Buka **Supabase Dashboard**: https://supabase.com/dashboard
2. Pilih project Anda
3. Klik **SQL Editor** di sidebar kiri
4. Klik **New query**
5. Copy-paste SQL berikut:

```sql
-- Tambah kolom foto jika belum ada
ALTER TABLE mahasiswa 
ADD COLUMN IF NOT EXISTS foto TEXT;

-- Tambah comment untuk dokumentasi
COMMENT ON COLUMN mahasiswa.foto IS 'URL foto mahasiswa dari Supabase Storage';

-- Verifikasi kolom sudah ditambahkan
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'mahasiswa'
ORDER BY ordinal_position;
```

6. Klik **Run** (atau tekan Ctrl+Enter)
7. Pastikan muncul pesan sukses
8. Cek hasil query - kolom `foto` harus muncul di list

---

### **STEP 2: Verifikasi Struktur Tabel**

Jalankan query ini untuk memastikan semua kolom ada:

```sql
SELECT * FROM mahasiswa LIMIT 1;
```

Kolom yang harus ada:
- ✅ id
- ✅ nim
- ✅ nama
- ✅ prodi
- ✅ angkatan
- ✅ password
- ✅ **foto** ← HARUS ADA!
- ✅ is_active
- ✅ created_at
- ✅ updated_at

---

### **STEP 3: Test Update Lagi**

1. Refresh halaman http://localhost:3000/admin/kelola-mahasiswa
2. Klik **Edit** pada mahasiswa
3. Upload foto baru
4. Klik **Update**
5. Seharusnya berhasil tanpa error 500!

---

## 🧪 Jika Masih Error

### **Cek Error di Terminal Server:**

1. Buka terminal yang menjalankan `npm run dev`
2. Lihat error message yang muncul
3. Screenshot dan kirim ke saya

### **Cek Error di Browser Console:**

1. Buka DevTools (F12)
2. Tab **Network**
3. Klik request yang error (warna merah)
4. Tab **Response** - lihat error message
5. Screenshot dan kirim ke saya

---

## 📝 Catatan

- Kolom `foto` bertipe `TEXT` untuk menyimpan URL foto dari Supabase Storage
- Kolom `foto` nullable (boleh kosong) untuk mahasiswa yang belum upload foto
- URL format: `https://[PROJECT_ID].supabase.co/storage/v1/object/public/mahasiswa-photos/[FILENAME]`

---

## 🚀 Setelah Fix

Setelah kolom `foto` ditambahkan:
1. ✅ Upload foto akan berhasil
2. ✅ Edit mahasiswa dengan foto akan berhasil
3. ✅ Foto akan tampil di list mahasiswa
4. ✅ Import Excel juga bisa include foto (opsional)

---

**SILAKAN JALANKAN SQL DI ATAS DAN TEST LAGI!** 🙏

