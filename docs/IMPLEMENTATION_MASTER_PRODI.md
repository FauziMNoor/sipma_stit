# Implementasi Master Program Studi

## Overview
Implementasi sistem master data Program Studi untuk standardisasi dan validasi data prodi mahasiswa.

## Changes Summary

### 1. Database Migration
**File:** `supabase/migrations/create_master_prodi.sql`
- Membuat tabel `master_prodi` dengan kolom:
  - `id` (UUID, primary key)
  - `kode_prodi` (VARCHAR(10), unique)
  - `nama_prodi` (VARCHAR(100))
  - `is_active` (BOOLEAN, default true)
  - `created_at`, `updated_at` (TIMESTAMP)
- Data default: PAI, ES, HKI
- RLS policies untuk keamanan

### 2. API Endpoints
**File:** `src/app/api/master-prodi/route.ts`

#### GET /api/master-prodi
- Query params: `active_only=true` (optional)
- Returns: List semua prodi atau prodi aktif saja
- Response: `{ success: true, data: [...] }`

#### POST /api/master-prodi
- Body: `{ kode_prodi, nama_prodi, is_active }`
- Validasi: kode_prodi unique
- Returns: Data prodi yang baru dibuat

#### PUT /api/master-prodi
- Body: `{ id, kode_prodi?, nama_prodi?, is_active? }`
- Updates: Prodi berdasarkan ID

#### DELETE /api/master-prodi
- Query params: `id=<uuid>`
- Soft delete: Set `is_active = false`
- Prevents hard delete untuk menjaga referential integrity

### 3. UI Kelola Prodi (Admin)
**File:** `src/components/PengaturanSistem.tsx`

**Fitur:**
- Section baru "Kelola Program Studi" di Pengaturan Sistem
- Modal kelola dengan list semua prodi
- Form tambah prodi (kode & nama)
- Form edit prodi (kode, nama, status aktif)
- Soft delete (nonaktifkan prodi)
- Badge status aktif/nonaktif

**State Management:**
```typescript
- showProdiModal: boolean
- showAddProdiModal: boolean
- showEditProdiModal: boolean
- prodiList: any[]
- selectedProdi: any
- prodiForm: { kode_prodi, nama_prodi, is_active }
```

**Functions:**
- `fetchProdiList()` - Load semua prodi
- `handleOpenProdiModal()` - Buka modal kelola
- `handleAddProdi()` - Tambah prodi baru
- `handleEditProdi(prodi)` - Edit prodi existing
- `handleUpdateProdi()` - Save update prodi
- `handleDeleteProdi(prodiId)` - Soft delete prodi

### 4. Form Mahasiswa Update
**File:** `src/components/KelolaMahasiswa.tsx`

**Changes:**
- Tambah state `prodiList`
- Tambah function `fetchProdiList()`
- **Modal Add:** Input text → Dropdown select dinamis
- **Modal Edit:** Input text → Dropdown select dinamis
- Warning message jika belum ada prodi

**Dropdown Implementation:**
```tsx
<select value={formData.prodi} onChange={...}>
  <option value="">Pilih Program Studi</option>
  {prodiList.map((prodi) => (
    <option key={prodi.id} value={prodi.nama_prodi}>
      {prodi.nama_prodi}
    </option>
  ))}
</select>
```

### 5. Laporan Statistik Update
**File:** `src\components\LaporanStatistik.tsx`

**Changes:**
- Tambah state `prodiList`
- Tambah function `fetchProdiList()`
- Filter prodi: Hardcoded options → Dropdown dinamis dari API

## Setup Instructions

### 1. Run Migration di Supabase
```bash
# Login to Supabase Dashboard
# Navigate to SQL Editor
# Paste content dari: supabase/migrations/create_master_prodi.sql
# Execute query
```

Atau jika menggunakan Supabase CLI:
```bash
supabase db push
```

### 2. Verify Database
Check tabel `master_prodi` sudah ada dengan 3 data default:
- PAI - Pendidikan Agama Islam
- ES - Ekonomi Syariah  
- HKI - Hukum Keluarga Islam

### 3. Test Flow

#### A. Test Kelola Prodi (Admin)
1. Login sebagai admin
2. Buka: **Pengaturan Sistem** → **Kelola Program Studi**
3. Test **Tambah Prodi:**
   - Klik "Tambah Program Studi"
   - Isi kode (e.g., "TI") dan nama (e.g., "Teknik Informatika")
   - Save → Verify muncul di list
4. Test **Edit Prodi:**
   - Klik icon edit pada prodi
   - Ubah nama atau status aktif
   - Save → Verify perubahan tersimpan
5. Test **Delete Prodi:**
   - Klik icon delete
   - Confirm → Verify status jadi "Nonaktif"

#### B. Test Form Mahasiswa
1. Buka: **Kelola Mahasiswa** → **Tambah Mahasiswa**
2. Verify field "Program Studi" adalah dropdown
3. Verify list prodi muncul (hanya yang aktif)
4. Pilih prodi → Save
5. Test juga di **Edit Mahasiswa**

#### C. Test Laporan Statistik
1. Buka: **Laporan & Statistik**
2. Verify filter "Program Studi" adalah dropdown
3. Verify list prodi muncul (hanya yang aktif)
4. Pilih prodi → Verify data ter-filter dengan benar

### 4. Data Migration (Optional)
Jika sudah ada data mahasiswa dengan prodi berbeda format:

```sql
-- Cek mahasiswa dengan prodi yang belum ada di master
SELECT DISTINCT prodi 
FROM mahasiswa 
WHERE prodi NOT IN (SELECT nama_prodi FROM master_prodi);

-- Tambahkan prodi yang missing ke master_prodi
INSERT INTO master_prodi (kode_prodi, nama_prodi, is_active)
VALUES 
  ('CUSTOM1', 'Nama Prodi Custom 1', true),
  ('CUSTOM2', 'Nama Prodi Custom 2', true);
```

## Benefits

### 1. Data Consistency
- ✅ Semua mahasiswa punya prodi yang valid dan terstandardisasi
- ✅ Tidak ada typo atau format berbeda (e.g., "PAI" vs "Pend. Agama Islam")

### 2. Easy Management
- ✅ Admin bisa tambah/edit/hapus prodi tanpa akses database
- ✅ Prodi nonaktif tidak muncul di dropdown tapi data lama tetap aman

### 3. Reporting Accuracy
- ✅ Filter prodi di laporan bekerja dengan benar
- ✅ Grouping dan aggregasi data lebih akurat

### 4. Future-Proof
- ✅ Mudah menambah atribut baru (e.g., fakultas, jurusan)
- ✅ Referential integrity terjaga

## Troubleshooting

### Issue: "Belum ada prodi" di form mahasiswa
**Solution:**
1. Login sebagai admin
2. Buka Pengaturan Sistem → Kelola Program Studi
3. Tambahkan minimal 1 prodi

### Issue: Prodi tidak muncul di dropdown
**Solution:**
1. Check API `/api/master-prodi?active_only=true`
2. Verify `is_active = true` di database
3. Check console untuk error fetch

### Issue: Filter prodi di laporan tidak berfungsi
**Solution:**
1. Check data mahasiswa punya nilai prodi yang exact match dengan `nama_prodi` di master
2. Run data migration query jika perlu

### Issue: Error saat delete prodi
**Behavior:** Soft delete, hanya set `is_active = false`
- Prodi tetap ada di database
- Tidak muncul di dropdown form baru
- Data mahasiswa lama tetap utuh

## Related Files
```
supabase/migrations/create_master_prodi.sql       # Database migration
src/app/api/master-prodi/route.ts                 # API endpoints
src/components/PengaturanSistem.tsx               # UI admin kelola prodi
src/components/KelolaMahasiswa.tsx                # Form mahasiswa
src/components/LaporanStatistik.tsx               # Filter laporan
```

## Notes
- Soft delete digunakan untuk menjaga data history
- `kode_prodi` harus unique dan uppercase
- `nama_prodi` akan digunakan sebagai value di dropdown
- API menggunakan dynamic rendering untuk menghindari cache issues
