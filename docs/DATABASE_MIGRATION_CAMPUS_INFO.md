# Database Migration: Menambahkan Kolom No HP dan Info Kampus

## Deskripsi
Migrasi ini menambahkan:
1. Kolom `no_hp` pada tabel `users` untuk menyimpan nomor HP pengguna
2. Settings kampus (alamat, telepon, email admin, dll) pada tabel `settings`

## SQL Migration

### Langkah 1: Menambahkan Kolom `no_hp` pada Tabel `users`

```sql
-- Menambahkan kolom no_hp pada tabel users
ALTER TABLE users 
ADD COLUMN no_hp VARCHAR(20);

-- Menambahkan comment pada kolom
COMMENT ON COLUMN users.no_hp IS 'Nomor HP/WhatsApp pengguna';
```

### Langkah 2: Menambahkan Settings Informasi Kampus

```sql
-- Insert settings untuk informasi kampus ke tabel system_settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, category, description, created_at, updated_at) VALUES
('campus_name', 'STIT Riyadhussholihiin', 'text', 'general', 'Nama kampus', NOW(), NOW()),
('campus_address', 'Jl. Pendidikan No. 123, Kota, Provinsi', 'text', 'general', 'Alamat lengkap kampus', NOW(), NOW()),
('campus_phone', '+6281234567890', 'text', 'general', 'Nomor telepon kampus/admin sistem', NOW(), NOW()),
('campus_email_admin', 'admin@stit.ac.id', 'text', 'general', 'Email administrator sistem', NOW(), NOW()),
('campus_email_akademik', 'akademik@stit.ac.id', 'text', 'general', 'Email bagian akademik', NOW(), NOW()),
('campus_phone_akademik', '+6281234567891', 'text', 'general', 'Nomor telepon bagian akademik', NOW(), NOW()),
('campus_operational_hours', 'Senin - Jumat: 08.00 - 16.00 WIB', 'text', 'general', 'Jam operasional kampus', NOW(), NOW())
ON CONFLICT (setting_key) DO UPDATE 
SET setting_value = EXCLUDED.setting_value, updated_at = NOW();
```

## Cara Menjalankan di Supabase

### Opsi 1: Via Supabase Dashboard (SQL Editor)

1. Buka Supabase Dashboard: https://app.supabase.com
2. Pilih project Anda
3. Klik menu **SQL Editor** di sidebar kiri
4. Klik **New Query**
5. Copy paste SQL di atas (Langkah 1 dan Langkah 2)
6. Klik **Run** atau tekan `Ctrl+Enter`

### Opsi 2: Via Supabase CLI

```bash
# Pastikan Supabase CLI sudah terinstall
# npm install -g supabase

# Login ke Supabase
supabase login

# Link ke project
supabase link --project-ref your-project-ref

# Buat file migration
supabase migration new add_no_hp_and_campus_info

# Edit file migration di supabase/migrations/
# Paste SQL di atas

# Apply migration
supabase db push
```

## Verifikasi

Setelah menjalankan migration, verifikasi dengan query berikut:

```sql
-- Cek kolom no_hp sudah ada
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'no_hp';

-- Cek settings kampus sudah ada
SELECT key, value 
FROM settings 
WHERE key LIKE 'campus%' 
ORDER BY key;
```

## Expected Results

### Verifikasi Kolom no_hp:
```
column_name | data_type      | character_maximum_length
------------|----------------|------------------------
no_hp       | character varying | 20
```

### Verifikasi Settings:
```
key                      | value
-------------------------|----------------------------------
campus_address           | Jl. Pendidikan No. 123, Kota, Provinsi
campus_email_akademik    | akademik@stit.ac.id
campus_email_admin       | admin@stit.ac.id
campus_name              | STIT Riyadhussholihiin
campus_operational_hours | Senin - Jumat: 08.00 - 16.00 WIB
campus_phone             | +6281234567890
campus_phone_akademik    | +6281234567891
```

## Rollback (Jika Diperlukan)

Jika perlu membatalkan perubahan:

```sql
-- Menghapus kolom no_hp
ALTER TABLE users 
DROP COLUMN IF EXISTS no_hp;

-- Menghapus settings kampus
DELETE FROM settings 
WHERE key LIKE 'campus%';
```

## Catatan Penting

1. **Backup Database**: Selalu backup database sebelum menjalankan migration
2. **Testing**: Test di environment development terlebih dahulu
3. **Data Existing**: Kolom `no_hp` akan NULL untuk data existing, bisa diisi melalui admin panel
4. **Format No HP**: Gunakan format internasional (+62...) untuk konsistensi

## Update Setelah Migration

Setelah migration berhasil, update:
1. ✅ Halaman Admin > Pengaturan Sistem - untuk edit info kampus
2. ✅ Modal Tambah/Edit User di Admin - tambahkan field no_hp
3. ✅ Halaman Bantuan Dosen PA - fetch data dari settings
4. ✅ API endpoint untuk get/update settings kampus
