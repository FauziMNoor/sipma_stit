# 🔍 Quick Debug - Musyrif Dashboard & Verifikasi Tidak Muncul Data

## ⚠️ PENTING: IKUTI LANGKAH INI DENGAN URUT!

### 🎯 LANGKAH 1: CEK SERVER LOGS (PALING PENTING!)

1. **Buka terminal** tempat Next.js dev server running (biasanya ada output seperti `ready - started server on http://localhost:3000`)
2. **Refresh** halaman `/musyrif/dashboard` atau `/musyrif/verifikasi`
3. **Lihat output di terminal** - akan muncul logs seperti ini:

```
🔍 [MUSYRIF VERIFIKASI] User ID: abc-123-xyz
🔍 [MUSYRIF VERIFIKASI] Status filter: all
📝 Total aktivitas fetched (all categories): 50
👥 Unique mahasiswa IDs: 20
📋 Unique kategori IDs: 15
👥 Mahasiswa details fetched: 20
👥 Mahasiswa dengan musyrif_id: 18
📋 Kategori Adab/Pelanggaran fetched: 2
📋 Kategori details: [ { nama: 'Mengikuti Kajian', kategori_utama: 'Adab' }, ... ]
🗺️ Mahasiswa map size: 20
🗺️ Kategori map size: 2
⏭️ Skipping - mahasiswa not under this musyrif: { mahasiswa: 'Ahmad', mahasiswa_musyrif_id: 'xxx-yyy', expected_musyrif_id: 'abc-123', kategori: 'Kajian' }
✅ Including: { mahasiswa: 'Budi', kategori: 'Kajian Rutin', kategori_utama: 'Adab', status: 'pending' }
📊 Processing summary:
   - Total processed: 50
   - Skipped (no kategori match): 45
   - Skipped (wrong musyrif): 3
   - Included: 2
📊 Final counts: { all: 2, pending: 2, approved: 0, rejected: 0 }
✅ Returning 2 items to frontend
```

---

### 🔴 SCENARIO A: Kategori Adab/Pelanggaran = 0

```
📋 Kategori Adab/Pelanggaran fetched: 0
```

**MASALAH**: Tidak ada kategori dengan `kategori_utama = 'Adab'` atau `'Pelanggaran'` di database!

**SOLUSI**:
1. Buka **Supabase Dashboard**
2. Pilih project → **Table Editor** → **kategori_poin**
3. Jalankan query ini:

```sql
SELECT id, kode, nama, kategori_utama 
FROM kategori_poin 
WHERE kategori_utama IN ('Adab', 'Pelanggaran');
```

**Jika kosong**, insert kategori:
```sql
-- Insert kategori Adab
INSERT INTO kategori_poin (kode, nama, kategori_utama, jenis, bobot) VALUES
('ADAB001', 'Mengikuti Kajian Rutin', 'Adab', 'positif', 10),
('ADAB002', 'Shalat Berjamaah Tepat Waktu', 'Adab', 'positif', 5);

-- Insert kategori Pelanggaran  
INSERT INTO kategori_poin (kode, nama, kategori_utama, jenis, bobot) VALUES
('PLGR001', 'Terlambat Shalat Berjamaah', 'Pelanggaran', 'negatif', -5),
('PLGR002', 'Keluar Asrama Tanpa Izin', 'Pelanggaran', 'negatif', -10);
```

---

### 🟡 SCENARIO B: Mahasiswa dengan musyrif_id = 0

```
👥 Mahasiswa details fetched: 20
👥 Mahasiswa dengan musyrif_id: 0   ← MASALAH DI SINI!
```

**MASALAH**: Tidak ada mahasiswa yang punya `musyrif_id`!

**SOLUSI**:
1. Cari ID user musyrif yang akan digunakan:

```sql
SELECT id, nama, email 
FROM users 
WHERE role = 'musyrif';
```

Copy ID musyrif (misal: `550e8400-e29b-41d4-a716-446655440000`)

2. Assign musyrif ke mahasiswa:

```sql
-- Update SEMUA mahasiswa aktif ke musyrif ini
UPDATE mahasiswa 
SET musyrif_id = '550e8400-e29b-41d4-a716-446655440000'  -- GANTI DENGAN ID MUSYRIF
WHERE is_active = true;
```

3. **Refresh halaman** musyrif, cek logs lagi

---

### 🟠 SCENARIO C: Skipped (wrong musyrif) banyak

```
⏭️ Skipping - mahasiswa not under this musyrif: { 
  mahasiswa: 'Ahmad', 
  mahasiswa_musyrif_id: 'xxx-yyy-zzz',   ← Musyrif berbeda
  expected_musyrif_id: 'abc-123-def',    ← User yang login
  kategori: 'Kajian' 
}
```

**MASALAH**: Mahasiswa yang input kegiatan bukan bimbingan musyrif yang login!

**SOLUSI**:

**Option 1**: Login dengan user musyrif yang benar
- Lihat `mahasiswa_musyrif_id` di log
- Login dengan user yang ID-nya sama dengan itu

**Option 2**: Re-assign mahasiswa ke musyrif yang login
```sql
-- Cari mahasiswa yang input kegiatan Adab
SELECT DISTINCT
  m.id,
  m.nim,
  m.nama,
  m.musyrif_id,
  u.nama as musyrif_nama
FROM poin_aktivitas pa
JOIN mahasiswa m ON pa.mahasiswa_id = m.id
LEFT JOIN users u ON m.musyrif_id = u.id
JOIN kategori_poin k ON pa.kategori_id = k.id
WHERE k.kategori_utama = 'Adab'
  AND pa.status = 'pending';

-- Update ke musyrif yang login (GANTI ID_MUSYRIF_LOGIN)
UPDATE mahasiswa 
SET musyrif_id = 'ID_MUSYRIF_LOGIN_DISINI'
WHERE id IN ('mahasiswa_id_1', 'mahasiswa_id_2');
```

---

### 🟢 SCENARIO D: Total processed = 0

```
📝 Total aktivitas fetched (all categories): 0   ← KOSONG!
```

**MASALAH**: Tidak ada kegiatan sama sekali di database!

**SOLUSI**: Mahasiswa harus input kegiatan dulu!

**Test Input Kegiatan**:
1. Login sebagai **Mahasiswa**
2. Buka halaman **Input Kegiatan** (atau `/mahasiswa/kegiatan/input`)
3. Pilih kategori **Adab** (contoh: "Mengikuti Kajian Rutin")
4. Isi form:
   - Tanggal: Hari ini
   - Keterangan: "Mengikuti kajian subuh"
   - Bukti: (opsional)
5. **Submit**

6. Cek di database:
```sql
SELECT 
  pa.id,
  pa.status,
  m.nim,
  m.nama as mahasiswa,
  m.musyrif_id,
  k.nama as kategori,
  k.kategori_utama
FROM poin_aktivitas pa
JOIN mahasiswa m ON pa.mahasiswa_id = m.id
JOIN kategori_poin k ON pa.kategori_id = k.id
WHERE k.kategori_utama = 'Adab'
ORDER BY pa.created_at DESC
LIMIT 10;
```

---

### ✅ SCENARIO E: Included = 2+ (BERHASIL!)

```
✅ Including: { mahasiswa: 'Ahmad', kategori: 'Kajian', kategori_utama: 'Adab', status: 'pending' }
✅ Including: { mahasiswa: 'Budi', kategori: 'Shalat Berjamaah', kategori_utama: 'Adab', status: 'pending' }
📊 Final counts: { all: 2, pending: 2, approved: 0, rejected: 0 }
✅ Returning 2 items to frontend
```

**SUKSES!** Data ada dan dikirim ke frontend.

**Jika masih tidak muncul di UI:**
1. Buka **Browser Console** (F12)
2. Cek apakah ada error
3. Cek response API di **Network tab**:
   - Filter: `musyrif`
   - Klik request `dashboard` atau `verifikasi`
   - Tab **Response** → lihat data

---

## 🎯 LANGKAH 2: COPY-PASTE LOGS KE SINI

Setelah refresh halaman musyrif, **copy semua logs** yang muncul di terminal, lalu kirim ke saya. Format:

```
🔍 [MUSYRIF VERIFIKASI] User ID: ...
📝 Total aktivitas fetched (all categories): ...
👥 Mahasiswa details fetched: ...
📋 Kategori Adab/Pelanggaran fetched: ...
... (semua logs)
```

Dengan logs ini, saya bisa tahu **PERSIS** di mana masalahnya!

---

## 🎯 LANGKAH 3: QUERY SQL UNTUK CEK DATA

### Cek Kategori Adab:
```sql
SELECT id, kode, nama, kategori_utama 
FROM kategori_poin 
WHERE kategori_utama IN ('Adab', 'Pelanggaran');
```
**Expected**: Minimal 1 row Adab, 1 row Pelanggaran

### Cek Mahasiswa dengan Musyrif:
```sql
SELECT 
  m.id,
  m.nim,
  m.nama,
  m.musyrif_id,
  u.nama as musyrif_nama,
  u.email as musyrif_email
FROM mahasiswa m
LEFT JOIN users u ON m.musyrif_id = u.id
WHERE m.is_active = true
ORDER BY m.nama;
```
**Expected**: Setiap mahasiswa punya `musyrif_id` yang terisi

### Cek Kegiatan Adab Pending:
```sql
SELECT 
  pa.id,
  pa.status,
  pa.created_at,
  m.nim,
  m.nama as mahasiswa,
  m.musyrif_id,
  u.nama as musyrif_nama,
  k.nama as kategori,
  k.kategori_utama
FROM poin_aktivitas pa
JOIN mahasiswa m ON pa.mahasiswa_id = m.id
LEFT JOIN users u ON m.musyrif_id = u.id
JOIN kategori_poin k ON pa.kategori_id = k.id
WHERE k.kategori_utama = 'Adab'
  AND pa.status = 'pending'
ORDER BY pa.created_at DESC;
```
**Expected**: 
- Ada data pending
- `musyrif_id` terisi
- `musyrif_nama` sesuai dengan user yang login

### Cek User Musyrif:
```sql
SELECT id, nama, email, role 
FROM users 
WHERE role = 'musyrif';
```
**Expected**: User yang digunakan login ada di list

---

## 📋 CHECKLIST TROUBLESHOOTING

- [ ] Server logs muncul saat refresh halaman
- [ ] Kategori Adab/Pelanggaran ada di database (fetched > 0)
- [ ] Mahasiswa punya musyrif_id (mahasiswa dengan musyrif_id > 0)
- [ ] Ada kegiatan pending untuk Adab (total aktivitas > 0)
- [ ] Mahasiswa yang input adalah bimbingan musyrif yang login (included > 0)
- [ ] Browser console tidak ada error merah
- [ ] Response API berisi data (cek di Network tab)

---

## 🚨 JIKA MASIH TIDAK BERHASIL

Kirim ke saya:
1. ✅ **Screenshot server logs lengkap**
2. ✅ **Hasil query SQL di atas** (screenshot atau copy-paste)
3. ✅ **Screenshot browser console** (F12 → Console)
4. ✅ **Screenshot Network tab** untuk request `/api/musyrif/verifikasi`

Dengan info ini, saya bisa identifikasi masalahnya dengan **100% akurat**! 🎯
