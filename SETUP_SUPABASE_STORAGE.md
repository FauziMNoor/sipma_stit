# Setup Supabase Storage untuk Foto Mahasiswa

## 1. Buat Bucket di Supabase

1. Buka Supabase Dashboard: https://supabase.com/dashboard
2. Pilih project Anda
3. Klik **Storage** di sidebar kiri
4. Klik **New bucket**
5. Isi form:
   - **Name**: `mahasiswa-photos`
   - **Public bucket**: ✅ **CENTANG** (agar foto bisa diakses publik)
   - **File size limit**: 2MB (opsional)
   - **Allowed MIME types**: `image/jpeg,image/jpg,image/png,image/webp` (opsional)
6. Klik **Create bucket**

## 2. Setup Policies (Opsional - untuk keamanan)

Jika Anda ingin mengatur akses lebih ketat:

1. Klik bucket `mahasiswa-photos`
2. Klik tab **Policies**
3. Tambahkan policy berikut:

### Policy: Allow Public Read
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'mahasiswa-photos' );
```

### Policy: Allow Authenticated Upload
```sql
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'mahasiswa-photos' );
```

### Policy: Allow Authenticated Delete
```sql
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'mahasiswa-photos' );
```

## 3. Verifikasi Setup

Setelah bucket dibuat, coba upload foto melalui aplikasi:

1. Buka http://localhost:3000/admin/kelola-mahasiswa
2. Klik tombol **+** (Tambah Mahasiswa)
3. Pilih foto dari komputer
4. Isi data mahasiswa
5. Klik **Simpan**
6. Foto akan diupload ke Supabase Storage

## 4. Troubleshooting

### Error: "Bucket not found"
- Pastikan nama bucket adalah `mahasiswa-photos` (huruf kecil, dengan dash)
- Pastikan bucket sudah dibuat di Supabase Dashboard

### Error: "Permission denied"
- Pastikan bucket di-set sebagai **Public**
- Atau tambahkan policies seperti di atas

### Error: "File too large"
- Ukuran maksimal file adalah 2MB
- Compress foto terlebih dahulu jika terlalu besar

## 5. URL Foto

Setelah upload, foto akan tersimpan dengan URL format:
```
https://[PROJECT_ID].supabase.co/storage/v1/object/public/mahasiswa-photos/[FILENAME]
```

URL ini akan disimpan di database kolom `mahasiswa.foto`

