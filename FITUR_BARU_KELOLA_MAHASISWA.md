# 🎉 Fitur Baru: Kelola Mahasiswa dengan Upload Foto & Import Excel

## ✅ Fitur yang Sudah Ditambahkan

### 1. 📸 Upload Foto Mahasiswa
- Upload foto saat tambah mahasiswa baru
- Upload foto saat edit mahasiswa
- Preview foto sebelum upload
- Foto disimpan di Supabase Storage
- Ukuran maksimal: 2MB
- Format: JPG, PNG, WEBP

### 2. 📊 Import Mahasiswa dari Excel
- Download template Excel/CSV
- Isi data mahasiswa di Excel
- Upload file untuk import otomatis
- Validasi data otomatis
- Laporan hasil import (berhasil/gagal)

### 3. 🎨 UI yang Diperbaiki
- Tombol import di header
- Field upload foto di modal tambah/edit
- Preview foto di form
- Loading state saat upload
- Modal import dengan instruksi jelas

---

## 🚀 Cara Menggunakan

### A. Setup Awal (WAJIB!)

#### 1. Buat Bucket di Supabase
```
1. Buka https://supabase.com/dashboard
2. Pilih project Anda
3. Klik Storage → New bucket
4. Name: mahasiswa-photos
5. Public bucket: ✅ CENTANG
6. Klik Create bucket
```

#### 2. Jalankan Migration (Opsional)
Jika kolom `foto` belum ada di tabel `mahasiswa`:
```sql
-- Jalankan di Supabase SQL Editor
ALTER TABLE mahasiswa ADD COLUMN foto TEXT;
```

---

### B. Tambah Mahasiswa dengan Foto

1. Buka http://localhost:3000/admin/kelola-mahasiswa
2. Klik tombol **+** (Tambah Mahasiswa)
3. **Upload Foto:**
   - Klik "Pilih foto"
   - Pilih foto dari komputer (max 2MB)
   - Preview akan muncul
4. Isi data mahasiswa:
   - NIM
   - Nama Lengkap
   - Program Studi
   - Angkatan
   - Password
5. Klik **Simpan**
6. Foto akan diupload ke Supabase Storage
7. URL foto akan disimpan di database

---

### C. Import Mahasiswa dari Excel

#### 1. Download Template
1. Buka http://localhost:3000/admin/kelola-mahasiswa
2. Klik tombol **Import** (icon import)
3. Klik **Download Template Excel**
4. File `template_mahasiswa.csv` akan terdownload

#### 2. Isi Template
Buka file CSV di Excel dan isi data:

| NIM | Nama Lengkap | Program Studi | Angkatan | Password |
|-----|--------------|---------------|----------|----------|
| 2301010001 | Ahmad Rizki | Teknik Informatika | 2023 | password123 |
| 2301010002 | Siti Nurhaliza | Sistem Informasi | 2023 | password123 |
| 2301010003 | Budi Santoso | Teknik Informatika | 2022 | password123 |

**Catatan:**
- Jangan ubah header (baris pertama)
- Semua kolom wajib diisi
- NIM harus unik (tidak boleh duplikat)
- Angkatan harus angka (contoh: 2023)

#### 3. Upload File
1. Klik tombol **Import**
2. Klik **Pilih file CSV/Excel**
3. Pilih file yang sudah diisi
4. Klik **Import**
5. Tunggu proses selesai
6. Akan muncul laporan:
   - Berhasil: X mahasiswa
   - Gagal: Y mahasiswa
   - Error (jika ada)

---

### D. Edit Mahasiswa & Ubah Foto

1. Klik tombol **Edit** (icon pensil) pada mahasiswa
2. Foto lama akan ditampilkan (jika ada)
3. Untuk ubah foto:
   - Klik "Ubah foto"
   - Pilih foto baru
   - Preview akan muncul
4. Edit data lain jika perlu
5. Klik **Update**

---

## 📋 Format Template Excel

### Header (Baris 1):
```
NIM,Nama Lengkap,Program Studi,Angkatan,Password
```

### Contoh Data (Baris 2 dst):
```
2301010001,Ahmad Rizki Pratama,Teknik Informatika,2023,password123
2301010002,Siti Nurhaliza,Sistem Informasi,2023,password123
2301010003,Budi Santoso,Teknik Informatika,2022,password123
```

---

## ⚠️ Validasi & Error Handling

### Upload Foto
- ✅ Format: JPG, PNG, WEBP
- ✅ Ukuran max: 2MB
- ❌ Error jika format tidak didukung
- ❌ Error jika ukuran terlalu besar

### Import Excel
- ✅ Validasi semua field wajib diisi
- ✅ Validasi NIM unik (tidak duplikat)
- ✅ Validasi angkatan harus angka
- ✅ Password otomatis di-hash dengan bcrypt
- ❌ Skip baris yang error
- ✅ Laporan detail error per baris

---

## 🎯 API Endpoints Baru

### 1. Upload Foto
```
POST /api/upload
Body: FormData { file: File }
Response: { success: true, data: { filename, url } }
```

### 2. Delete Foto
```
DELETE /api/upload?filename=xxx.jpg
Response: { success: true }
```

### 3. Download Template
```
GET /api/mahasiswa/template
Response: CSV file download
```

### 4. Import Mahasiswa
```
POST /api/mahasiswa/import
Body: FormData { file: File }
Response: { success: true, data: { success, failed, errors } }
```

---

## 🔧 Troubleshooting

### Foto tidak muncul
- Pastikan bucket `mahasiswa-photos` sudah dibuat
- Pastikan bucket di-set sebagai **Public**
- Cek URL foto di database

### Import gagal
- Pastikan format CSV benar (pakai koma sebagai separator)
- Pastikan tidak ada NIM duplikat
- Pastikan semua field diisi

### Upload foto error
- Pastikan ukuran foto < 2MB
- Pastikan format JPG/PNG/WEBP
- Compress foto jika terlalu besar

---

## 📝 Catatan Penting

1. **Bucket Supabase WAJIB dibuat** sebelum upload foto
2. **Template Excel** gunakan format CSV (Excel-compatible)
3. **Password** di-hash otomatis saat import
4. **NIM duplikat** akan di-skip saat import
5. **Foto lama** tidak otomatis dihapus saat upload foto baru (untuk keamanan)

---

## 🎉 Selesai!

Semua fitur sudah siap digunakan. Silakan test dan beri tahu jika ada yang perlu diperbaiki!

