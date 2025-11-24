# 📊 DOKUMENTASI KATEGORI POIN - SIPMA STIT Riyadhussholihiin

## 📋 Overview

Sistem Poin Mahasiswa (SIPMA) menggunakan 5 kategori utama untuk menilai aktivitas dan perilaku mahasiswa:

1. 🟩 **Akademik dan Intelektual** (Hijau)
2. 🟦 **Dakwah dan Keagamaan** (Biru)
3. 🟨 **Sosial dan Kepemimpinan** (Kuning/Orange)
4. 🟪 **Adab, Akhlak, dan Keteladanan** (Ungu)
5. 🟥 **Pelanggaran** (Merah) - Poin Negatif

---

## 🎯 Kategori Aktivitas dan Bobot Poin

### 🟩 A. AKADEMIK DAN INTELEKTUAL (7 Kegiatan)

| Kode | Aktivitas | Poin |
|------|-----------|------|
| AKA01 | Mengikuti kuliah 100% per semester | +10 |
| AKA02 | Menjadi asisten dosen / tutor | +15 |
| AKA03 | Mengikuti seminar, workshop, atau konferensi | +10 |
| AKA04 | Menulis artikel / jurnal ilmiah | +20 |
| AKA05 | Menjadi pemakalah atau presenter di acara ilmiah | +25 |
| AKA06 | Mengikuti lomba karya tulis (peserta) | +15 |
| AKA07 | Juara lomba karya tulis / olimpiade / debat | +30 |

**Total Poin Maksimal:** 125 poin

---

### 🟦 B. DAKWAH DAN KEAGAMAAN (8 Kegiatan)

| Kode | Aktivitas | Poin |
|------|-----------|------|
| DAU01 | Mengikuti kajian kampus / halaqah rutin | +5/kegiatan |
| DAU02 | Menjadi imam shalat | +10 |
| DAU03 | Menjadi muadzin | +10 |
| DAU04 | Menjadi khatib Jumat | +10 |
| DAU05 | Mengajar TPA / mengisi majelis taklim | +15 |
| DAU06 | Mengikuti daurah ilmiah luar kampus | +10 |
| DAU07 | Hafalan Al-Qur'an (per juz disetorkan) | +10/juz |
| DAU08 | Menginisiasi kegiatan dakwah kampus | +20 |

**Total Poin Maksimal:** 90 poin (tanpa hafalan) + 300 poin (30 juz hafalan)

---

### 🟨 C. SOSIAL DAN KEPEMIMPINAN (6 Kegiatan)

| Kode | Aktivitas | Poin |
|------|-----------|------|
| SOS01 | Menjadi pengurus DEMA/UKM | +20/tahun |
| SOS02 | Menjadi panitia kegiatan kampus | +10 |
| SOS03 | Menjadi panitia bakti sosial | +10 |
| SOS04 | Mengikuti KKN (Kuliah Kerja Nyata) | +15 |
| SOS05 | Mengikuti kegiatan khitan massal / daksos | +15 |
| SOS06 | Membantu administrasi lembaga / pelayanan mahasiswa | +10 |

**Total Poin Maksimal:** 80 poin

---

### 🟪 D. ADAB, AKHLAK, DAN KETELADANAN (5 Kegiatan)

| Kode | Aktivitas | Poin |
|------|-----------|------|
| ADB01 | Disiplin waktu shalat berjamaah | +5/bulan |
| ADB02 | Disiplin waktu kuliah | +5/bulan |
| ADB03 | Mendapat laporan akhlak baik dari musyrif | +10 |
| ADB04 | Menolong sesama mahasiswa / berinisiatif positif | +5 |
| ADB05 | Tidak pernah terlambat / melanggar aturan asrama | +10/bulan |

**Total Poin Maksimal:** 35 poin + 240 poin/tahun (dari poin bulanan)

---

### 🟥 E. PELANGGARAN - POIN NEGATIF (6 Jenis)

| Kode | Pelanggaran | Poin |
|------|-------------|------|
| PLG01 | Terlambat hadir tanpa izin | −5 |
| PLG02 | Tidak ikut kegiatan wajib | −10 |
| PLG03 | Melanggar adab berpakaian / ikhtilat | −25 |
| PLG04 | Tidak shalat berjamaah (tanpa udzur) | −10 |
| PLG05 | Melawan pengurus / dosen | −50 |
| PLG06 | Pelanggaran berat (maksiat, penipuan, dll) | −100 |

**Catatan:** Pelanggaran PLG01-PLG04 tidak perlu verifikasi (langsung masuk), PLG05-PLG06 perlu verifikasi.

---

## 📊 Akumulasi dan Evaluasi

### Threshold Kelulusan

| Kategori Poin | Keterangan | Status | Aksi |
|---------------|------------|--------|------|
| ≥ 300 poin | Sangat aktif dan teladan | 🟢 Sangat Aktif | ✅ Dapat penghargaan & sertifikat |
| 200–299 poin | Aktif dan layak lulus | 🔵 Aktif | ✅ Syarat kelulusan terpenuhi |
| 150–199 poin | Cukup aktif | 🟡 Cukup Aktif | ⚠️ Wajib pembinaan tambahan |
| < 150 poin | Pasif | 🔴 Pasif | ❌ Tidak bisa yudisium |

---

## 🗄️ Struktur Database

### Tabel: `kategori_poin`

Menyimpan master data kategori kegiatan.

**Total Data:** 32 kegiatan
- Akademik: 7 kegiatan
- Dakwah: 8 kegiatan
- Sosial: 6 kegiatan
- Adab: 5 kegiatan
- Pelanggaran: 6 kegiatan

### Tabel: `threshold_kelulusan`

Menyimpan syarat kelulusan berdasarkan total poin.

**Total Data:** 4 kategori status

---

## 🚀 Cara Menggunakan

### 1. Jalankan SQL di Supabase

```bash
# 1. Insert data kategori poin
supabase/migrations/insert_kategori_poin_data.sql

# 2. Create tabel threshold kelulusan
supabase/migrations/create_threshold_kelulusan.sql
```

### 2. Akses Halaman Kelola Kegiatan

```
http://localhost:3000/admin/kelola-kegiatan
```

### 3. Lihat Data yang Sudah Diinput

Semua 32 kegiatan akan muncul di halaman Kelola Kegiatan dengan:
- ✅ Kode kegiatan (AKA01, DAU01, SOS01, dll)
- ✅ Nama kegiatan
- ✅ Kategori (Akademik, Dakwah, Sosial, Adab, Pelanggaran)
- ✅ Jenis (Positif/Negatif)
- ✅ Bobot poin
- ✅ Color coding sesuai kategori

---

## 📈 Contoh Perhitungan Poin Mahasiswa

**Mahasiswa: Ahmad (NIM 2024001)**

### Aktivitas Positif:
- Mengikuti kuliah 100% (AKA01): +10
- Mengikuti seminar (AKA03): +10
- Kajian rutin 10x (DAU01): +50
- Hafalan 2 juz (DAU07): +20
- Panitia kegiatan (SOS02): +10
- Disiplin shalat 6 bulan (ADB01): +30

**Total Positif:** 130 poin

### Pelanggaran:
- Terlambat 2x (PLG01): -10

**Total Negatif:** -10 poin

### **TOTAL POIN:** 120 poin

**Status:** 🔴 **Pasif** (< 150 poin)
**Keterangan:** Tidak bisa yudisium sampai memenuhi poin minimal
**Aksi:** Wajib pembinaan dan tambah aktivitas

---

## 🎓 Tips Mencapai Poin Minimal (150 poin)

### Strategi 1: Fokus Akademik + Dakwah
- Kuliah 100% (AKA01): +10
- Seminar 5x (AKA03): +50
- Kajian rutin 20x (DAU01): +100
- **Total:** 160 poin ✅

### Strategi 2: Fokus Hafalan
- Hafalan 15 juz (DAU07): +150
- **Total:** 150 poin ✅

### Strategi 3: Balanced
- Kuliah 100% (AKA01): +10
- Kajian 10x (DAU01): +50
- Pengurus DEMA (SOS01): +20
- Panitia 5x (SOS02): +50
- Disiplin 6 bulan (ADB01+ADB02): +60
- **Total:** 190 poin ✅ (Cukup Aktif)

---

## 📞 Support

Jika ada pertanyaan atau perlu penyesuaian, silakan hubungi tim developer.

