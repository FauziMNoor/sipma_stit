# 📊 Partisi Data: Adab vs Pelanggaran di Menu Musyrif

## 🎯 **TUJUAN PERUBAHAN**

Memisahkan **Adab** dan **Pelanggaran** agar lebih jelas, terpartisi, dan mudah tracing oleh user.

---

## ✅ **STRUKTUR BARU**

### **1. Dashboard Musyrif** (`/musyrif/dashboard`)

**Section: "Kegiatan Menunggu Verifikasi"**
- ✅ Hanya menampilkan **Adab** yang pending
- ✅ Clickable untuk approve/reject
- ❌ **TIDAK** menampilkan Pelanggaran

**Alasan:**
- Musyrif bisa approve Adab
- Musyrif TIDAK bisa approve Pelanggaran (hanya Waket3)
- Jadi tidak perlu tampil di "Menunggu Verifikasi"

---

### **2. Menu Verifikasi Adab** (`/musyrif/verifikasi`)

**Menampilkan:**
- ✅ Hanya kategori **Adab**
- ✅ Status: Pending, Approved, Rejected
- ✅ Bisa filter by status
- ✅ Bisa approve/reject

**TIDAK Menampilkan:**
- ❌ Pelanggaran (ada di halaman terpisah)

**Alasan:**
- Fokus pada Adab yang memang bisa di-approve Musyrif
- Tidak campur dengan Pelanggaran yang butuh approval Waket3

---

### **3. Menu Riwayat Pelanggaran** (BARU!) (`/musyrif/riwayat-pelanggaran`)

**Menampilkan:**
- ✅ Semua **Pelanggaran** yang sudah di-input
- ✅ Status: Pending (menunggu Waket3), Approved, Rejected
- ✅ Bisa filter by status
- ✅ **READ-ONLY** (tidak bisa approve, hanya monitoring)

**Fungsi:**
- Monitoring pelanggaran yang sudah di-input
- Tracing status approval oleh Waket3
- History pelanggaran mahasiswa

**TIDAK Ada:**
- ❌ Button Approve/Reject (karena approval by Waket3)

---

## 🔄 **ALUR LENGKAP**

### **ALUR ADAB:**
```
Mahasiswa → Input kegiatan Adab
    ↓
Muncul di Dashboard Musyrif ("Menunggu Verifikasi")
    ↓
Muncul di Menu "Verifikasi Adab"
    ↓
Musyrif → Approve/Reject
    ↓
Status berubah → Approved/Rejected
```

### **ALUR PELANGGARAN:**
```
Musyrif → Input Pelanggaran mahasiswa
    ↓
Tersimpan di database (status: pending)
    ↓
Muncul di Menu "Riwayat Pelanggaran" (Musyrif - monitoring only)
    ↓
Muncul di Menu Verifikasi Waket3
    ↓
Waket3 → Approve/Reject
    ↓
Status berubah di "Riwayat Pelanggaran" Musyrif
```

---

## 📊 **PERBANDINGAN**

| Aspek | Dashboard | Verifikasi Adab | Riwayat Pelanggaran |
|-------|-----------|-----------------|---------------------|
| **URL** | `/musyrif/dashboard` | `/musyrif/verifikasi` | `/musyrif/riwayat-pelanggaran` |
| **Kategori** | Adab only | Adab only | Pelanggaran only |
| **Status** | Pending only | All (Pending, Approved, Rejected) | All (Pending, Approved, Rejected) |
| **Action** | Klik untuk approve | Approve/Reject | View only (monitoring) |
| **Approve by** | Musyrif | Musyrif | Waket3 (not Musyrif) |

---

## 🛠️ **PERUBAHAN YANG SUDAH DILAKUKAN**

### **1. API Dashboard** (`/api/musyrif/dashboard/route.ts`)
```typescript
// BEFORE:
kategori_utama IN ('Adab', 'Pelanggaran')  // ❌ Kedua-duanya

// AFTER:
kategori_utama = 'Adab'  // ✅ Hanya Adab
// Pelanggaran pindah ke halaman terpisah
```

### **2. API Verifikasi** (`/api/musyrif/verifikasi/route.ts`)
```typescript
// BEFORE:
kategori_utama IN ('Adab', 'Pelanggaran')  // ❌ Kedua-duanya

// AFTER:
kategori_utama = 'Adab'  // ✅ Hanya Adab
// Pelanggaran pindah ke API riwayat-pelanggaran
```

### **3. API Riwayat Pelanggaran** (BARU!) (`/api/musyrif/riwayat-pelanggaran/route.ts`)
```typescript
// BARU:
kategori_utama = 'Pelanggaran'  // ✅ Hanya Pelanggaran
// Read-only, untuk monitoring saja
```

---

## 📝 **TODO: FRONTEND YANG PERLU DIBUAT**

### **1. Component: RiwayatPelanggaranMusyrif.tsx**
- List semua pelanggaran (table atau cards)
- Filter by status (All, Pending, Approved, Rejected)
- Tidak ada button Approve/Reject
- Badge status yang jelas:
  - Pending: Orange "Menunggu Waket3"
  - Approved: Green "Disetujui Waket3"
  - Rejected: Red "Ditolak Waket3"

### **2. Page: /musyrif/riwayat-pelanggaran/page.tsx**
- Import RiwayatPelanggaranMusyrif component
- Layout consistent dengan page lain

### **3. Navigation: Update Menu**
- Tambahkan menu item "Riwayat Pelanggaran"
- Icon: `solar:danger-triangle-bold`
- URL: `/musyrif/riwayat-pelanggaran`

---

## 🎨 **UI/UX DESIGN**

### **Dashboard - "Kegiatan Menunggu Verifikasi"**
```
┌─────────────────────────────────────┐
│ Kegiatan Menunggu Verifikasi        │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [Pending]        2 jam lalu    │ │
│ │ ⭐ Adab                         │ │
│ │ Mengikuti kajian rutin          │ │
│ │ Ahmad Fauzi - 12345678          │ │
│ │ 📅 25 November 2025             │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ✅ Hanya Adab                       │
│ ❌ Tidak ada Pelanggaran            │
└─────────────────────────────────────┘
```

### **Riwayat Pelanggaran - NEW PAGE**
```
┌─────────────────────────────────────┐
│ Riwayat Pelanggaran                 │
│                                     │
│ Filter: [All] [Pending] [Approved]  │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [Menunggu Waket3]   1 hari lalu│ │
│ │ 🔺 Pelanggaran                  │ │
│ │ Terlambat shalat berjamaah      │ │
│ │ Ahmad Fauzi - 12345678          │ │
│ │ 📅 24 November 2025             │ │
│ │ ℹ️ Menunggu approval Waket3     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ✅ Hanya Pelanggaran                │
│ ✅ Read-only (monitoring)           │
│ ❌ Tidak ada button Approve         │
└─────────────────────────────────────┘
```

---

## ✅ **BENEFITS**

1. **Jelas & Terpartisi**
   - Adab dan Pelanggaran tidak tercampur
   - Setiap kategori punya tempatnya

2. **User-Friendly**
   - Musyrif tidak bingung lihat Pelanggaran di "Menunggu Verifikasi"
   - Jelas mana yang bisa di-approve (Adab) dan mana yang hanya monitoring (Pelanggaran)

3. **Easy Tracing**
   - Adab: Lihat di "Verifikasi Adab"
   - Pelanggaran: Lihat di "Riwayat Pelanggaran"
   - Tidak perlu scroll/filter untuk membedakan

4. **Konsisten dengan Role**
   - Musyrif: Approve Adab, Input & Monitor Pelanggaran
   - Waket3: Approve Pelanggaran
   - Tidak ada tumpang tindih

---

## 🚀 **NEXT STEPS**

1. ✅ API sudah diperbaiki (DONE)
2. ✅ TypeScript compilation pass (DONE)
3. ⏳ Buat component `RiwayatPelanggaranMusyrif.tsx`
4. ⏳ Buat page `/musyrif/riwayat-pelanggaran/page.tsx`
5. ⏳ Update navigation menu
6. ⏳ Testing end-to-end

---

## 📋 **TESTING CHECKLIST**

### Dashboard Musyrif
- [ ] "Kegiatan Menunggu Verifikasi" hanya tampil Adab
- [ ] Tidak ada Pelanggaran di section ini
- [ ] Card Adab clickable untuk approve

### Verifikasi Adab
- [ ] Hanya menampilkan kategori Adab
- [ ] Tidak ada Pelanggaran di list
- [ ] Bisa approve/reject Adab
- [ ] Filter status bekerja

### Riwayat Pelanggaran (NEW)
- [ ] Hanya menampilkan kategori Pelanggaran
- [ ] Status pending/approved/rejected tampil
- [ ] Badge "Menunggu Waket3" untuk pending
- [ ] Tidak ada button Approve/Reject
- [ ] Read-only (monitoring only)

---

## 📚 **DOCUMENTATION**

File terkait:
- ✅ `/api/musyrif/dashboard/route.ts` - Filter Adab only
- ✅ `/api/musyrif/verifikasi/route.ts` - Filter Adab only  
- ✅ `/api/musyrif/riwayat-pelanggaran/route.ts` - NEW API for Pelanggaran
- ⏳ `RiwayatPelanggaranMusyrif.tsx` - TODO
- ⏳ `/musyrif/riwayat-pelanggaran/page.tsx` - TODO

Dokumentasi lengkap: `PARTISI_ADAB_PELANGGARAN.md`
