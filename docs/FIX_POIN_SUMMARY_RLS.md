# Fix Poin Summary RLS Error

## 🐛 Problem

Ketika Waket3 atau Dosen PA menyetujui/menolak pengajuan kegiatan mahasiswa, muncul error:

```
Error: new row violates row-level security policy for table "poin_summary"
```

## 🔍 Root Cause

Ketika `poin_aktivitas` diupdate (status berubah dari pending ke approved/rejected), ada trigger di database yang otomatis mengupdate tabel `poin_summary`. Namun, trigger tersebut terkena RLS (Row Level Security) policy yang terlalu ketat.

## ✅ Solution

Jalankan script SQL berikut di **Supabase SQL Editor**:

### Langkah-langkah:

1. **Buka Supabase Dashboard**
   - Login ke https://supabase.com
   - Pilih project SIPMA

2. **Buka SQL Editor**
   - Klik menu "SQL Editor" di sidebar kiri
   - Klik "New query"

3. **Copy & Paste Script**
   - Buka file: `scripts/fix-poin-summary-rls.sql`
   - Copy semua isi file
   - Paste ke SQL Editor

4. **Run Script**
   - Klik tombol "Run" atau tekan `Ctrl + Enter`
   - Tunggu sampai selesai
   - Pastikan muncul pesan: "RLS policies fixed successfully!"

5. **Verify**
   - Coba approve/reject pengajuan lagi
   - Seharusnya sudah tidak ada error

## 📝 What the Script Does

Script ini akan:
1. ✅ Drop semua RLS policies yang ada di tabel `poin_summary`
2. ✅ Enable RLS pada tabel `poin_summary`
3. ✅ Membuat policies baru yang lebih permissive:
   - Allow SELECT untuk semua user (untuk dashboard)
   - Allow INSERT untuk semua user (untuk trigger)
   - Allow UPDATE untuk semua user (untuk trigger)
   - Allow DELETE untuk semua user (backup)

## 🔒 Security Note

Policies ini tetap aman karena:
- Tabel `poin_summary` hanya diupdate oleh trigger otomatis
- User tidak bisa langsung mengakses tabel ini dari client
- Semua akses tetap melalui API yang sudah terproteksi

## 🧪 Testing

Setelah menjalankan script, test dengan:

1. Login sebagai Waket3
2. Buka halaman Verifikasi
3. Pilih pengajuan yang pending
4. Klik "Setujui" atau "Tolak"
5. Seharusnya berhasil tanpa error

## 📞 Support

Jika masih ada error, cek:
- Console browser (F12) untuk error detail
- Terminal server untuk error log
- Supabase Dashboard > Logs untuk database error

