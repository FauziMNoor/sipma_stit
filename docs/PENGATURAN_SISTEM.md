# 🔧 Pengaturan Sistem - SIPMA

## ✅ Fitur yang Diimplementasikan

### 1. **Pengaturan Poin** 🏆
- ✅ Edit Minimum Poin Kelulusan
- ✅ Edit Target Poin Semester
- ✅ Aturan Penyesuaian (Izinkan total poin negatif)
- ✅ Semua pengaturan tersimpan di database

### 2. **Manajemen Role** 👥
- ✅ Kelola Admin
- ✅ Kelola Dosen PA
- ✅ Kelola Wakil Ketua III
- ✅ Kelola Musyrif
- ✅ Tambah pengguna baru per role
- ✅ Hapus pengguna
- ✅ Lihat status aktif/nonaktif

### 3. **Notifikasi** 🔔
- ✅ Toggle Push Notifications (ON/OFF)
- ✅ Toggle Email Alerts (ON/OFF)
- ✅ Pengaturan tersimpan real-time

### 4. **Backup & Data** 💾
- ⚠️ Backup Database (placeholder - akan diimplementasi)
- ⚠️ Restore Data (placeholder - akan diimplementasi)
- ⚠️ Export Semua Data (placeholder - akan diimplementasi)

### 5. **Informasi Aplikasi** ℹ️
- ✅ Versi Aplikasi (dari database)
- ✅ Update Terakhir (dari database)
- ✅ Kontak Support (klik untuk email)

---

## 📁 File yang Dibuat

### **1. Database Migration**
```
supabase/migrations/create_system_settings.sql
```
- Tabel `system_settings` untuk menyimpan konfigurasi
- Default settings untuk poin, notifikasi, dan general
- Trigger auto-update `updated_at`

### **2. API Routes**
```
src/app/api/settings/route.ts          - GET & PUT settings
src/app/api/users/route.ts             - GET & POST users
src/app/api/users/[id]/route.ts        - GET, PUT, DELETE user by ID
```

### **3. Components**
```
src/components/PengaturanSistem.tsx    - Main component (684 lines)
```

### **4. Pages**
```
src/app/admin/pengaturan-sistem/page.tsx
```

### **5. Updated Files**
```
src/components/DashboardAdmin.tsx      - Added link to Pengaturan Sistem
```

---

## 🗄️ Database Schema

### **Tabel: `system_settings`**

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| setting_key | TEXT | Unique key (e.g., 'min_poin_kelulusan') |
| setting_value | TEXT | Value as string |
| setting_type | TEXT | 'number', 'boolean', 'text', 'json' |
| category | TEXT | 'poin', 'notification', 'general' |
| description | TEXT | Deskripsi setting |
| created_at | TIMESTAMP | Auto-generated |
| updated_at | TIMESTAMP | Auto-updated via trigger |

### **Default Settings:**

| Key | Value | Type | Category |
|-----|-------|------|----------|
| min_poin_kelulusan | 100 | number | poin |
| target_poin_semester | 20 | number | poin |
| allow_negative_total | false | boolean | poin |
| push_notifications_enabled | true | boolean | notification |
| email_alerts_enabled | true | boolean | notification |
| reminder_days_before | 7 | number | notification |
| app_version | v2.1.4 | text | general |
| last_update_date | 2025-01-15 | text | general |
| support_contact | support@stit.ac.id | text | general |

---

## 🚀 Cara Menggunakan

### **STEP 1: Jalankan SQL Migration**

1. Buka **Supabase Dashboard**
2. Klik **SQL Editor**
3. Copy-paste SQL dari `supabase/migrations/create_system_settings.sql`
4. Klik **Run**

### **STEP 2: Akses Halaman**

1. Login sebagai **Admin**
2. Buka **Dashboard Admin**
3. Klik menu **"Pengaturan Sistem"**
4. URL: `http://localhost:3000/admin/pengaturan-sistem`

### **STEP 3: Edit Pengaturan Poin**

1. Klik **"Edit"** pada "Minimum Poin Kelulusan"
2. Ubah nilai (contoh: 100 → 150)
3. Klik **"Simpan"**
4. Pengaturan tersimpan di database

### **STEP 4: Kelola Role**

1. Klik **"Kelola"** pada role yang diinginkan (contoh: Admin)
2. Modal akan muncul dengan list pengguna
3. Klik **"Tambah Admin"** untuk menambah pengguna baru
4. Isi form: Email, Nama, Password
5. Klik **"Tambah"**
6. Pengguna baru akan muncul di list

### **STEP 5: Toggle Notifikasi**

1. Klik toggle **Push Notifications** atau **Email Alerts**
2. Pengaturan langsung tersimpan (no modal)
3. Status berubah real-time

---

## 🎨 UI/UX Features

### **Modals:**
- ✅ Edit Minimum Poin Kelulusan
- ✅ Edit Target Poin Semester
- ✅ Edit Aturan Penyesuaian
- ✅ Kelola Role (list users)
- ✅ Tambah User (nested modal dengan z-index lebih tinggi)

### **Interactive Elements:**
- ✅ Toggle switches untuk notifikasi
- ✅ Hover effects pada buttons
- ✅ Loading states
- ✅ Empty states (jika belum ada user)
- ✅ Confirmation dialogs untuk delete

### **Responsive Design:**
- ✅ Mobile-first layout
- ✅ Scrollable content
- ✅ Fixed header dengan back button

---

## 📊 API Endpoints

### **GET /api/settings**
Query params: `?category=poin` (optional)
Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "setting_key": "min_poin_kelulusan",
      "setting_value": "100",
      "setting_type": "number",
      "category": "poin",
      "description": "Minimum poin yang harus dicapai mahasiswa untuk lulus"
    }
  ]
}
```

### **PUT /api/settings**
Body:
```json
{
  "setting_key": "min_poin_kelulusan",
  "setting_value": "150"
}
```

### **GET /api/users**
Query params: `?role=admin` (optional)

### **POST /api/users**
Body:
```json
{
  "email": "admin@stit.ac.id",
  "nama": "Admin Baru",
  "role": "admin",
  "password": "password123"
}
```

### **DELETE /api/users/[id]**
No body required

---

## ✅ Checklist Testing

- [ ] SQL migration berhasil dijalankan
- [ ] Tabel `system_settings` ada di Supabase
- [ ] Halaman Pengaturan Sistem bisa diakses
- [ ] Edit Minimum Poin Kelulusan berfungsi
- [ ] Edit Target Poin Semester berfungsi
- [ ] Edit Aturan Penyesuaian berfungsi
- [ ] Toggle Push Notifications berfungsi
- [ ] Toggle Email Alerts berfungsi
- [ ] Kelola Admin berfungsi
- [ ] Tambah user baru berfungsi
- [ ] Hapus user berfungsi
- [ ] Kontak Support membuka email client

---

**Status:** ✅ Ready for Testing
**Date:** 2025-11-22

