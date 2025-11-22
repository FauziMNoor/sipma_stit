# 🎓 SIPMA - Sistem Poin Mahasiswa STIT

Sistem Poin Mahasiswa (SIPMA) adalah aplikasi web modern untuk mencatat dan mengelola aktivitas mahasiswa STIT Riyadhusssholihiin, termasuk poin positif dan negatif, dengan sistem verifikasi multi-level.

## ✨ Features

- 🔐 **Authentication** - JWT-based dengan bcrypt password hashing
- 👥 **Multi-Role System** - Mahasiswa, Dosen PA, Musyrif, Waket 3, Admin
- 📊 **Dashboard** - Statistik poin, progress kelulusan, charts
- ✅ **Verifikasi Bertingkat** - Approval workflow untuk poin aktivitas
- 🏆 **Leaderboard** - Ranking mahasiswa berdasarkan poin
- 📱 **Mobile-First** - Responsive design untuk semua device
- 🎨 **Modern UI** - Clean & elegant dengan Tailwind CSS v4

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

Buka [Supabase Dashboard](https://supabase.com/dashboard) → SQL Editor, lalu jalankan:

```sql
-- Copy paste isi file scripts/seed-users.sql
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Open Browser

Buka http://localhost:3000 dan login dengan:

**Staff:**
- **Email:** admin@stit.ac.id
- **Password:** password123

**Mahasiswa:**
- **NIM:** 2024001
- **Password:** password123

## 📝 Test Credentials

### **Staff (Login dengan Email)**
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@stit.ac.id | password123 |
| Waket 3 | waket3@stit.ac.id | password123 |
| Dosen PA | dosen.pa@stit.ac.id | password123 |
| Musyrif | musyrif@stit.ac.id | password123 |

### **Mahasiswa (Login dengan NIM)**
| Nama | NIM | Password |
|------|-----|----------|
| Ahmad Zaki | 2024001 | password123 |
| Fatimah Azzahra | 2024002 | password123 |

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** Supabase (PostgreSQL)
- **Auth:** Custom JWT + bcrypt
- **State:** Zustand
- **Validation:** Zod
- **Icons:** Lucide React
- **Charts:** Recharts

## 📁 Project Structure

```
sipma/
├── src/
│   ├── app/              # Next.js pages & API routes
│   ├── components/       # React components
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Core utilities
│   ├── store/            # State management
│   └── types/            # TypeScript types
├── scripts/              # Database seeds & utilities
└── public/               # Static assets
```

## 📊 Development Progress

Lihat [PROGRESS.md](./PROGRESS.md) untuk detail lengkap progress development.

**Current Status:** ✅ FASE 1 Complete | 🚀 Ready for FASE 2

## 🔐 Security

- JWT tokens stored in httpOnly cookies
- Password hashing dengan bcrypt (10 rounds)
- Row-level security (RLS) di Supabase
- Input validation dengan Zod
- Role-based access control

## 📖 Documentation

- [PROGRESS.md](./PROGRESS.md) - Development progress & roadmap
- [scripts/seed-users.sql](./scripts/seed-users.sql) - Database seed file

## 🤝 Contributing

Untuk development guidelines dan best practices, lihat dokumentasi di folder `docs/` (coming soon).

## 📄 License

Private project untuk STIT Riyadhusssholihiin.

---

**Developed with ❤️ for STIT Riyadhusssholihiin**
