# Debug Musyrif Dashboard - Step by Step

## Masalah
Data tidak muncul di dashboard Musyrif `http://localhost:3000/musyrif/dashboard`

## Perbaikan yang Sudah Dilakukan

### 1. API Dashboard Route (`/api/musyrif/dashboard/route.ts`)
✅ Mengubah dari **nested query** ke **fetch & manual JOIN** (pola Dosen PA)
✅ Menambahkan **detailed console logging** untuk debugging

### 2. API Verifikasi Route (`/api/musyrif/verifikasi/route.ts`)
✅ Sudah menggunakan pola yang benar (fetch & manual JOIN)

### 3. Dashboard Component (`DashboardMusyrif.tsx`)
✅ Visual berbeda untuk Adab (clickable) vs Pelanggaran (info only)

## Cara Debug

### LANGKAH 1: Cek Console Logs di Terminal Server

Ketika Anda buka `http://localhost:3000/musyrif/dashboard`, lihat di **terminal tempat Next.js dev server running**.

Anda akan melihat logs seperti ini:

```bash
📋 Kategori IDs for Adab & Pelanggaran: [ 'uuid-1', 'uuid-2', ... ]
📝 Total pending data fetched: 5
👥 Mahasiswa details fetched: 3
⏭️ Skipping - mahasiswa not under musyrif: Ahmad Fauzi
✅ Including pending activity: { mahasiswa: 'Budi Santoso', kategori: 'Mengikuti kajian', status: 'pending' }
✅ Filtered pending count: 2
📝 Total recent activities fetched: 10
✅ Filtered recent count: 5
```

#### Interpretasi Logs:

**Jika `Kategori IDs` kosong `[]`:**
```
📋 Kategori IDs for Adab & Pelanggaran: []
```
→ **MASALAH**: Tidak ada kategori dengan `kategori_utama = 'Adab'` atau `'Pelanggaran'` di database
→ **SOLUSI**: Cek tabel `kategori_poin` di Supabase

**Jika `Total pending data fetched: 0`:**
```
📝 Total pending data fetched: 0
```
→ **MASALAH**: Tidak ada kegiatan dengan kategori Adab/Pelanggaran yang pending
→ **SOLUSI**: Mahasiswa harus input kegiatan Adab terlebih dahulu

**Jika `Mahasiswa details fetched: 0`:**
```
👥 Mahasiswa details fetched: 0
```
→ **MASALAH**: mahasiswa_id di poin_aktivitas tidak valid atau mahasiswa tidak ditemukan
→ **SOLUSI**: Cek relasi data di Supabase

**Jika ada "Skipping" banyak:**
```
⏭️ Skipping - mahasiswa not under musyrif: Ahmad Fauzi
⏭️ Skipping - mahasiswa not under musyrif: Siti Aminah
```
→ **MASALAH**: Mahasiswa-mahasiswa ini tidak punya `musyrif_id` atau `musyrif_id` berbeda
→ **SOLUSI**: Update `musyrif_id` di tabel mahasiswa

**Jika `Filtered pending count: 0` padahal data ada:**
```
📝 Total pending data fetched: 10
✅ Filtered pending count: 0
```
→ **MASALAH**: Semua mahasiswa yang input kegiatan bukan bimbingan musyrif yang login
→ **SOLUSI**: Assign `musyrif_id` yang benar ke mahasiswa

### LANGKAH 2: Cek Browser Console

Buka **Developer Tools (F12)** di browser, tab **Console**.

**Jika ada error:**
```javascript
Error fetching dashboard data: Unauthorized
```
→ Token auth tidak valid, coba login ulang

**Jika tidak ada error tapi data kosong:**
→ Berarti API berhasil, tapi tidak ada data yang sesuai filter (lihat server logs)

### LANGKAH 3: Cek Data di Database Supabase

#### A. Cek Kategori Adab dan Pelanggaran:
```sql
SELECT id, kode, nama, kategori_utama 
FROM kategori_poin 
WHERE kategori_utama IN ('Adab', 'Pelanggaran');
```

**Expected:** Minimal 1 row untuk Adab, 1 row untuk Pelanggaran

#### B. Cek Kegiatan Pending untuk Adab:
```sql
SELECT 
  pa.id,
  pa.status,
  pa.created_at,
  m.nim,
  m.nama as mahasiswa_nama,
  m.musyrif_id,
  k.nama as kategori_nama,
  k.kategori_utama
FROM poin_aktivitas pa
JOIN mahasiswa m ON pa.mahasiswa_id = m.id
JOIN kategori_poin k ON pa.kategori_id = k.id
WHERE k.kategori_utama = 'Adab'
  AND pa.status = 'pending'
ORDER BY pa.created_at DESC;
```

**Expected:** 
- Minimal 1 row dengan status 'pending'
- Kolom `musyrif_id` harus terisi dengan ID user musyrif yang valid

#### C. Cek Mahasiswa dengan Musyrif:
```sql
SELECT 
  m.id,
  m.nim,
  m.nama,
  m.musyrif_id,
  u.nama as musyrif_nama
FROM mahasiswa m
LEFT JOIN users u ON m.musyrif_id = u.id
WHERE m.is_active = true
ORDER BY m.nama;
```

**Expected:**
- Setiap mahasiswa yang input kegiatan Adab harus punya `musyrif_id`
- `musyrif_id` harus match dengan ID user dengan role 'musyrif'

#### D. Cek User ID Musyrif yang Login:
```sql
SELECT id, nama, email, role 
FROM users 
WHERE role = 'musyrif';
```

Copy ID user musyrif yang digunakan untuk login.

#### E. Assign Musyrif ke Mahasiswa (Jika Belum):
```sql
-- Ganti 'MUSYRIF_ID_DISINI' dengan ID dari query D
UPDATE mahasiswa 
SET musyrif_id = 'MUSYRIF_ID_DISINI'
WHERE id IN (
  -- Pilih mahasiswa yang ingin di-assign
  SELECT id FROM mahasiswa 
  WHERE musyrif_id IS NULL 
  AND is_active = true
  LIMIT 10  -- atau sesuaikan
);
```

### LANGKAH 4: Test Flow Lengkap

#### Scenario 1: Input Kegiatan Adab (Mahasiswa)

1. **Login sebagai Mahasiswa** yang punya `musyrif_id`
2. Buka halaman **Input Kegiatan**
3. Pilih kategori **Adab** (contoh: "Mengikuti kajian rutin")
4. Isi form dan submit
5. **Expected**: Data tersimpan dengan status 'pending'

#### Scenario 2: Lihat di Dashboard Musyrif

1. **Login sebagai Musyrif** (user yang `musyrif_id`-nya ada di mahasiswa)
2. Buka `/musyrif/dashboard`
3. **Check server logs** untuk debug info
4. **Expected**: Muncul card di "Kegiatan Menunggu Verifikasi" dengan:
   - Badge "Pending" (biru/accent)
   - Icon ⭐ Adab
   - Nama mahasiswa, NIM
   - Deskripsi kegiatan
   - Tanggal
   - **Clickable** untuk approve

#### Scenario 3: Approve Kegiatan

1. Di dashboard musyrif, **klik** card kegiatan Adab
2. Pilih **Approve** atau **Reject**
3. **Expected**: Status berubah, tidak muncul lagi di pending

### LANGKAH 5: Test API Langsung

#### Test Dashboard API:
```bash
# Ganti {TOKEN} dengan token auth dari localStorage
curl -X GET http://localhost:3000/api/musyrif/dashboard \
  -H "Cookie: auth-token={TOKEN}" \
  -H "Authorization: Bearer {TOKEN}"
```

#### Expected Response:
```json
{
  "success": true,
  "data": {
    "musyrif": {
      "id": "...",
      "nama": "...",
      "email": "...",
      "foto": null
    },
    "summary": {
      "pendingCount": 2,
      "mahasiswaCount": 10,
      "approvedThisMonth": 5
    },
    "recentActivities": [
      {
        "id": "...",
        "tanggal": "2025-11-25",
        "status": "pending",
        "deskripsi_kegiatan": "...",
        "mahasiswa": {
          "id": "...",
          "nim": "...",
          "nama": "...",
          "foto": null
        },
        "kategori_poin": {
          "id": "...",
          "nama": "Mengikuti kajian rutin",
          "kategori_utama": "Adab",
          "jenis": "positif",
          "bobot": 10
        }
      }
    ]
  }
}
```

## Checklist Troubleshooting

- [ ] **Kategori Adab/Pelanggaran ada di database**
  ```sql
  SELECT COUNT(*) FROM kategori_poin WHERE kategori_utama IN ('Adab', 'Pelanggaran');
  ```
  → Harus >= 2

- [ ] **Mahasiswa punya musyrif_id**
  ```sql
  SELECT COUNT(*) FROM mahasiswa WHERE musyrif_id IS NOT NULL AND is_active = true;
  ```
  → Harus > 0

- [ ] **Ada kegiatan pending untuk Adab**
  ```sql
  SELECT COUNT(*) FROM poin_aktivitas pa
  JOIN kategori_poin k ON pa.kategori_id = k.id
  WHERE k.kategori_utama = 'Adab' AND pa.status = 'pending';
  ```
  → Harus > 0

- [ ] **Mahasiswa yang input adalah mahasiswa bimbingan musyrif yang login**
  ```sql
  -- Ganti MUSYRIF_USER_ID dengan ID user musyrif
  SELECT m.nama, pa.deskripsi_kegiatan, k.nama as kategori
  FROM poin_aktivitas pa
  JOIN mahasiswa m ON pa.mahasiswa_id = m.id
  JOIN kategori_poin k ON pa.kategori_id = k.id
  WHERE m.musyrif_id = 'MUSYRIF_USER_ID'
    AND k.kategori_utama = 'Adab'
    AND pa.status = 'pending';
  ```
  → Harus ada data

- [ ] **Server logs menunjukkan data diproses**
  - Kategori IDs ada
  - Pending data fetched > 0
  - Mahasiswa details fetched > 0
  - Filtered pending count > 0

- [ ] **Browser tidak ada error di console**
  - F12 → Console → tidak ada error merah

## Common Issues & Solutions

### Issue 1: "Kategori IDs: []"
**Penyebab**: Tidak ada kategori Adab/Pelanggaran di database
**Solusi**: Insert kategori atau cek ejaan `kategori_utama`

### Issue 2: "Filtered pending count: 0" padahal "Total pending data: 10"
**Penyebab**: Semua mahasiswa bukan bimbingan musyrif yang login
**Solusi**: 
```sql
-- Cek musyrif_id mahasiswa
SELECT m.nama, m.musyrif_id, u.nama as musyrif_nama
FROM poin_aktivitas pa
JOIN mahasiswa m ON pa.mahasiswa_id = m.id
LEFT JOIN users u ON m.musyrif_id = u.id
JOIN kategori_poin k ON pa.kategori_id = k.id
WHERE k.kategori_utama = 'Adab' AND pa.status = 'pending';

-- Update jika perlu
UPDATE mahasiswa SET musyrif_id = 'ID_MUSYRIF_YANG_BENAR' WHERE id = '...';
```

### Issue 3: Data muncul tapi tidak clickable
**Penyebab**: Mungkin itu Pelanggaran, bukan Adab
**Cek**: Card dengan border orange = Pelanggaran (tidak clickable, untuk Waket3)
**Expected**: Card dengan border normal = Adab (clickable)

## Kontak Support

Jika masih tidak berhasil setelah mengikuti semua langkah:
1. Screenshot server logs (terminal)
2. Screenshot browser console (F12)
3. Screenshot hasil query SQL di atas
4. Kirimkan untuk analisa lebih lanjut
