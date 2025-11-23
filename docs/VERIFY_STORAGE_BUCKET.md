# ✅ Verifikasi Storage Bucket

## 📦 Bucket yang Dibutuhkan

### **Bucket 1: `photos`** (Sudah Ada ✅)

**Fungsi:**
- Menyimpan foto profil mahasiswa
- Menyimpan foto profil pengguna (admin/dosen/staff)

**Struktur Folder:**
```
photos/
├── mahasiswa/          # Foto profil mahasiswa
│   ├── 1234567890-abc123.jpg
│   └── ...
└── users/              # Foto profil pengguna (admin/dosen/staff)
    ├── 1234567891-def456.jpg
    └── ...
```

---

### **Bucket 2: `bukti-kegiatan`** (Perlu Dibuat ⚠️)

**Fungsi:**
- Menyimpan foto bukti kegiatan mahasiswa

**Struktur:**
```
bukti-kegiatan/
├── 1234567892-ghi789.jpg
├── 1234567893-jkl012.png
└── ...
```

**Konfigurasi:**
- **Public:** `true` (foto bisa diakses publik)
- **File size limit:** `5 MB` (lebih besar dari bucket photos)
- **Allowed MIME types:** `image/jpeg, image/jpg, image/png, image/webp`

---

## 🔍 Cara Verifikasi Bucket Sudah Dibuat

### **Opsi 1: Via Supabase Dashboard (RECOMMENDED)** ⭐

1. **Buka Supabase Dashboard:** [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **Pilih project SIPMA**
3. **Klik "Storage"** di sidebar kiri
4. **Cek apakah bucket berikut sudah ada:**

**Expected Result:**

**Bucket 1: `photos`** ✅
- ✅ Public: `Yes`
- ✅ File size limit: `2 MB`
- ✅ Allowed MIME types: `image/jpeg, image/jpg, image/png, image/webp`

**Bucket 2: `bukti-kegiatan`** ⚠️ (Perlu dibuat)
- ✅ Public: `Yes`
- ✅ File size limit: `5 MB`
- ✅ Allowed MIME types: `image/jpeg, image/jpg, image/png, image/webp`

---

### **Opsi 2: Via SQL Query**

Jalankan query ini di **SQL Editor**:

```sql
-- Check all buckets
SELECT
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets
WHERE id IN ('photos', 'bukti-kegiatan')
ORDER BY id;
```

**Expected Result:**
```
id              | name            | public | file_size_limit | allowed_mime_types
----------------|-----------------|--------|-----------------|-------------------
bukti-kegiatan  | bukti-kegiatan  | true   | 5242880 (5MB)   | {image/jpeg, ...}
photos          | photos          | true   | 2097152 (2MB)   | {image/jpeg, ...}
```

---

### **Opsi 3: Via SQL - Check Policies**

```sql
-- Check policies
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
ORDER BY policyname;
```

**Expected Policies:**
1. ✅ `Public Read Access` - SELECT - public
2. ✅ `Authenticated Upload` - INSERT - authenticated
3. ✅ `Authenticated Update` - UPDATE - authenticated
4. ✅ `Authenticated Delete` - DELETE - authenticated

---

## 🚀 Jika Bucket `bukti-kegiatan` Belum Ada

### **Jalankan SQL Migration:**

1. **Buka file:** `supabase/migrations/create_bukti_kegiatan_bucket.sql`
2. **Copy semua isi file**
3. **Buka Supabase Dashboard → SQL Editor**
4. **Paste dan Run**

**Atau jalankan query ini:**

```sql
-- Create bucket "bukti-kegiatan" (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'bukti-kegiatan',
  'bukti-kegiatan',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- Policy: Public Read Access
DROP POLICY IF EXISTS "Public Read Access Bukti Kegiatan" ON storage.objects;
CREATE POLICY "Public Read Access Bukti Kegiatan"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'bukti-kegiatan');

-- Policy: Authenticated Upload
DROP POLICY IF EXISTS "Authenticated Upload Bukti Kegiatan" ON storage.objects;
CREATE POLICY "Authenticated Upload Bukti Kegiatan"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'bukti-kegiatan');

-- Policy: Authenticated Update
DROP POLICY IF EXISTS "Authenticated Update Bukti Kegiatan" ON storage.objects;
CREATE POLICY "Authenticated Update Bukti Kegiatan"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'bukti-kegiatan')
WITH CHECK (bucket_id = 'bukti-kegiatan');

-- Policy: Authenticated Delete
DROP POLICY IF EXISTS "Authenticated Delete Bukti Kegiatan" ON storage.objects;
CREATE POLICY "Authenticated Delete Bukti Kegiatan"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'bukti-kegiatan');
```

---

## 🧪 Test Upload

### **Test via Code:**

```typescript
// Upload test ke bucket bukti-kegiatan
const { data, error } = await supabase.storage
  .from('bukti-kegiatan')
  .upload('test.jpg', file);

if (error) {
  console.error('Upload failed:', error);
} else {
  console.log('Upload success:', data);
}

// Get public URL
const { data: publicUrlData } = supabase.storage
  .from('bukti-kegiatan')
  .getPublicUrl('test.jpg');

console.log('Public URL:', publicUrlData.publicUrl);
```

---

## ✅ Checklist

### **Bucket: `photos`** (Sudah Ada)
- [x] Bucket `photos` sudah dibuat
- [x] Bucket bersifat public (public = true)
- [x] File size limit = 2MB
- [x] Allowed MIME types: JPEG, JPG, PNG, WEBP
- [x] Digunakan untuk foto profil user/admin

### **Bucket: `bukti-kegiatan`** (Perlu Dibuat)
- [ ] Bucket `bukti-kegiatan` sudah dibuat
- [ ] Bucket bersifat public (public = true)
- [ ] File size limit = 5MB
- [ ] Allowed MIME types: JPEG, JPG, PNG, WEBP
- [ ] Policy "Public Read Access Bukti Kegiatan" aktif
- [ ] Policy "Authenticated Upload Bukti Kegiatan" aktif
- [ ] Policy "Authenticated Update Bukti Kegiatan" aktif
- [ ] Policy "Authenticated Delete Bukti Kegiatan" aktif
- [ ] Test upload berhasil
- [ ] Public URL bisa diakses

---

**Jika semua checklist ✅, bucket siap digunakan!** 🎉

