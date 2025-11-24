# 🎓 Implementasi Tahun Ajaran - SIPMA STIT Riyadhussholihiin

## ✅ SELESAI! Sistem Tahun Ajaran Sudah Diimplementasikan

---

## 📋 **Ringkasan Implementasi**

Sistem tahun ajaran telah berhasil diimplementasikan dengan arsitektur yang komprehensif:

1. ✅ **System Settings** - Tahun ajaran aktif dapat dikelola dari Pengaturan Sistem
2. ✅ **Database Migration** - Kolom tahun_ajaran_masuk ditambahkan ke tabel mahasiswa dan poin_aktivitas
3. ✅ **UI Pengaturan Sistem** - Section baru untuk manage tahun ajaran aktif
4. ✅ **Mahasiswa Management** - Form dan API support tahun ajaran masuk
5. ✅ **Auto-fill Logic** - Tahun ajaran otomatis terisi dari system settings

---

## 🗄️ **Database Changes**

### **1. Tabel: `mahasiswa`**

**Kolom Baru:**
```sql
ALTER TABLE mahasiswa 
ADD COLUMN tahun_ajaran_masuk TEXT NOT NULL DEFAULT '2024/2025';
```

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| tahun_ajaran_masuk | TEXT | Tahun ajaran saat mahasiswa pertama kali masuk | "2024/2025" |

**Index:**
```sql
CREATE INDEX idx_mahasiswa_tahun_ajaran_masuk ON mahasiswa(tahun_ajaran_masuk);
```

---

### **2. Tabel: `poin_aktivitas`**

**Kolom Baru:**
```sql
ALTER TABLE poin_aktivitas 
ADD COLUMN tahun_ajaran TEXT NOT NULL DEFAULT '2024/2025';

ALTER TABLE poin_aktivitas 
ADD COLUMN semester_type TEXT NOT NULL DEFAULT 'ganjil' 
CHECK (semester_type IN ('ganjil', 'genap'));
```

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| tahun_ajaran | TEXT | Tahun ajaran saat aktivitas dilakukan | "2024/2025" |
| semester_type | TEXT | Jenis semester: ganjil atau genap | "ganjil" |

**Indexes:**
```sql
CREATE INDEX idx_poin_aktivitas_tahun_ajaran ON poin_aktivitas(tahun_ajaran);
CREATE INDEX idx_poin_aktivitas_semester_type ON poin_aktivitas(semester_type);
CREATE INDEX idx_poin_aktivitas_tahun_semester ON poin_aktivitas(tahun_ajaran, semester_type);
```

---

### **3. Tabel: `system_settings`**

**Settings Baru:**

| setting_key | setting_value | setting_type | category | description |
|-------------|---------------|--------------|----------|-------------|
| tahun_ajaran_aktif | 2024/2025 | text | general | Tahun ajaran yang sedang aktif saat ini |
| semester_aktif | ganjil | text | general | Semester yang sedang aktif: ganjil atau genap |
| tanggal_mulai_semester | 2024-08-01 | text | general | Tanggal mulai semester aktif |
| tanggal_akhir_semester | 2025-01-31 | text | general | Tanggal akhir semester aktif |

---

## 📁 **File Changes**

### **1. Database Migrations**

#### `supabase/migrations/add_tahun_ajaran.sql` (NEW)
- Add tahun_ajaran_masuk to mahasiswa table
- Add tahun_ajaran and semester_type to poin_aktivitas table
- Add tahun ajaran settings to system_settings
- Create indexes for performance
- Create helper function: `get_tahun_ajaran(angkatan, semester)`
- Auto-update existing data based on angkatan

#### `supabase/migrations/create_system_settings.sql` (UPDATED)
- Added 4 new tahun ajaran settings to default INSERT

---

### **2. UI Components**

#### `src/components/PengaturanSistem.tsx` (UPDATED)
**Changes:**
- ✅ Added state for tahun ajaran: `tahunAjaranAktif`, `semesterAktif`, `tanggalMulai`, `tanggalAkhir`
- ✅ Added modal: `showEditTahunAjaranModal`
- ✅ Added handler: `handleSaveTahunAjaran()`
- ✅ Added UI section: "Tahun Ajaran Aktif" with gradient background
- ✅ Added modal: Edit Tahun Ajaran with form fields

**New Section UI:**
```tsx
{/* Tahun Ajaran Aktif */}
<div className="bg-linear-to-br from-primary/10 to-primary/5 rounded-2xl p-5 shadow-sm border-2 border-primary/20">
  <div className="flex items-start gap-4">
    <div className="flex items-center justify-center size-12 rounded-xl bg-primary shrink-0">
      <Icon icon="solar:calendar-bold" className="size-6 text-primary-foreground" />
    </div>
    <div className="flex-1 space-y-3">
      <h3>Tahun Ajaran Aktif</h3>
      <p>Kelola tahun ajaran dan semester yang sedang berjalan</p>
      {/* Display current values */}
      <button onClick={() => setShowEditTahunAjaranModal(true)}>Edit</button>
    </div>
  </div>
</div>
```

**Modal Features:**
- Input: Tahun Ajaran (text input, format: YYYY/YYYY)
- Toggle: Semester (Ganjil/Genap buttons)
- Date inputs: Tanggal Mulai & Tanggal Akhir
- Info box: Warning about auto-fill behavior

---

#### `src/components/KelolaMahasiswa.tsx` (UPDATED)
**Changes:**
- ✅ Added `tahun_ajaran_masuk` to Mahasiswa interface
- ✅ Added `tahun_ajaran_masuk` to formData state
- ✅ Updated `handleAdd()` - auto-fill tahun ajaran from current year
- ✅ Updated `handleEdit()` - load tahun ajaran from mahasiswa data
- ✅ Updated `submitAdd()` - send tahun_ajaran_masuk to API
- ✅ Updated `submitEdit()` - send tahun_ajaran_masuk to API
- ✅ Added form field in Add Modal
- ✅ Added form field in Edit Modal
- ✅ Added display in Detail Modal

**Form Field:**
```tsx
<div>
  <label className="block text-sm font-medium mb-2">Tahun Ajaran Masuk</label>
  <input 
    type="text" 
    value={formData.tahun_ajaran_masuk} 
    onChange={(e) => setFormData({ ...formData, tahun_ajaran_masuk: e.target.value })} 
    className="w-full px-4 py-2 rounded-xl border border-border bg-input" 
    placeholder="2024/2025" 
  />
  <p className="text-xs text-muted-foreground mt-1">Format: YYYY/YYYY (contoh: 2024/2025)</p>
</div>
```

---

### **3. API Routes**

#### `src/app/api/mahasiswa/route.ts` (UPDATED)
**POST - Create Mahasiswa:**
```typescript
const { nim, nama, prodi, angkatan, semester, password, foto, tahun_ajaran_masuk } = body;

// Auto-generate tahun_ajaran_masuk if not provided
let tahunAjaranMasuk = tahun_ajaran_masuk;
if (!tahunAjaranMasuk) {
  const { data: settingData } = await supabase
    .from('system_settings')
    .select('setting_value')
    .eq('setting_key', 'tahun_ajaran_aktif')
    .single();
  
  tahunAjaranMasuk = settingData?.setting_value || `${angkatan}/${parseInt(angkatan) + 1}`;
}

await supabase.from('mahasiswa').insert({
  nim, nama, prodi, angkatan, semester,
  tahun_ajaran_masuk: tahunAjaranMasuk,
  password: hashedPassword,
  foto: foto || null,
  is_active: true,
});
```

---

#### `src/app/api/mahasiswa/[id]/route.ts` (UPDATED)
**PUT - Update Mahasiswa:**
```typescript
const { nim, nama, prodi, angkatan, semester, password, foto, is_active, tahun_ajaran_masuk } = body;

const updateData: any = {
  nim, nama, prodi, angkatan, semester, is_active,
};

// Update tahun_ajaran_masuk if provided
if (tahun_ajaran_masuk) {
  updateData.tahun_ajaran_masuk = tahun_ajaran_masuk;
}
```

---

#### `src/app/api/mahasiswa/template/route.ts` (UPDATED)
**Excel Template:**
```typescript
const headers = [['NIM', 'Nama Lengkap', 'Program Studi', 'Angkatan', 'Semester', 'Tahun Ajaran Masuk', 'Password']];

worksheet['!cols'] = [
  { wch: 15 },  // NIM
  { wch: 25 },  // Nama Lengkap
  { wch: 30 },  // Program Studi
  { wch: 10 },  // Angkatan
  { wch: 10 },  // Semester
  { wch: 18 },  // Tahun Ajaran Masuk (NEW)
  { wch: 15 },  // Password
];
```

---

#### `src/app/api/mahasiswa/import/route.ts` (UPDATED)
**Import Logic:**
```typescript
const [nim, nama, prodi, angkatan, semester, tahun_ajaran_masuk, password] = row.map(col =>
  typeof col === 'string' ? col.trim() : String(col || '').trim()
);

// Auto-generate tahun_ajaran_masuk if not provided
let finalTahunAjaranMasuk = tahun_ajaran_masuk;
if (!finalTahunAjaranMasuk || finalTahunAjaranMasuk === '') {
  const { data: settingData } = await supabase
    .from('system_settings')
    .select('setting_value')
    .eq('setting_key', 'tahun_ajaran_aktif')
    .single();

  finalTahunAjaranMasuk = settingData?.setting_value || `${angkatan}/${parseInt(angkatan) + 1}`;
}

await supabase.from('mahasiswa').insert({
  nim, nama, prodi, angkatan, semester,
  tahun_ajaran_masuk: finalTahunAjaranMasuk,
  password: hashedPassword,
  is_active: true,
});
```

---

## 🚀 **Cara Menggunakan**

### **STEP 1: Jalankan SQL Migration**

1. Buka **Supabase Dashboard**
2. Klik **SQL Editor**
3. Copy-paste SQL dari `supabase/migrations/add_tahun_ajaran.sql`
4. Klik **Run**

**Migration ini akan:**
- ✅ Add kolom `tahun_ajaran_masuk` ke tabel `mahasiswa`
- ✅ Add kolom `tahun_ajaran` dan `semester_type` ke tabel `poin_aktivitas`
- ✅ Add 4 settings baru ke `system_settings`
- ✅ Create indexes untuk performa
- ✅ Create helper function `get_tahun_ajaran()`
- ✅ Update existing data dengan default values

---

### **STEP 2: Kelola Tahun Ajaran Aktif**

1. Login sebagai **Admin**
2. Buka **Dashboard Admin**
3. Klik **"Pengaturan Sistem"**
4. Lihat section **"Tahun Ajaran Aktif"** (dengan background gradient biru)
5. Klik **"Edit"**
6. Modal akan muncul dengan form:
   - **Tahun Ajaran**: Input text (contoh: 2024/2025)
   - **Semester**: Toggle button (Ganjil/Genap)
   - **Tanggal Mulai**: Date picker
   - **Tanggal Akhir**: Date picker
7. Klik **"Simpan"**
8. Tahun ajaran aktif berhasil diupdate!

---

### **STEP 3: Tambah Mahasiswa Baru**

1. Buka **Kelola Mahasiswa**
2. Klik **"+"** (Tambah Mahasiswa)
3. Isi form:
   - NIM: 2025001
   - Nama: Ahmad Zaki
   - Prodi: Pendidikan Agama Islam
   - Angkatan: 2025
   - Semester: 1
   - **Tahun Ajaran Masuk**: 2025/2026 (auto-filled, bisa diubah)
   - Password: password123
4. Klik **"Simpan"**
5. Mahasiswa baru tercatat dengan tahun ajaran masuk!

---

### **STEP 4: Import Mahasiswa dari Excel**

1. Download template Excel (sudah include kolom "Tahun Ajaran Masuk")
2. Isi data mahasiswa:
   - Kolom A: NIM
   - Kolom B: Nama Lengkap
   - Kolom C: Program Studi
   - Kolom D: Angkatan
   - Kolom E: Semester
   - **Kolom F: Tahun Ajaran Masuk** (opsional, jika kosong akan auto-fill)
   - Kolom G: Password
3. Save file Excel
4. Upload dan import
5. Jika kolom "Tahun Ajaran Masuk" kosong, sistem akan:
   - Ambil dari `tahun_ajaran_aktif` di system settings
   - Atau kalkulasi dari angkatan: `${angkatan}/${angkatan + 1}`

---

## 🎯 **Workflow & Logic**

### **Auto-fill Logic:**

```typescript
// Priority 1: User input (jika ada)
if (tahun_ajaran_masuk) {
  return tahun_ajaran_masuk;
}

// Priority 2: System settings (tahun ajaran aktif)
const { data } = await supabase
  .from('system_settings')
  .select('setting_value')
  .eq('setting_key', 'tahun_ajaran_aktif')
  .single();

if (data) {
  return data.setting_value; // "2024/2025"
}

// Priority 3: Calculate from angkatan
return `${angkatan}/${angkatan + 1}`; // "2024/2025"
```

---

### **Helper Function:**

```sql
-- Calculate tahun ajaran from angkatan and semester
SELECT get_tahun_ajaran(2024, 1); -- Returns '2024/2025'
SELECT get_tahun_ajaran(2024, 3); -- Returns '2025/2026'
SELECT get_tahun_ajaran(2024, 5); -- Returns '2026/2027'

-- Formula:
-- tahun_mulai = angkatan + FLOOR((semester - 1) / 2)
-- tahun_akhir = tahun_mulai + 1
```

---

## 📊 **Use Cases**

### **Use Case 1: Awal Tahun Ajaran Baru**

**Scenario:** Tahun ajaran baru 2025/2026 dimulai

**Steps:**
1. Admin buka Pengaturan Sistem
2. Klik Edit pada "Tahun Ajaran Aktif"
3. Ubah:
   - Tahun Ajaran: 2025/2026
   - Semester: Ganjil
   - Tanggal Mulai: 2025-08-01
   - Tanggal Akhir: 2026-01-31
4. Klik Simpan
5. **Semua input mahasiswa baru otomatis pakai TA 2025/2026**
6. **Semua input poin baru otomatis pakai TA 2025/2026 Ganjil**

---

### **Use Case 2: Mahasiswa Pindahan**

**Scenario:** Mahasiswa pindahan dari kampus lain, masuk semester 3

**Steps:**
1. Admin tambah mahasiswa baru
2. Isi:
   - NIM: 2023999
   - Nama: Budi Santoso
   - Angkatan: 2023
   - Semester: 3
   - **Tahun Ajaran Masuk: 2023/2024** (manual input, bukan tahun ajaran aktif)
3. Simpan
4. Mahasiswa tercatat dengan tahun ajaran masuk yang benar

---

### **Use Case 3: Leaderboard per Tahun Ajaran (Future)**

**Scenario:** Lihat ranking mahasiswa di TA 2024/2025 saja

**Query:**
```sql
SELECT m.nama, SUM(pa.poin) as total_poin
FROM mahasiswa m
JOIN poin_aktivitas pa ON m.id = pa.mahasiswa_id
WHERE pa.tahun_ajaran = '2024/2025'
GROUP BY m.id
ORDER BY total_poin DESC
LIMIT 10;
```

---

## ✅ **Testing Checklist**

- [ ] SQL migration berhasil dijalankan
- [ ] Kolom `tahun_ajaran_masuk` ada di tabel `mahasiswa`
- [ ] Kolom `tahun_ajaran` dan `semester_type` ada di tabel `poin_aktivitas`
- [ ] 4 settings baru ada di `system_settings`
- [ ] Section "Tahun Ajaran Aktif" muncul di Pengaturan Sistem
- [ ] Modal Edit Tahun Ajaran berfungsi
- [ ] Update tahun ajaran berhasil tersimpan
- [ ] Form Add Mahasiswa include field "Tahun Ajaran Masuk"
- [ ] Form Edit Mahasiswa include field "Tahun Ajaran Masuk"
- [ ] Modal Detail Mahasiswa show "Tahun Ajaran Masuk"
- [ ] Template Excel include kolom "Tahun Ajaran Masuk"
- [ ] Import Excel support tahun ajaran masuk
- [ ] Auto-fill logic berfungsi (dari settings atau angkatan)

---

## 🎉 **Summary**

### **Total Changes:**
- ✅ 2 SQL migrations (1 new, 1 updated)
- ✅ 2 UI components updated (PengaturanSistem, KelolaMahasiswa)
- ✅ 4 API routes updated (mahasiswa POST/PUT, template, import)
- ✅ 4 new system settings
- ✅ 3 new database columns
- ✅ 4 new indexes
- ✅ 1 helper SQL function

### **Benefits:**
1. ✅ **Data Integrity** - Setiap mahasiswa punya tahun ajaran masuk yang jelas
2. ✅ **Flexibility** - Admin bisa set tahun ajaran aktif kapan saja
3. ✅ **Auto-fill** - User tidak perlu input manual, sistem auto-fill
4. ✅ **Future-proof** - Siap untuk fitur leaderboard & laporan per tahun ajaran
5. ✅ **Scalability** - Poin aktivitas bisa difilter per tahun ajaran & semester

---

**Status:** ✅ Ready for Testing
**Date:** 2025-11-22
**Institution:** STIT Riyadhussholihiin
