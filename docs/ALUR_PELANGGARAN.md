# Alur Pelanggaran di SIPMA

## Overview
Pelanggaran memiliki alur yang berbeda dengan kategori lain (Adab, Akademik, Dakwah, Sosial) karena **input dilakukan oleh Musyrif**, bukan mahasiswa.

## Alur Lengkap

### 1. **Input Pelanggaran**
- **Siapa**: Musyrif
- **Dimana**: `/musyrif/pelanggaran`
- **API**: `POST /api/musyrif/pelanggaran`
- **Data yang diinput**:
  - Mahasiswa yang melanggar
  - Kategori pelanggaran
  - Tanggal pelanggaran
  - Keterangan/deskripsi
  - Bukti (opsional)
- **Status**: `pending` (menunggu validasi Waket3)

### 2. **Monitoring oleh Musyrif**
- **Dimana**: `/musyrif/dashboard`
- Musyrif dapat melihat pelanggaran yang sudah di-input
- Tampilan pelanggaran:
  - Badge: "Menunggu Waket3" (warna orange)
  - Border: Orange (berbeda dari Adab yang border biasa)
  - Info: "Pelanggaran divalidasi oleh Waket3"
  - **TIDAK CLICKABLE** - Musyrif tidak bisa approve/reject pelanggaran

### 3. **Approval oleh Waket3**
- **Siapa**: Waket3
- **Dimana**: `/waket3/verifikasi`
- **API**: `PUT /api/waket3/verifikasi/[id]`
- Waket3 dapat:
  - Approve (status: `approved`)
  - Reject (status: `rejected`)
  - Menambahkan catatan verifikasi

### 4. **Riwayat**
- Pelanggaran yang sudah di-approve/reject dapat dilihat di:
  - `/waket3/riwayat`
  - `/musyrif/dashboard` (riwayat aktivitas)

## Perbedaan dengan Kategori Lain

| Kategori | Input oleh | Approve oleh |
|----------|------------|--------------|
| **Pelanggaran** | Musyrif | Waket3 |
| **Adab** | Mahasiswa | Musyrif |
| **Akademik** | Mahasiswa | Dosen PA |
| **Dakwah** | Mahasiswa | Waket3 |
| **Sosial** | Mahasiswa | Waket3 |

## Aturan Bisnis

1. **Musyrif TIDAK BISA approve pelanggaran**
   - Jika mencoba approve via API, akan ditolak dengan error:
     ```
     "Pelanggaran harus divalidasi oleh Wakil Ketua III. 
      Musyrif hanya bisa menginput data pelanggaran."
     ```

2. **Pelanggaran yang di-input langsung berstatus pending**
   - Tidak perlu verifikasi musyrif
   - Langsung menunggu validasi Waket3

3. **Musyrif bisa input pelanggaran untuk SEMUA mahasiswa**
   - Tidak terbatas pada mahasiswa bimbingannya saja
   - Ini berbeda dengan approval Adab yang terbatas pada mahasiswa bimbingan

## UI/UX di Dashboard Musyrif

### Pelanggaran (pending):
```
┌─────────────────────────────────────┐
│ [Menunggu Waket3]     2 jam lalu   │ <- Badge orange
│                                     │
│ 🔺 Pelanggaran                      │ <- Icon danger
│ Terlambat shalat berjamaah          │
│ Ahmad Fauzi - 12345678              │
│ 📅 25 November 2025                 │
│                                     │
│ ℹ️ Pelanggaran divalidasi oleh     │ <- Info text
│    Waket3                           │
└─────────────────────────────────────┘
Border: Orange (tidak clickable)
```

### Adab (pending):
```
┌─────────────────────────────────────┐
│ [Pending]            1 hari lalu   │ <- Badge accent
│                                     │
│ ⭐ Adab                             │ <- Icon star
│ Mengikuti kajian rutin              │
│ Ahmad Fauzi - 12345678              │
│ 📅 24 November 2025                 │
└─────────────────────────────────────┘
Border: Normal (clickable untuk approve)
```

## API Endpoints

### 1. Input Pelanggaran (Musyrif)
```typescript
POST /api/musyrif/pelanggaran
Authorization: Bearer {token}

Body:
{
  mahasiswa_id: string,
  kategori_poin_id: string,
  tanggal: string (YYYY-MM-DD),
  keterangan: string,
  bukti?: string (URL)
}

Response:
{
  success: true,
  data: { ... },
  message: "Pelanggaran berhasil dicatat dan menunggu validasi Waket3"
}
```

### 2. Approve/Reject Pelanggaran (Waket3)
```typescript
PUT /api/waket3/verifikasi/[id]
Authorization: Bearer {token}

Body:
{
  action: "approve" | "reject",
  notes?: string
}

Response:
{
  success: true,
  data: { ... },
  message: "Pengajuan berhasil disetujui/ditolak"
}
```

### 3. List Pelanggaran untuk Verifikasi (Waket3)
```typescript
GET /api/waket3/verifikasi?status=pending
Authorization: Bearer {token}

Response:
{
  success: true,
  data: [
    {
      id: string,
      kategori_utama: "Pelanggaran",
      status: "pending",
      ...
    }
  ]
}
```

## File Terkait

### Backend (API):
- `src/app/api/musyrif/pelanggaran/route.ts` - Input pelanggaran
- `src/app/api/musyrif/verifikasi/[id]/route.ts` - Logic mencegah musyrif approve pelanggaran
- `src/app/api/waket3/verifikasi/route.ts` - List pelanggaran untuk Waket3
- `src/app/api/waket3/verifikasi/detail/[id]/route.ts` - Detail & approval
- `src/app/api/musyrif/dashboard/route.ts` - Dashboard musyrif (filter Adab & Pelanggaran)

### Frontend (Components):
- `src/components/InputPelanggaranMusyrif.tsx` - Form input pelanggaran
- `src/components/DashboardMusyrif.tsx` - Dashboard dengan visual berbeda untuk pelanggaran
- `src/components/VerifikasiWaket3.tsx` - Verifikasi oleh Waket3

## Testing Checklist

- [ ] Musyrif bisa input pelanggaran untuk semua mahasiswa
- [ ] Pelanggaran langsung berstatus pending
- [ ] Musyrif bisa melihat pelanggaran di dashboard dengan visual berbeda
- [ ] Musyrif TIDAK bisa klik/approve pelanggaran
- [ ] Jika musyrif mencoba approve via API, ditolak dengan error
- [ ] Waket3 bisa melihat pelanggaran pending
- [ ] Waket3 bisa approve/reject pelanggaran
- [ ] Setelah di-approve/reject, status pelanggaran berubah
- [ ] Riwayat pelanggaran dapat dilihat

## Catatan Penting

⚠️ **PENTING**: Musyrif HANYA bisa approve kategori **Adab**. Untuk pelanggaran, musyrif hanya bisa:
1. Input pelanggaran
2. Melihat status pelanggaran
3. Monitoring pelanggaran yang sudah di-validasi Waket3

✅ **Approval pelanggaran**: Hanya Waket3 yang bisa approve/reject pelanggaran.
