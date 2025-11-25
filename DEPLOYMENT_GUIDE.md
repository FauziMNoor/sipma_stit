# 🚀 Panduan Deploy ke Vercel

## ✅ Persiapan Sebelum Deploy

### 1. Pastikan Build Lokal Berhasil
```bash
npm run build
```
Jika ada error, perbaiki dulu sebelum deploy.

### 2. Set Environment Variables di Vercel

Di dashboard Vercel → Settings → Environment Variables, tambahkan:

#### **WAJIB** (Harus diisi):
- `NEXT_PUBLIC_SUPABASE_URL` = URL Supabase project Anda
  - Contoh: `https://xxxxx.supabase.co`
  - Dapatkan dari: Supabase Dashboard → Settings → API

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Anon/Public key Supabase
  - Contoh: `eyJhbGciOiJIUzI1...`
  - Dapatkan dari: Supabase Dashboard → Settings → API

- `JWT_SECRET` = Secret key untuk JWT token
  - Generate dengan: `openssl rand -base64 32`
  - Atau pakai: https://generate-secret.vercel.app/32

- `NEXT_PUBLIC_APP_URL` = URL deployment Vercel Anda
  - Setelah deploy pertama: `https://your-app.vercel.app`
  - Sebelum deploy: bisa isi `https://localhost:3000` dulu

#### **OPSIONAL** (Sudah ada default):
- `NEXT_PUBLIC_APP_NAME` = `SIPMA STIT`
- `NEXT_PUBLIC_MAX_FILE_SIZE` = `5242880`
- `NEXT_PUBLIC_ALLOWED_FILE_TYPES` = `image/jpeg,image/png,image/jpg,application/pdf`

---

## 📋 Langkah Deploy ke Vercel

### Cara 1: Deploy via Vercel Dashboard (Recommended)

1. **Login ke Vercel**: https://vercel.com/login
2. **Import Project**:
   - Klik "Add New" → "Project"
   - Connect GitHub/GitLab repository Anda
   - Pilih repository `sipma`
3. **Configure Project**:
   - Framework Preset: **Next.js** (auto-detect)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
4. **Environment Variables**:
   - Tambahkan semua env vars di atas
   - ⚠️ **PENTING**: Pilih environment → `Production`, `Preview`, dan `Development`
5. **Deploy**:
   - Klik "Deploy"
   - Tunggu build selesai (~2-5 menit)

### Cara 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI (jika belum)
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Atau langsung production
vercel --prod
```

---

## 🔧 Troubleshooting

### Error: "DEPLOYMENT_NOT_FOUND" atau Build Gagal

#### Solusi 1: Cek Environment Variables
```bash
# Di terminal lokal, cek apakah build berhasil dengan env vars
npm run build
```
Pastikan semua env vars sudah di-set di Vercel Dashboard.

#### Solusi 2: Clear Build Cache
Di Vercel Dashboard:
1. Settings → General
2. Scroll ke bawah → "Clear Build Cache"
3. Deploy ulang

#### Solusi 3: Update Node Version
Di `package.json`, tambahkan:
```json
{
  "engines": {
    "node": ">=18.17.0"
  }
}
```

#### Solusi 4: Disable React Compiler (jika masih error)
Edit `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  // Hapus atau comment line ini jika error
  // reactCompiler: true,
};
```

### Error: Supabase Connection Failed

Pastikan:
1. ✅ NEXT_PUBLIC_SUPABASE_URL benar (tanpa trailing slash)
2. ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY benar (copy paste full key)
3. ✅ Supabase project aktif (tidak paused)

### Error: JWT Token Invalid

Pastikan:
1. ✅ JWT_SECRET sama dengan yang digunakan saat development
2. ✅ JWT_SECRET minimal 32 karakter

---

## 📝 Checklist Deploy

Sebelum deploy, pastikan:

- [ ] Build lokal berhasil: `npm run build`
- [ ] Semua environment variables sudah di-set di Vercel
- [ ] Repository sudah di-push ke GitHub/GitLab
- [ ] Supabase database sudah setup (tables, RLS policies)
- [ ] File `.env.local` **TIDAK** di-commit (sudah di `.gitignore`)

---

## 🎯 Setelah Deploy Berhasil

1. **Update NEXT_PUBLIC_APP_URL**:
   - Di Vercel Dashboard → Settings → Environment Variables
   - Update `NEXT_PUBLIC_APP_URL` dengan URL production: `https://your-app.vercel.app`
   - Redeploy (Deployments → ... → Redeploy)

2. **Test Aplikasi**:
   - Buka URL production
   - Test login
   - Test semua fitur utama

3. **Setup Custom Domain** (opsional):
   - Vercel Dashboard → Settings → Domains
   - Tambahkan domain custom Anda

---

## 📞 Need Help?

Jika masih ada error:
1. Cek Vercel build logs: Deployments → klik deployment → "View Build Logs"
2. Screenshot error yang muncul
3. Cek Vercel Runtime Logs: Deployment → "Functions" tab

---

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Supabase Dashboard: https://app.supabase.com
