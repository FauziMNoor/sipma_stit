# 📦 SUPABASE STORAGE SETUP - SIPMA

## 🎯 Tujuan
Membuat bucket storage di Supabase untuk menyimpan foto profil mahasiswa dan pengguna.

---

## 📋 Langkah-langkah Setup

### **1. Buka Supabase Dashboard**

1. Login ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project SIPMA Anda
3. Klik menu **Storage** di sidebar kiri

---

### **2. Buat Bucket "photos"**

1. Klik tombol **"New bucket"**
2. Isi form:
   - **Name**: `photos`
   - **Public bucket**: ✅ **CENTANG** (agar foto bisa diakses publik)
   - **File size limit**: `2 MB` (opsional)
   - **Allowed MIME types**: `image/jpeg, image/png, image/jpg` (opsional)

3. Klik **"Create bucket"**

---

### **3. Setup Storage Policy (RLS)**

Setelah bucket dibuat, kita perlu setup policy agar:
- ✅ **Semua orang bisa READ** (lihat foto)
- ✅ **Hanya authenticated user bisa UPLOAD/UPDATE/DELETE**

#### **A. Policy untuk SELECT (Read)**

1. Klik bucket **"photos"**
2. Klik tab **"Policies"**
3. Klik **"New Policy"**
4. Pilih **"For full customization"**
5. Isi form:
   - **Policy name**: `Public Read Access`
   - **Allowed operation**: `SELECT`
   - **Target roles**: `public`
   - **USING expression**: `true`

6. Klik **"Review"** → **"Save policy"**

#### **B. Policy untuk INSERT (Upload)**

1. Klik **"New Policy"** lagi
2. Pilih **"For full customization"**
3. Isi form:
   - **Policy name**: `Authenticated Upload`
   - **Allowed operation**: `INSERT`
   - **Target roles**: `authenticated`
   - **WITH CHECK expression**: `true`

4. Klik **"Review"** → **"Save policy"**

#### **C. Policy untuk UPDATE**

1. Klik **"New Policy"** lagi
2. Pilih **"For full customization"**
3. Isi form:
   - **Policy name**: `Authenticated Update`
   - **Allowed operation**: `UPDATE`
   - **Target roles**: `authenticated`
   - **USING expression**: `true`
   - **WITH CHECK expression**: `true`

4. Klik **"Review"** → **"Save policy"**

#### **D. Policy untuk DELETE**

1. Klik **"New Policy"** lagi
2. Pilih **"For full customization"**
3. Isi form:
   - **Policy name**: `Authenticated Delete`
   - **Allowed operation**: `DELETE`
   - **Target roles**: `authenticated`
   - **USING expression**: `true`

4. Klik **"Review"** → **"Save policy"**

---

### **4. Alternatif: Setup via SQL**

Jika lebih suka menggunakan SQL, jalankan query ini di **SQL Editor**:

```sql
-- Create bucket (jika belum ada)
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Public Read
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'photos');

-- Policy: Authenticated Upload
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'photos');

-- Policy: Authenticated Update
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'photos')
WITH CHECK (bucket_id = 'photos');

-- Policy: Authenticated Delete
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'photos');
```

---

### **5. Verifikasi Setup**

1. Kembali ke tab **Storage** → **photos**
2. Coba upload file test:
   - Klik **"Upload file"**
   - Pilih gambar
   - Klik **"Upload"**

3. Jika berhasil, file akan muncul di list
4. Klik file → **"Get URL"** → Copy URL
5. Buka URL di browser baru
6. Jika gambar muncul, berarti setup **BERHASIL!** ✅

---

## 🎉 Selesai!

Bucket **"photos"** sudah siap digunakan untuk:
- ✅ Foto profil mahasiswa (`photos/mahasiswa/`)
- ✅ Foto profil pengguna (`photos/users/`)
- ✅ Bukti kegiatan (`photos/bukti/`)

---

## 🔧 Troubleshooting

### **Error: "new row violates row-level security policy"**
- **Penyebab**: Policy belum dibuat atau salah konfigurasi
- **Solusi**: Pastikan policy untuk INSERT sudah dibuat dengan target `authenticated`

### **Error: "Bucket not found"**
- **Penyebab**: Bucket belum dibuat
- **Solusi**: Buat bucket dengan nama `photos` dan centang "Public bucket"

### **Foto tidak bisa diakses (403 Forbidden)**
- **Penyebab**: Policy SELECT belum dibuat atau bucket tidak public
- **Solusi**: 
  1. Pastikan bucket di-set sebagai **public**
  2. Pastikan policy SELECT untuk `public` sudah dibuat

