# Setup Supabase Storage Bucket untuk Upload Foto

## Bucket yang Diperlukan

Aplikasi SIPMA memerlukan bucket storage untuk upload foto:
- **Nama Bucket**: `mahasiswa-photos`
- **Tipe**: Public (untuk akses foto profil dan bukti kegiatan)

## Langkah-Langkah Setup

### 1. Buka Supabase Dashboard

1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda
3. Klik menu **Storage** di sidebar kiri

### 2. Create Bucket

1. Klik tombol **"New bucket"**
2. Isi form dengan data berikut:
   - **Name**: `mahasiswa-photos`
   - **Public bucket**: ✅ Centang (Enable)
   - **File size limit**: 2MB (2097152 bytes)
   - **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/webp`
3. Klik **"Create bucket"**

### 3. Setup Bucket Policies

Setelah bucket dibuat, set policies untuk keamanan:

#### Policy 1: Allow Public Read
```sql
-- Allow anyone to read files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'mahasiswa-photos' );
```

#### Policy 2: Allow Authenticated Upload
```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'mahasiswa-photos' 
  AND auth.role() = 'authenticated'
);
```

#### Policy 3: Allow Owner to Delete
```sql
-- Allow users to delete their own uploads
CREATE POLICY "Users can delete their own uploads"
ON storage.objects FOR DELETE
USING ( 
  bucket_id = 'mahasiswa-photos'
  AND auth.role() = 'authenticated'
);
```

### 4. Verifikasi Setup

Setelah setup, verifikasi dengan:

1. **Test Upload**:
   - Buka halaman input kegiatan mahasiswa
   - Upload foto bukti
   - Pastikan foto berhasil diupload dan tampil

2. **Test Input Pelanggaran**:
   - Login sebagai Musyrif
   - Buka halaman Input Pelanggaran
   - Upload foto bukti
   - Pastikan foto berhasil diupload

3. **Check Storage Dashboard**:
   - Buka Storage > mahasiswa-photos
   - Pastikan file berhasil diupload dan bisa diakses

## Struktur Folder (Opsional)

Jika ingin mengorganisir file dalam folder:

```
mahasiswa-photos/
├── kegiatan/          # Foto bukti kegiatan mahasiswa
├── pelanggaran/       # Foto bukti pelanggaran
└── profile/           # Foto profil user
```

Untuk implementasi folder, update kode upload di `/api/upload/route.ts`:

```typescript
const folder = formData.get('folder') as string || '';
const filename = folder ? `${folder}/${timestamp}-${randomString}.${extension}` : `${timestamp}-${randomString}.${extension}`;
```

## Security Best Practices

1. ✅ **File Size Limit**: Max 2MB untuk mencegah abuse
2. ✅ **MIME Type Validation**: Hanya terima image files
3. ✅ **Authentication Required**: Upload harus authenticated
4. ✅ **Unique Filenames**: Gunakan timestamp + random string
5. ⚠️ **Content Scanning**: Consider menambahkan virus scanning untuk production

## Troubleshooting

### Error: "Bucket not found"
- Pastikan bucket sudah dibuat dengan nama exact: `mahasiswa-photos`
- Check spelling dan case sensitivity

### Error: "Permission denied"
- Pastikan policies sudah disetup dengan benar
- Pastikan user sudah authenticated saat upload

### Error: "File too large"
- Pastikan file < 2MB
- Check bucket settings untuk file size limit

### Foto tidak tampil / 404
- Pastikan bucket di-set sebagai Public
- Check public URL format: `https://[project-id].supabase.co/storage/v1/object/public/mahasiswa-photos/[filename]`

## Monitoring

Pantau penggunaan storage melalui:
1. **Storage Dashboard**: Lihat jumlah file dan total size
2. **Storage Quotas**: Check limits pada project settings
3. **Logs**: Monitor upload activities di project logs

## Migration dari Link ke Upload

Jika sebelumnya menggunakan external link:
1. Backup data existing di database
2. Update semua references dari link ke uploaded file
3. Clean up unused external links

## Related Files

- `/src/app/api/upload/route.ts` - Upload API endpoint
- `/src/components/InputPelanggaranMusyrif.tsx` - Musyrif input pelanggaran dengan upload
- `/src/app/api/musyrif/pelanggaran/route.ts` - API endpoint pelanggaran

## Support

Untuk bantuan lebih lanjut:
- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase Storage Policies](https://supabase.com/docs/guides/storage/security/access-control)
