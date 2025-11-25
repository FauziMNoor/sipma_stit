# 🚀 Quick Setup: Upload Foto

Error: **"Failed to load resource: the server responded with a status of 500"**

**Penyebab**: Bucket storage belum dibuat di Supabase.

## ✅ Solusi Cepat (5 Menit)

### Opsi 1: Via SQL Editor (RECOMMENDED) ⚡

1. **Buka Supabase Dashboard**
   - Login ke https://app.supabase.com
   - Pilih project Anda

2. **Buka SQL Editor**
   - Klik menu **"SQL Editor"** di sidebar kiri
   - Atau langsung ke: `https://app.supabase.com/project/[your-project-id]/sql/new`

3. **Copy & Paste Script**
   - Buka file: `supabase/setup-storage-bucket.sql`
   - Copy semua isinya
   - Paste di SQL Editor

4. **Run Script**
   - Klik tombol **"Run"** (atau tekan Ctrl+Enter)
   - Tunggu sampai selesai (≈ 2 detik)
   - ✅ Lihat message: "Success. No rows returned"

5. **Verify**
   - Klik menu **"Storage"** di sidebar
   - Anda akan lihat bucket **"mahasiswa-photos"** 
   - Status: **Public** ✅

### Opsi 2: Via Dashboard UI (Manual) 🖱️

1. **Buka Storage**
   - Klik menu **"Storage"** di sidebar Supabase

2. **Create New Bucket**
   - Klik tombol **"New bucket"**
   - Isi form:
     ```
     Name: mahasiswa-photos
     Public bucket: ✅ (CENTANG INI!)
     ```
   - Klik **"Create bucket"**

3. **Setup Policies**
   - Klik bucket "mahasiswa-photos" yang baru dibuat
   - Tab **"Policies"**
   - Klik **"New Policy"**
   - Pilih template **"Enable access to all users"** untuk SELECT
   - Klik **"Review"** → **"Save policy"**
   
   - Klik **"New Policy"** lagi
   - Pilih template **"Enable insert for authenticated users only"**
   - Klik **"Review"** → **"Save policy"**

## 🧪 Test Upload

Setelah setup bucket:

1. **Restart Dev Server**
   ```bash
   # Tekan Ctrl+C di terminal
   # Lalu run lagi:
   npm run dev
   ```

2. **Test Upload**
   - Login sebagai Musyrif
   - Buka `/musyrif/pelanggaran`
   - Upload foto di field "Foto Bukti"
   - ✅ Harus berhasil tanpa error 500

3. **Check di Supabase**
   - Buka Storage → mahasiswa-photos
   - File yang diupload akan muncul disini

## 🐛 Troubleshooting

### Error: "Bucket already exists"
**Solusi**: Bucket sudah ada, cek di Storage menu. Jika sudah ada, langsung test upload.

### Error: "Policy already exists" 
**Solusi**: Policies sudah disetup sebelumnya, skip error ini dan test upload.

### Upload masih error 500 setelah setup
**Check**:
1. Refresh browser (Ctrl+F5)
2. Clear cache browser
3. Logout dan login ulang
4. Check console browser (F12) untuk error detail
5. Check terminal server untuk error logs

### Foto terupload tapi tidak muncul
**Check**:
1. Pastikan bucket di-set **Public** (ada checkbox ini saat create)
2. Buka Storage → mahasiswa-photos → Settings
3. Pastikan "Public" = **ON**
4. Re-upload foto

## 📊 Monitoring

**Check Storage Usage**:
- Dashboard → Settings → Usage
- Monitor: Storage used, API requests, Bandwidth

**Limits (Free Tier)**:
- Storage: 1 GB
- Bandwidth: 2 GB/month
- Jika limit habis, upgrade ke Pro plan

## 🔗 Environment Variables

Pastikan `.env.local` sudah benar:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Jika tidak ada atau salah:
1. Buka Supabase Dashboard → Settings → API
2. Copy "Project URL" dan "anon public" key
3. Update `.env.local`
4. Restart server

## ✨ Success Indicators

Upload berhasil jika:
- ✅ Tidak ada error di console
- ✅ Preview foto muncul
- ✅ Alert: "Pelanggaran berhasil dicatat..."
- ✅ File muncul di Supabase Storage

## 📞 Need Help?

Jika masih ada masalah:
1. Screenshot error dari browser console (F12)
2. Screenshot error dari terminal server
3. Screenshot Supabase Storage page
4. Kirim ke developer untuk bantuan

---

**Quick Links**:
- [Supabase Dashboard](https://app.supabase.com)
- [Storage Documentation](https://supabase.com/docs/guides/storage)
- SQL Script: `supabase/setup-storage-bucket.sql`
