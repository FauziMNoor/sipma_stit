# 🚀 Panduan Deploy ke Netlify - SIPMA STIT

## ✅ Error Fixed!

Saya sudah perbaiki error **"Missing Supabase environment variables"** yang terjadi saat build.

---

## 📋 Langkah Deploy ke Netlify

### **Step 1: Set Environment Variables di Netlify Dashboard**

⚠️ **PENTING**: Ini WAJIB dilakukan SEBELUM deploy ulang!

1. Buka **Netlify Dashboard**: https://app.netlify.com
2. Pilih site Anda (atau buat baru)
3. Klik **"Site configuration"** → **"Environment variables"**
4. Tambahkan semua variable berikut:

```env
# 🔴 WAJIB - Tanpa ini aplikasi tidak akan berjalan!
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET = <minimal 32 karakter random string>

# 🟢 OPSIONAL - Ada default values
NEXT_PUBLIC_APP_URL = https://your-site.netlify.app
NEXT_PUBLIC_APP_NAME = SIPMA STIT
NEXT_PUBLIC_MAX_FILE_SIZE = 5242880
NEXT_PUBLIC_ALLOWED_FILE_TYPES = image/jpeg,image/png,image/jpg,application/pdf
```

#### **Cara Mendapatkan Values:**

##### 1. **NEXT_PUBLIC_SUPABASE_URL** dan **NEXT_PUBLIC_SUPABASE_ANON_KEY**:
   - Buka **Supabase Dashboard**: https://app.supabase.com
   - Pilih project Anda
   - Klik ⚙️ **Settings** → **API**
   - Copy:
     - **Project URL** → untuk `NEXT_PUBLIC_SUPABASE_URL`
     - **anon/public key** → untuk `NEXT_PUBLIC_SUPABASE_ANON_KEY`

##### 2. **JWT_SECRET**:
   - Generate random string 32+ karakter
   - Gunakan: https://generate-secret.vercel.app/32
   - Atau terminal: `openssl rand -base64 32`

##### 3. **NEXT_PUBLIC_APP_URL**:
   - Setelah deploy pertama, dapat dari Netlify
   - Format: `https://your-site-name.netlify.app`
   - Bisa isi sementara dengan URL apapun, update setelah deploy

---

### **Step 2: Deploy Ulang**

Setelah set environment variables:

#### **Cara 1: Trigger Redeploy** (Jika sudah pernah deploy)
1. Di Netlify Dashboard → **Deploys**
2. Klik **"Trigger deploy"** → **"Clear cache and deploy site"**

#### **Cara 2: Push ke GitHub** (Akan auto-deploy)
```bash
git add .
git commit -m "Fix Netlify deployment configuration"
git push origin main
```

#### **Cara 3: Manual Deploy** (Drag & Drop)
1. Build lokal: `npm run build`
2. Zip folder `.next`
3. Drag & drop ke Netlify Dashboard → Deploys

---

### **Step 3: Verifikasi Deployment**

Setelah deployment selesai (tunggu ~2-3 menit):

1. ✅ Cek logs: Pastikan tidak ada error
2. ✅ Buka URL site: `https://your-site.netlify.app`
3. ✅ Test login: Coba login dengan user admin
4. ✅ Test fitur: Navigasi ke beberapa halaman

---

## 🔧 Troubleshooting

### Error: "Missing Supabase environment variables" (Masih Muncul)

**Solusi:**
1. ✅ Pastikan semua env vars sudah di-set di Netlify Dashboard
2. ✅ Clear cache: Deploys → "Clear cache and deploy site"
3. ✅ Check typo: Nama variable harus PERSIS sama (case-sensitive)

### Error: "Supabase connection failed" saat runtime

**Penyebab:**
- URL Supabase salah
- Anon Key salah
- Supabase project tidak aktif (paused)

**Solusi:**
1. Cek di Supabase Dashboard → Settings → API
2. Copy ulang URL dan Anon Key
3. Paste ke Netlify Environment Variables (ganti yang lama)
4. Redeploy

### Error: "JWT token invalid"

**Solusi:**
- Pastikan JWT_SECRET di Netlify SAMA dengan yang dipakai saat development
- Atau generate JWT_SECRET baru dan set di Netlify

### Error: Build timeout / Out of memory

**Solusi:**
Edit `netlify.toml`, tambahkan:
```toml
[build.environment]
  NODE_OPTIONS = "--max-old-space-size=4096"
```

---

## 📝 Checklist Deploy

Sebelum deploy, pastikan:

- [x] ✅ Error "Missing Supabase environment variables" sudah diperbaiki
- [ ] Environment variables sudah di-set di Netlify Dashboard
- [ ] Code terbaru sudah di-push ke GitHub
- [ ] Supabase database sudah setup (tables, RLS policies)
- [ ] Build lokal berhasil: `npm run build`

---

## 🎯 Setelah Deploy Berhasil

### 1. **Update NEXT_PUBLIC_APP_URL**:
   - Copy URL production dari Netlify
   - Update di Netlify Dashboard → Environment Variables
   - Redeploy

### 2. **Setup Custom Domain** (Opsional):
   - Netlify Dashboard → **Domain settings**
   - Klik **"Add custom domain"**
   - Ikuti instruksi untuk update DNS

### 3. **Enable HTTPS**:
   - Auto-enable oleh Netlify
   - Biasanya aktif dalam 24 jam setelah custom domain setup

---

## 🔗 Files yang Sudah Dibuat

Saya sudah membuat file konfigurasi untuk Netlify:

1. ✅ **`netlify.toml`** - Konfigurasi deployment Netlify
2. ✅ **`src/lib/supabase.ts`** - Updated untuk handle build time dengan baik
3. ✅ **`NETLIFY_DEPLOYMENT_GUIDE.md`** - Panduan lengkap ini

---

## 📞 Need Help?

Jika masih ada error:

1. **Check build logs**:
   - Netlify Dashboard → Deploys → Klik deploy yang error
   - Screenshot error message
   
2. **Check runtime logs**:
   - Netlify Dashboard → Functions
   - Lihat error yang muncul saat aplikasi dijalankan

3. **Kirim ke saya**:
   - Screenshot error
   - Build logs (copy text)
   - Screenshot environment variables (tanpa value untuk keamanan)

---

## 🚀 Quick Commands

```bash
# Build lokal untuk test
npm run build

# Commit & push ke GitHub (auto-deploy)
git add .
git commit -m "Update deployment config"
git push origin main

# Install Netlify CLI (opsional)
npm install -g netlify-cli

# Deploy via CLI
netlify deploy --prod
```

---

## 🎉 That's It!

Setelah set environment variables di Netlify Dashboard, deployment seharusnya berhasil!

Good luck! 🚀
