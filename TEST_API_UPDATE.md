# 🧪 Test API Update Mahasiswa

## Cara Test API Langsung

### **1. Jalankan Dev Server**
```bash
npm run dev
```

### **2. Test dengan cURL atau Postman**

Ganti `[MAHASISWA_ID]` dengan ID mahasiswa yang mau diupdate (contoh: `93fa9f3c-3b48-4ff4-b793-062437d6e5f6`)

```bash
curl -X PUT http://localhost:3000/api/mahasiswa/[MAHASISWA_ID] \
  -H "Content-Type: application/json" \
  -d '{
    "nim": "2024001",
    "nama": "Ahmad Zaki ilham",
    "prodi": "Pendidikan Agama Islam",
    "angkatan": 2024,
    "password": "",
    "foto": "https://ijwfqsgednjfzugwnhtv.supabase.co/storage/v1/object/public/mahasiswa-photos/test.jpg"
  }'
```

### **3. Lihat Log di Terminal Server**

Setelah request, di terminal server akan muncul log seperti:

```
📝 PUT /api/mahasiswa/[id] - Body: { nim, nama, prodi, angkatan, password, foto }
📝 Update data: { nim, nama, prodi, angkatan, foto, is_active }
✅ Update successful: { ... }
```

**ATAU jika error:**

```
❌ Validation failed: { ... }
❌ Error hashing password: { ... }
❌ Error updating mahasiswa: { ... }
❌ Error details: { ... }
```

---

## 🔍 Debugging Steps

### **STEP 1: Cek Terminal Server**

1. Buka terminal yang menjalankan `npm run dev`
2. Scroll ke bawah untuk lihat log terbaru
3. Cari log yang dimulai dengan `📝 PUT /api/mahasiswa/[id]`
4. Screenshot semua log yang muncul setelah itu

### **STEP 2: Cek Browser DevTools**

1. Buka DevTools (F12)
2. Tab **Network**
3. Filter: XHR
4. Klik request `PUT mahasiswa/[id]` yang error (warna merah)
5. Tab **Response** - lihat error message
6. Tab **Headers** - lihat Request Payload
7. Screenshot keduanya

### **STEP 3: Cek Console Browser**

1. Tab **Console**
2. Lihat log `📝 Submitting edit:`
3. Pastikan semua field ada (nim, nama, prodi, angkatan, password, foto)
4. Screenshot

---

## ⚠️ Kemungkinan Masalah

### **1. Password Field Kosong String**
Jika password = `""` (empty string), bcrypt mungkin error.

**Fix:** Jangan kirim password jika kosong.

### **2. Angkatan Bukan Number**
Jika angkatan = `"2024"` (string), parseInt bisa gagal.

**Fix:** Sudah di-handle dengan `typeof angkatan === 'number' ? angkatan : parseInt(angkatan)`

### **3. Foto URL Terlalu Panjang**
Jika URL foto > 255 karakter, database bisa reject.

**Fix:** Kolom `foto` sudah `TEXT` (unlimited length)

### **4. Supabase Connection Error**
Jika Supabase down atau credentials salah.

**Fix:** Cek `.env.local` dan Supabase Dashboard

---

## 📝 Yang Perlu Anda Lakukan

**Tolong jalankan:**

1. `npm run dev` di terminal
2. Buka http://localhost:3000/admin/kelola-mahasiswa
3. Klik **Edit** pada mahasiswa
4. Upload foto (atau tidak)
5. Klik **Update**
6. **SCREENSHOT terminal server** (yang menjalankan npm run dev)
7. **SCREENSHOT browser console** (DevTools → Console)
8. **SCREENSHOT network tab** (DevTools → Network → Response)
9. Kirim semua screenshot ke saya

Dengan screenshot tersebut, saya bisa tahu **exact error** yang terjadi di server!

