# 🔐 Sistem Login SIPMA

## Overview

SIPMA menggunakan sistem login yang **auto-detect** antara NIM (untuk mahasiswa) dan Email (untuk staff).

---

## 🎯 Cara Kerja

### **1. Input Field**
- UI hanya menampilkan **1 input field** dengan label **"NIM / Email"**
- User bisa input NIM atau Email
- Backend otomatis mendeteksi tipe input

### **2. Auto-Detection Logic**

```typescript
if (input.includes('@')) {
  // Login sebagai STAFF dengan EMAIL
  // Cari di tabel: users
  // Filter: email = input
} else {
  // Login sebagai MAHASISWA dengan NIM
  // Cari di tabel: mahasiswa (nim = input)
  // Ambil user_id, lalu query ke tabel users
}
```

---

## 👥 User Types

### **Staff (Login dengan Email)**
- **Admin** - Mengelola seluruh sistem
- **Waket 3** - Melihat semua data mahasiswa
- **Dosen PA** - Verifikasi poin mahasiswa bimbingan
- **Musyrif** - Verifikasi poin mahasiswa asrama

**Contoh Login:**
```
Email: admin@stit.ac.id
Password: password123
```

### **Mahasiswa (Login dengan NIM)**
- Input aktivitas
- Lihat poin & progress
- Upload bukti aktivitas

**Contoh Login:**
```
NIM: 2024001
Password: password123
```

---

## 🗄️ Database Structure

### **Tabel: users**
```sql
- id (uuid, primary key)
- email (text, unique)
- password (text, hashed)
- nama (text)
- role (text: admin, waket3, dosen_pa, musyrif, mahasiswa)
- is_active (boolean)
```

### **Tabel: mahasiswa**
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key -> users.id)
- nim (text, unique)
- nama (text)
- prodi (text)
- angkatan (integer)
- wali_dosen_id (uuid, foreign key -> users.id)
- musyrif_id (uuid, foreign key -> users.id)
```

---

## 🔄 Login Flow

### **Flow untuk Staff (Email)**
```
1. User input: admin@stit.ac.id
2. Backend detect: contains '@' → Email
3. Query: SELECT * FROM users WHERE email = 'admin@stit.ac.id'
4. Verify password
5. Generate JWT token
6. Set httpOnly cookie
7. Return user data
```

### **Flow untuk Mahasiswa (NIM)**
```
1. User input: 2024001
2. Backend detect: no '@' → NIM
3. Query: SELECT user_id FROM mahasiswa WHERE nim = '2024001'
4. Query: SELECT * FROM users WHERE id = user_id
5. Verify password
6. Generate JWT token
7. Set httpOnly cookie
8. Return user data
```

---

## 🛡️ Security Features

- ✅ **Password Hashing** - bcrypt dengan 10 rounds
- ✅ **JWT Token** - Signed dengan secret key
- ✅ **httpOnly Cookies** - Tidak bisa diakses JavaScript
- ✅ **Active User Check** - Hanya user dengan `is_active = true`
- ✅ **Input Validation** - Zod schema validation

---

## 📝 Test Credentials

### **Staff**
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@stit.ac.id | password123 |
| Waket 3 | waket3@stit.ac.id | password123 |
| Dosen PA | dosen.pa@stit.ac.id | password123 |
| Musyrif | musyrif@stit.ac.id | password123 |

### **Mahasiswa**
| Nama | NIM | Password |
|------|-----|----------|
| Ahmad Zaki | 2024001 | password123 |
| Fatimah Azzahra | 2024002 | password123 |

---

## 🚀 Setup

1. **Jalankan SQL seed:**
   ```bash
   # Buka Supabase SQL Editor
   # Copy paste isi file: scripts/seed-users.sql
   # Run SQL
   ```

2. **Test login:**
   - Buka http://localhost:3000
   - Input NIM: `2024001` atau Email: `admin@stit.ac.id`
   - Password: `password123`

---

## 🔧 API Endpoint

### **POST /api/auth/login**

**Request:**
```json
{
  "email": "2024001",  // NIM atau Email
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "mahasiswa1@stit.ac.id",
    "nama": "Ahmad Zaki",
    "role": "mahasiswa",
    "is_active": true
  },
  "message": "Login berhasil"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "NIM/Email atau password salah"
  }
}
```

---

**Last Updated:** 2025-11-22

