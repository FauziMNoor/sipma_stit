# 🔄 Clear Next.js Cache & Restart - FIX MUSYRIF TIDAK MUNCUL DATA

## ⚠️ MASALAH: Next.js Cache Tidak Ter-refresh!

Next.js sering **cache API routes dan pages** sehingga perubahan kode tidak langsung terlihat.

---

## ✅ SOLUSI: IKUTI LANGKAH INI DENGAN URUT!

### **STEP 1: Stop Dev Server**
```bash
# Di terminal tempat dev server running
# Tekan: Ctrl + C
```

### **STEP 2: Delete Cache Folders**
```bash
# Windows (PowerShell/CMD):
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules/.cache

# Atau manual:
# - Hapus folder .next
# - Hapus folder node_modules/.cache (jika ada)
```

### **STEP 3: Clear npm cache (Opsional)**
```bash
npm cache clean --force
```

### **STEP 4: Restart Dev Server**
```bash
npm run dev
```

### **STEP 5: Hard Refresh Browser**
```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R

Atau:
- Buka Developer Tools (F12)
- Klik kanan tombol Refresh
- Pilih "Empty Cache and Hard Reload"
```

---

## 🎯 TESTING SETELAH RESTART

1. **Buka halaman musyrif**:
   - http://localhost:3000/musyrif/dashboard
   - http://localhost:3000/musyrif/verifikasi

2. **CEK TERMINAL** untuk logs:
   ```
   🔍 [MUSYRIF VERIFIKASI] User ID: ...
   📝 Total aktivitas fetched: ...
   👥 Mahasiswa details fetched: ...
   ... (logs lainnya)
   ```

3. **Jika MASIH tidak ada logs**:
   - File API belum ter-update
   - Coba restart sekali lagi
   - Pastikan tidak ada error di terminal

---

## 🔍 VERIFIKASI API SUDAH TER-UPDATE

### Test API Langsung dengan curl:

```bash
# Ganti {TOKEN} dengan auth token dari localStorage
# Cara ambil token: F12 → Application → Local Storage → auth-token

curl -X GET "http://localhost:3000/api/musyrif/verifikasi?status=all" \
  -H "Cookie: auth-token={TOKEN}" \
  -H "Authorization: Bearer {TOKEN}"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [...],
  "counts": {
    "all": X,
    "pending": X,
    "approved": X,
    "rejected": X
  }
}
```

---

## 🚨 JIKA MASIH TIDAK MUNCUL LOGS

### Kemungkinan Penyebab:

1. **File tidak tersimpan dengan benar**
   ```bash
   # Cek apakah file API sudah berisi console.log
   cat src/app/api/musyrif/verifikasi/route.ts | grep "console.log"
   ```
   **Expected**: Harus ada beberapa line console.log

2. **Hot reload Next.js bermasalah**
   - Stop server: `Ctrl + C`
   - Kill process: 
     ```bash
     # Windows PowerShell
     Get-Process -Name node | Stop-Process -Force
     ```
   - Start lagi: `npm run dev`

3. **Port masih dipakai process lama**
   ```bash
   # Windows PowerShell
   netstat -ano | findstr :3000
   # Catat PID, lalu kill:
   taskkill /PID {PID_NUMBER} /F
   ```

---

## ✅ SETELAH CLEAR CACHE - CEK INI:

### 1. Browser Console (F12)
- Tidak ada error merah
- Network tab → request ke `/api/musyrif/verifikasi` → Status 200

### 2. Terminal Server
- Ada logs dengan emoji (🔍, 📝, 👥, dll)
- Tidak ada error

### 3. Response API
- Network tab → klik request → tab Response
- Lihat apakah ada data di `response.data`

---

## 📋 CHECKLIST

- [ ] Dev server di-stop (Ctrl+C)
- [ ] Folder `.next` dihapus
- [ ] Folder `node_modules/.cache` dihapus (jika ada)
- [ ] Dev server di-restart (`npm run dev`)
- [ ] Browser di-hard refresh (Ctrl+Shift+R)
- [ ] Logs muncul di terminal saat buka halaman musyrif
- [ ] Browser console tidak ada error
- [ ] Network tab menunjukkan API request berhasil (200)

---

## 🎯 JIKA LOGS MUNCUL TAPI DATA MASIH KOSONG

Berarti masalahnya **BUKAN cache**, tapi **data di database**!

Lihat logs untuk identifikasi:

### Scenario A: Kategori kosong
```
📋 Kategori Adab/Pelanggaran fetched: 0
```
→ Insert kategori Adab/Pelanggaran di database

### Scenario B: Mahasiswa tidak punya musyrif_id
```
👥 Mahasiswa dengan musyrif_id: 0
```
→ Update `musyrif_id` di tabel mahasiswa

### Scenario C: Data tidak match
```
⏭️ Skipping - mahasiswa not under this musyrif: ...
```
→ Mahasiswa bukan bimbingan musyrif yang login

---

## 💡 TIPS DEVELOPMENT

Untuk menghindari cache issue di masa depan:

1. **Tambahkan script di package.json**:
```json
{
  "scripts": {
    "dev:clean": "rm -rf .next && npm run dev",
    "clean": "rm -rf .next node_modules/.cache"
  }
}
```

2. **Gunakan `dev:clean` saat perubahan besar**:
```bash
npm run dev:clean
```

3. **Disable cache saat development** (di next.config.ts):
```typescript
module.exports = {
  // ... config lain
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}
```

---

## 🚀 LANGKAH SELANJUTNYA

Setelah clear cache dan restart:

1. ✅ **Buka terminal** → lihat logs
2. ✅ **Copy logs** yang muncul
3. ✅ **Screenshot** browser console (F12)
4. ✅ **Screenshot** Network tab untuk request API
5. ✅ **Kirim semua** ke saya untuk analisa

Dengan ini kita bisa **100% tahu** apakah masalahnya cache atau data! 🎯
