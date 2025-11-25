# Quick Update Guide - Campus Info & No HP

## 1. Run SQL Migration

Jalankan file SQL di Supabase:
- File: `supabase/migrations/add_no_hp_and_campus_info.sql`
- Buka Supabase Dashboard > SQL Editor
- Copy-paste isi file dan Run

## 2. Update yang Sudah Dilakukan

### ✅ File SQL Migration
- `supabase/migrations/add_no_hp_and_campus_info.sql`
- `docs/DATABASE_MIGRATION_CAMPUS_INFO.md`

## 3. Update Manual yang Diperlukan

### A. Update API `/api/users/route.ts`

Tambahkan field `no_hp` di endpoint POST dan PUT:

```typescript
// Di bagian POST - tambahkan di body request
const { email, nama, nip, role, password, is_active, no_hp } = await request.json();

// Di bagian INSERT
const { data, error } = await supabaseAdmin
  .from('users')
  .insert([{
    email,
    nama,
    nip,
    no_hp,  // ← Tambahkan ini
    role,
    password: hashedPassword,
    is_active
  }])

// Di bagian PUT - sama seperti POST
```

### B. Update Component `KelolaPengguna.tsx`

**1. Tambahkan field di interface User:**
```typescript
interface User {
  id: string;
  email: string;
  nama: string;
  nip: string | null;
  no_hp: string | null;  // ← Tambahkan ini
  role: UserRole;
  foto: string | null;
  is_active: boolean;
  created_at: string;
}
```

**2. Tambahkan di formData state:**
```typescript
const [formData, setFormData] = useState({
  email: '',
  nama: '',
  nip: '',
  no_hp: '',  // ← Tambahkan ini
  role: 'dosen' as UserRole,
  password: '',
  is_active: true,
});
```

**3. Tambahkan input field di modal (Add & Edit):**
```typescript
<div>
  <label className="block text-sm font-semibold text-foreground mb-2">
    No HP/WhatsApp
  </label>
  <input
    type="tel"
    value={formData.no_hp}
    onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
    className="w-full px-4 py-3 rounded-xl bg-background border border-border"
    placeholder="+628xxxxxxxxxx"
  />
  <p className="text-xs text-muted-foreground mt-1">Format: +62...</p>
</div>
```

### C. Update Component `PengaturanSistem.tsx`

**1. Tambahkan state untuk campus settings:**
```typescript
const [campusName, setCampusName] = useState('STIT Riyadhussholihiin');
const [campusAddress, setCampusAddress] = useState('');
const [campusPhone, setCampusPhone] = useState('');
const [campusEmailAdmin, setCampusEmailAdmin] = useState('');
const [campusEmailAkademik, setCampusEmailAkademik] = useState('');
const [campusPhoneAkademik, setCampusPhoneAkademik] = useState('');
const [campusOperationalHours, setCampusOperationalHours] = useState('');
```

**2. Fetch settings di useEffect:**
```typescript
const campusNameSetting = result.data.find((s: SystemSetting) => s.setting_key === 'campus_name');
const campusAddressSetting = result.data.find((s: SystemSetting) => s.setting_key === 'campus_address');
// ... dst untuk semua campus settings

if (campusNameSetting) setCampusName(campusNameSetting.setting_value);
if (campusAddressSetting) setCampusAddress(campusAddressSetting.setting_value);
// ... dst
```

**3. Tambahkan section UI di render (setelah section Tahun Ajaran):**
```typescript
{/* Informasi Kampus */}
<div>
  <h2 className="text-lg font-bold text-foreground mb-2 font-heading">📍 Informasi Kampus</h2>
  <p className="text-sm text-muted-foreground mb-4">
    Informasi kontak kampus untuk halaman bantuan
  </p>
  <button
    onClick={() => setShowEditCampusInfoModal(true)}
    className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90"
  >
    Edit Informasi Kampus
  </button>
</div>
```

**4. Tambahkan modal EditCampusInfo (copas dari modal lain, modifikasi field):**
```typescript
{showEditCampusInfoModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      {/* Header, Form fields untuk 7 campus settings, Save button */}
    </div>
  </div>
)}
```

### D. Update Component `BantuanDosenPA.tsx`

**1. Tambahkan state dan fetch data:**
```typescript
const [campusInfo, setCampusInfo] = useState({
  name: 'STIT Riyadhussholihiin',
  address: '',
  phone: '',
  email_admin: '',
  email_akademik: '',
  phone_akademik: '',
  operational_hours: ''
});

useEffect(() => {
  fetchCampusInfo();
}, []);

const fetchCampusInfo = async () => {
  try {
    const response = await fetch('/api/settings?category=general');
    const result = await response.json();
    if (result.success) {
      const settings = result.data;
      setCampusInfo({
        name: settings.find(s => s.setting_key === 'campus_name')?.setting_value || 'STIT Riyadhussholihiin',
        address: settings.find(s => s.setting_key === 'campus_address')?.setting_value || '',
        phone: settings.find(s => s.setting_key === 'campus_phone')?.setting_value || '',
        // ... dst
      });
    }
  } catch (error) {
    console.error('Error fetching campus info:', error);
  }
};
```

**2. Ganti hardcoded values dengan `campusInfo`:**
```typescript
// Dari:
<a href="mailto:admin@stit.ac.id">admin@stit.ac.id</a>

// Menjadi:
<a href={`mailto:${campusInfo.email_admin}`}>{campusInfo.email_admin}</a>

// Dst untuk semua field
```

## 4. Testing Checklist

- [ ] SQL migration berhasil dijalankan
- [ ] Kolom no_hp muncul di tabel users
- [ ] 7 settings kampus muncul di system_settings
- [ ] Form tambah user bisa input no_hp
- [ ] Form edit user bisa edit no_hp
- [ ] Halaman Pengaturan Sistem bisa edit info kampus
- [ ] Halaman Bantuan menampilkan data dari database
- [ ] Build berhasil tanpa error

## 5. Alternatif Cepat (Jika Waktu Terbatas)

Jika ingin cepat, jalankan SQL migration dulu, lalu:
1. Update hanya di modal user (no_hp)
2. Biarkan campus info statis dulu
3. Update bertahap nanti

## 6. Contact untuk Support

Jika ada masalah, tanyakan admin untuk bantuan update manual di database.
