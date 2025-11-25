# Troubleshooting: Kategori Adab Tidak Muncul di Dashboard Musyrif

## Masalah
Inputan mahasiswa dengan kategori "Adab" tidak muncul di dashboard/menu Musyrif dan Waket3.

## Penyebab

### 1. **Query API Menggunakan Nested Filter yang Tidak Berfungsi**
```typescript
// ❌ TIDAK BEKERJA di Supabase
.in('kategori_poin.kategori_utama', ['Adab', 'Pelanggaran'])
```

Supabase tidak mendukung filter nested relation seperti ini dengan baik. Query akan mengembalikan hasil yang tidak konsisten atau kosong.

### 2. **Mahasiswa Tidak Memiliki `musyrif_id`**
Jika mahasiswa yang input kegiatan Adab **tidak memiliki `musyrif_id` yang terisi**, maka:
- Filter `mahasiswa.musyrif_id === userId` akan mengembalikan `false`
- Data tidak akan muncul di dashboard musyrif manapun

## Solusi

### ✅ **Solusi 1: Menggunakan Pola Dosen PA (Fetch & Join Manual)**

Mengikuti pola yang digunakan Dosen PA untuk kategori Akademik:

```typescript
// 1. Fetch SEMUA aktivitas dulu
const { data: aktivitas } = await supabaseAdmin
  .from('poin_aktivitas')
  .select('id, mahasiswa_id, kategori_id, ...')
  .order('created_at', { ascending: false });

// 2. Fetch mahasiswa details
const mahasiswaIds = [...new Set(aktivitas.map(a => a.mahasiswa_id))];
const { data: mahasiswaDetails } = await supabaseAdmin
  .from('mahasiswa')
  .select('id, nim, nama, foto, musyrif_id')
  .in('id', mahasiswaIds);

// 3. Fetch kategori details dengan filter
const kategoriIds = [...new Set(aktivitas.map(a => a.kategori_id))];
const { data: kategoriDetails } = await supabaseAdmin
  .from('kategori_poin')
  .select('id, nama, kategori_utama, ...')
  .in('id', kategoriIds)
  .in('kategori_utama', ['Adab', 'Pelanggaran']); // ✅ BEKERJA!

// 4. Manual JOIN menggunakan Map
const mahasiswaMap = new Map(mahasiswaDetails.map(m => [m.id, m]));
const kategoriMap = new Map(kategoriDetails.map(k => [k.id, k]));

// 5. Map dan filter
const result = aktivitas.map(item => {
  const mahasiswa = mahasiswaMap.get(item.mahasiswa_id);
  const kategori = kategoriMap.get(item.kategori_id);
  
  // Skip jika bukan kategori yang diinginkan
  if (!kategori) return null;
  
  // Skip jika bukan mahasiswa bimbingan musyrif ini
  if (mahasiswa?.musyrif_id !== userId) return null;
  
  return { ...item, mahasiswa, kategori };
}).filter(item => item !== null);
```

### ✅ **Solusi 2: Pastikan Mahasiswa Memiliki `musyrif_id`**

Setiap mahasiswa yang akan dikelola oleh Musyrif **HARUS memiliki `musyrif_id` yang terisi**.

#### Cara Cek:
```sql
SELECT id, nim, nama, musyrif_id 
FROM mahasiswa 
WHERE musyrif_id IS NULL 
AND is_active = true;
```

#### Cara Update:
```sql
-- Update mahasiswa untuk assign ke musyrif tertentu
UPDATE mahasiswa 
SET musyrif_id = 'musyrif_user_id_here'
WHERE id IN ('mahasiswa_id_1', 'mahasiswa_id_2', ...);
```

#### Via UI:
- Admin dapat assign musyrif ke mahasiswa di halaman **Kelola Mahasiswa**
- Setiap mahasiswa harus punya musyrif yang bertanggung jawab

## Perubahan yang Sudah Dilakukan

### File: `/api/musyrif/verifikasi/route.ts`

**Before (❌ Tidak Bekerja):**
```typescript
const { data } = await supabaseAdmin
  .from('poin_aktivitas')
  .select(`
    *,
    mahasiswa:mahasiswa_id (...),
    kategori_poin:kategori_id (...)
  `)
  .in('kategori_poin.kategori_utama', ['Adab', 'Pelanggaran']); // ❌ NESTED FILTER

const filteredData = data?.filter(
  item => item.mahasiswa?.musyrif_id === userId
);
```

**After (✅ Bekerja):**
```typescript
// 1. Fetch aktivitas
const { data: aktivitas } = await supabaseAdmin
  .from('poin_aktivitas')
  .select('id, mahasiswa_id, kategori_id, ...');

// 2. Fetch details terpisah
const mahasiswaDetails = await fetchMahasiswaDetails(mahasiswaIds);
const kategoriDetails = await fetchKategoriDetails(kategoriIds)
  .in('kategori_utama', ['Adab', 'Pelanggaran']); // ✅ DIRECT FILTER

// 3. Manual JOIN & Filter
const result = aktivitas.map(item => {
  const mahasiswa = mahasiswaMap.get(item.mahasiswa_id);
  const kategori = kategoriMap.get(item.kategori_id);
  
  if (!kategori) return null; // Skip non Adab/Pelanggaran
  if (mahasiswa?.musyrif_id !== userId) return null; // Skip bukan bimbingan
  
  return combineData(item, mahasiswa, kategori);
}).filter(Boolean);
```

### File: `/api/musyrif/dashboard/route.ts`

Perubahan serupa dilakukan untuk:
- Query pending activities
- Query recent activities

Sekarang menggunakan pola yang sama: fetch terpisah, lalu JOIN manual.

## Testing Checklist

- [ ] **Cek Mahasiswa memiliki musyrif_id**
  ```sql
  SELECT m.nim, m.nama, m.musyrif_id, u.nama as musyrif_nama
  FROM mahasiswa m
  LEFT JOIN users u ON m.musyrif_id = u.id
  WHERE m.is_active = true;
  ```

- [ ] **Mahasiswa Input Kegiatan Adab**
  - Login sebagai mahasiswa
  - Input kegiatan kategori Adab
  - Cek apakah tersimpan di database

- [ ] **Cek Data Muncul di API**
  ```bash
  # Test API musyrif verifikasi
  curl -H "Authorization: Bearer {token}" \
    http://localhost:3000/api/musyrif/verifikasi?status=pending
  ```

- [ ] **Musyrif Lihat di Dashboard**
  - Login sebagai musyrif yang sesuai
  - Buka `/musyrif/dashboard`
  - Cek apakah kegiatan Adab muncul di "Kegiatan Menunggu Verifikasi"

- [ ] **Musyrif Lihat di Menu Verifikasi**
  - Buka `/musyrif/verifikasi`
  - Cek apakah kegiatan Adab pending muncul

- [ ] **Musyrif Bisa Approve**
  - Klik kegiatan Adab
  - Approve atau reject
  - Cek status berubah

- [ ] **Pelanggaran Tidak Bisa Di-Approve Musyrif**
  - Musyrif input pelanggaran
  - Cek di dashboard: ada badge "Menunggu Waket3" (orange)
  - Cek tidak clickable
  - Test API: musyrif tidak bisa approve pelanggaran

## Perbedaan Alur: Adab vs Akademik

| Aspek | Akademik (Dosen PA) | Adab (Musyrif) |
|-------|---------------------|----------------|
| **Input** | Mahasiswa | Mahasiswa |
| **Kategori Utama** | "Akademik" | "Adab" |
| **Approval** | Dosen PA | Musyrif |
| **Filter Mahasiswa** | Semua mahasiswa (belum ada sistem bimbingan PA) | Hanya mahasiswa dengan `musyrif_id` sesuai |
| **API Pattern** | Fetch all → Filter by kategori | Fetch all → Filter by kategori & musyrif |

## File Terkait

### Backend:
- ✅ `src/app/api/musyrif/verifikasi/route.ts` - Fixed dengan pola Dosen PA
- ✅ `src/app/api/musyrif/dashboard/route.ts` - Fixed dengan pola Dosen PA
- ✅ `src/app/api/musyrif/verifikasi/[id]/route.ts` - Sudah benar (prevent approve pelanggaran)
- ✅ `src/app/api/dosen-pa/verifikasi/[id]/route.ts` - Reference pattern yang benar

### Frontend:
- ✅ `src/components/DashboardMusyrif.tsx` - Visual berbeda untuk Adab vs Pelanggaran
- ✅ `src/components/VerifikasiAdabAsrama.tsx` - UI verifikasi

## Catatan Penting

⚠️ **CRITICAL**: Setiap mahasiswa yang akan menginput kegiatan Adab **HARUS memiliki `musyrif_id` yang terisi**. Tanpa `musyrif_id`, kegiatan tidak akan muncul di dashboard musyrif manapun.

✅ **BEST PRACTICE**: 
1. Pastikan saat mendaftarkan mahasiswa baru, `musyrif_id` langsung di-assign
2. Admin rutin cek mahasiswa yang belum punya musyrif
3. Sistem bisa menambahkan validasi: mahasiswa tanpa musyrif tidak bisa input kegiatan Adab

## Query SQL Berguna

### Cek Mahasiswa Tanpa Musyrif:
```sql
SELECT id, nim, nama, musyrif_id 
FROM mahasiswa 
WHERE musyrif_id IS NULL 
AND is_active = true;
```

### Cek Kegiatan Adab yang Pending:
```sql
SELECT pa.id, pa.status, pa.created_at,
       m.nim, m.nama as mahasiswa_nama, m.musyrif_id,
       k.nama as kategori_nama, k.kategori_utama
FROM poin_aktivitas pa
JOIN mahasiswa m ON pa.mahasiswa_id = m.id
JOIN kategori_poin k ON pa.kategori_id = k.id
WHERE k.kategori_utama = 'Adab'
AND pa.status = 'pending'
ORDER BY pa.created_at DESC;
```

### Assign Musyrif ke Mahasiswa:
```sql
-- Assign semua mahasiswa ke musyrif tertentu
UPDATE mahasiswa 
SET musyrif_id = 'musyrif_user_id_here'
WHERE musyrif_id IS NULL 
AND is_active = true;
```
