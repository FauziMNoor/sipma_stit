'use client';

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  setting_type: 'number' | 'boolean' | 'text' | 'json';
  category: 'poin' | 'notification' | 'general';
  description: string | null;
}

interface User {
  id: string;
  email: string;
  nama: string;
  role: 'admin' | 'dosen_pa' | 'musyrif' | 'waket3';
  is_active: boolean;
  created_at: string;
}

export function PengaturanSistem() {
  const router = useRouter();
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modals
  const [showEditPoinModal, setShowEditPoinModal] = useState(false);
  const [showEditTargetModal, setShowEditTargetModal] = useState(false);
  const [showEditAturanModal, setShowEditAturanModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditTahunAjaranModal, setShowEditTahunAjaranModal] = useState(false);

  // Role management
  const [selectedRole, setSelectedRole] = useState<'admin' | 'dosen_pa' | 'musyrif' | 'waket3' | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  // Form data
  const [minPoinKelulusan, setMinPoinKelulusan] = useState('100');
  const [targetPoinSemester, setTargetPoinSemester] = useState('20');
  const [allowNegative, setAllowNegative] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);
  const [emailAlert, setEmailAlert] = useState(true);

  // Tahun Ajaran form data
  const [tahunAjaranAktif, setTahunAjaranAktif] = useState('2024/2025');
  const [semesterAktif, setSemesterAktif] = useState<'ganjil' | 'genap'>('ganjil');
  const [tanggalMulai, setTanggalMulai] = useState('2024-08-01');
  const [tanggalAkhir, setTanggalAkhir] = useState('2025-01-31');
  
  // Add user form
  const [newUser, setNewUser] = useState({
    email: '',
    nama: '',
    password: '',
  });

  // Campus info form data
  const [showEditCampusInfoModal, setShowEditCampusInfoModal] = useState(false);
  const [campusName, setCampusName] = useState('STIT Riyadhussholihiin');
  const [campusAddress, setCampusAddress] = useState('');
  const [campusOperationalHours, setCampusOperationalHours] = useState('');

  // Prodi management
  const [showProdiModal, setShowProdiModal] = useState(false);
  const [showAddProdiModal, setShowAddProdiModal] = useState(false);
  const [showEditProdiModal, setShowEditProdiModal] = useState(false);
  const [prodiList, setProdiList] = useState<any[]>([]);
  const [loadingProdi, setLoadingProdi] = useState(false);
  const [selectedProdi, setSelectedProdi] = useState<any>(null);
  const [prodiForm, setProdiForm] = useState({
    kode_prodi: '',
    nama_prodi: '',
    is_active: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings');
      const result = await response.json();
      
      if (result.success) {
        setSettings(result.data);
        
        // Set values from settings
        const minPoin = result.data.find((s: SystemSetting) => s.setting_key === 'min_poin_kelulusan');
        const targetPoin = result.data.find((s: SystemSetting) => s.setting_key === 'target_poin_semester');
        const negativeAllowed = result.data.find((s: SystemSetting) => s.setting_key === 'allow_negative_total');
        const pushEnabled = result.data.find((s: SystemSetting) => s.setting_key === 'push_notifications_enabled');
        const emailEnabled = result.data.find((s: SystemSetting) => s.setting_key === 'email_alerts_enabled');
        const tahunAjaran = result.data.find((s: SystemSetting) => s.setting_key === 'tahun_ajaran_aktif');
        const semester = result.data.find((s: SystemSetting) => s.setting_key === 'semester_aktif');
        const tglMulai = result.data.find((s: SystemSetting) => s.setting_key === 'tanggal_mulai_semester');
        const tglAkhir = result.data.find((s: SystemSetting) => s.setting_key === 'tanggal_akhir_semester');

        if (minPoin) setMinPoinKelulusan(minPoin.setting_value);
        if (targetPoin) setTargetPoinSemester(targetPoin.setting_value);
        if (negativeAllowed) setAllowNegative(negativeAllowed.setting_value === 'true');
        if (pushEnabled) setPushNotif(pushEnabled.setting_value === 'true');
        if (emailEnabled) setEmailAlert(emailEnabled.setting_value === 'true');
        if (tahunAjaran) setTahunAjaranAktif(tahunAjaran.setting_value);
        if (semester) setSemesterAktif(semester.setting_value as 'ganjil' | 'genap');
        if (tglMulai) setTanggalMulai(tglMulai.setting_value);
        if (tglAkhir) setTanggalAkhir(tglAkhir.setting_value);

        // Campus info settings
        const campusNameSetting = result.data.find((s: SystemSetting) => s.setting_key === 'campus_name');
        const campusAddressSetting = result.data.find((s: SystemSetting) => s.setting_key === 'campus_address');
        const campusOperationalHoursSetting = result.data.find((s: SystemSetting) => s.setting_key === 'campus_operational_hours');

        if (campusNameSetting) setCampusName(campusNameSetting.setting_value);
        if (campusAddressSetting) setCampusAddress(campusAddressSetting.setting_value);
        if (campusOperationalHoursSetting) setCampusOperationalHours(campusOperationalHoursSetting.setting_value);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      alert('Gagal memuat pengaturan');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setting_key: key, setting_value: value }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Pengaturan berhasil diupdate!');
        fetchSettings();
      } else {
        alert(result.error || 'Gagal mengupdate pengaturan');
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      alert('Terjadi kesalahan saat mengupdate pengaturan');
    }
  };

  const handleSaveMinPoin = async () => {
    setIsSubmitting(true);
    try {
      await updateSetting('min_poin_kelulusan', minPoinKelulusan);
      setShowEditPoinModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveTargetPoin = async () => {
    setIsSubmitting(true);
    try {
      await updateSetting('target_poin_semester', targetPoinSemester);
      setShowEditTargetModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAturan = async () => {
    setIsSubmitting(true);
    try {
      await updateSetting('allow_negative_total', String(allowNegative));
      setShowEditAturanModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveTahunAjaran = async () => {
    setIsSubmitting(true);
    try {
      // Update all tahun ajaran settings
      await updateSetting('tahun_ajaran_aktif', tahunAjaranAktif);
      await updateSetting('semester_aktif', semesterAktif);
      await updateSetting('tanggal_mulai_semester', tanggalMulai);
      await updateSetting('tanggal_akhir_semester', tanggalAkhir);

      setShowEditTahunAjaranModal(false);
      alert('Tahun ajaran berhasil diupdate!');
    } catch (error) {
      console.error('Error updating tahun ajaran:', error);
      alert('Terjadi kesalahan saat mengupdate tahun ajaran');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveCampusInfo = async () => {
    setIsSubmitting(true);
    try {
      // Update campus info settings
      await updateSetting('campus_name', campusName);
      await updateSetting('campus_address', campusAddress);
      await updateSetting('campus_operational_hours', campusOperationalHours);

      setShowEditCampusInfoModal(false);
      alert('Informasi kampus berhasil diupdate!');
    } catch (error) {
      console.error('Error updating campus info:', error);
      alert('Terjadi kesalahan saat mengupdate informasi kampus');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePushNotif = async () => {
    const newValue = !pushNotif;
    setPushNotif(newValue);
    await updateSetting('push_notifications_enabled', String(newValue));
  };

  const toggleEmailAlert = async () => {
    const newValue = !emailAlert;
    setEmailAlert(newValue);
    await updateSetting('email_alerts_enabled', String(newValue));
  };

  const fetchUsersByRole = async (role: 'admin' | 'dosen_pa' | 'musyrif' | 'waket3') => {
    try {
      setLoadingUsers(true);
      const response = await fetch(`/api/users?role=${role}`);
      const result = await response.json();

      if (result.success) {
        setUsers(result.data);
      } else {
        alert(result.error || 'Gagal memuat data pengguna');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Terjadi kesalahan saat memuat data pengguna');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleOpenRoleModal = (role: 'admin' | 'dosen_pa' | 'musyrif' | 'waket3') => {
    setSelectedRole(role);
    setShowRoleModal(true);
    fetchUsersByRole(role);
  };

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.nama || !newUser.password || !selectedRole) {
      alert('Semua field wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newUser.email,
          nama: newUser.nama,
          password: newUser.password,
          role: selectedRole,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Pengguna berhasil ditambahkan!');
        setShowAddUserModal(false);
        setNewUser({ email: '', nama: '', password: '' });
        if (selectedRole) fetchUsersByRole(selectedRole);
      } else {
        alert(result.error || 'Gagal menambahkan pengguna');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Terjadi kesalahan saat menambahkan pengguna');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        alert('Pengguna berhasil dihapus!');
        if (selectedRole) fetchUsersByRole(selectedRole);
      } else {
        alert(result.error || 'Gagal menghapus pengguna');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Terjadi kesalahan saat menghapus pengguna');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleName = (role: string) => {
    const roleNames: Record<string, string> = {
      admin: 'Admin',
      dosen_pa: 'Dosen PA',
      musyrif: 'Musyrif',
      waket3: 'Wakil Ketua III',
    };
    return roleNames[role] || role;
  };

  // Prodi management functions
  const fetchProdiList = async () => {
    try {
      setLoadingProdi(true);
      const response = await fetch('/api/master-prodi');
      const result = await response.json();

      if (result.success) {
        setProdiList(result.data);
      } else {
        alert(result.error || 'Gagal memuat data prodi');
      }
    } catch (error) {
      console.error('Error fetching prodi:', error);
      alert('Terjadi kesalahan saat memuat data prodi');
    } finally {
      setLoadingProdi(false);
    }
  };

  const handleOpenProdiModal = () => {
    setShowProdiModal(true);
    fetchProdiList();
  };

  const handleAddProdi = async () => {
    if (!prodiForm.kode_prodi || !prodiForm.nama_prodi) {
      alert('Kode prodi dan nama prodi wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/master-prodi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prodiForm),
      });

      const result = await response.json();

      if (result.success) {
        alert('Prodi berhasil ditambahkan!');
        setShowAddProdiModal(false);
        setProdiForm({ kode_prodi: '', nama_prodi: '', is_active: true });
        fetchProdiList();
      } else {
        alert(result.error || 'Gagal menambahkan prodi');
      }
    } catch (error) {
      console.error('Error adding prodi:', error);
      alert('Terjadi kesalahan saat menambahkan prodi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProdi = (prodi: any) => {
    setSelectedProdi(prodi);
    setProdiForm({
      kode_prodi: prodi.kode_prodi,
      nama_prodi: prodi.nama_prodi,
      is_active: prodi.is_active,
    });
    setShowEditProdiModal(true);
  };

  const handleUpdateProdi = async () => {
    if (!selectedProdi || !prodiForm.kode_prodi || !prodiForm.nama_prodi) {
      alert('Kode prodi dan nama prodi wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/master-prodi', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedProdi.id,
          ...prodiForm,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Prodi berhasil diupdate!');
        setShowEditProdiModal(false);
        setSelectedProdi(null);
        setProdiForm({ kode_prodi: '', nama_prodi: '', is_active: true });
        fetchProdiList();
      } else {
        alert(result.error || 'Gagal mengupdate prodi');
      }
    } catch (error) {
      console.error('Error updating prodi:', error);
      alert('Terjadi kesalahan saat mengupdate prodi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProdi = async (prodiId: string) => {
    if (!confirm('Apakah Anda yakin ingin menonaktifkan prodi ini?')) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/master-prodi?id=${prodiId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        alert('Prodi berhasil dinonaktifkan!');
        fetchProdiList();
      } else {
        alert(result.error || 'Gagal menonaktifkan prodi');
      }
    } catch (error) {
      console.error('Error deleting prodi:', error);
      alert('Terjadi kesalahan saat menonaktifkan prodi');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Icon icon="solar:loading-bold" className="size-12 text-primary animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Memuat pengaturan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-4 sm:px-6 py-5 bg-card border-b border-border">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center size-11 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer"
              type="button"
            >
              <Icon icon="solar:arrow-left-linear" className="size-6 text-primary" />
            </button>
            <h1 className="text-xl font-bold text-foreground font-heading">Pengaturan Sistem</h1>
            <div className="size-11" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Tahun Ajaran Aktif */}
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center size-12 rounded-xl bg-blue-500/10 shrink-0">
              <Icon icon="solar:calendar-bold" className="size-6 text-blue-600" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-base font-bold text-foreground font-heading">
                  Tahun Ajaran Aktif
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Kelola tahun ajaran dan semester yang sedang berjalan
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-sm text-foreground font-medium">Tahun Ajaran</span>
                    <p className="text-xs text-muted-foreground">Saat ini: {tahunAjaranAktif}</p>
                  </div>
                  <button onClick={() => setShowEditTahunAjaranModal(true)} className="px-3 py-1.5 text-sm font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                    Edit
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-sm text-foreground font-medium">Semester</span>
                    <p className="text-xs text-muted-foreground">Saat ini: {semesterAktif === 'ganjil' ? 'Ganjil' : 'Genap'}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-sm text-foreground font-medium">Periode</span>
                    <p className="text-xs text-muted-foreground">{tanggalMulai} s/d {tanggalAkhir}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Informasi Kampus */}
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center size-12 rounded-xl bg-green-500/10 shrink-0">
              <Icon icon="solar:buildings-2-bold" className="size-6 text-green-600" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-base font-bold text-foreground font-heading">
                  Informasi Kampus
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Kelola informasi umum kampus (Kontak admin diambil otomatis dari data user admin)
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-sm text-foreground font-medium">Nama Kampus</span>
                    <p className="text-xs text-muted-foreground">{campusName}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-sm text-foreground font-medium">Alamat</span>
                    <p className="text-xs text-muted-foreground">{campusAddress || 'Belum diatur'}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-sm text-foreground font-medium">Jam Operasional</span>
                    <p className="text-xs text-muted-foreground">{campusOperationalHours || 'Belum diatur'}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center pt-2">
                  <button 
                    onClick={() => setShowEditCampusInfoModal(true)} 
                    className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    Edit Informasi Kampus
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Kelola Program Studi */}
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center size-12 rounded-xl bg-purple-500/10 shrink-0">
              <Icon icon="solar:document-text-bold" className="size-6 text-purple-600" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-base font-bold text-foreground font-heading">
                  Kelola Program Studi
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Kelola master data program studi untuk mahasiswa
                </p>
              </div>
              <div className="flex items-center justify-center pt-2">
                <button
                  onClick={handleOpenProdiModal}
                  className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Kelola Program Studi
                </button>
              </div>
            </div>
          </div>
          </div>

          {/* Pengaturan Poin */}
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center size-12 rounded-xl bg-accent/10 shrink-0">
              <Icon icon="solar:medal-star-bold" className="size-6 text-accent" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-base font-bold text-foreground font-heading">
                  Pengaturan Poin
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Konfigurasi minimum poin kelulusan dan target semester
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-sm text-foreground font-medium">Minimum Poin Kelulusan</span>
                    <p className="text-xs text-muted-foreground">Saat ini: {minPoinKelulusan} poin</p>
                  </div>
                  <button onClick={() => setShowEditPoinModal(true)} className="px-3 py-1.5 text-sm font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                    Edit
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-sm text-foreground font-medium">Target Poin Semester</span>
                    <p className="text-xs text-muted-foreground">Saat ini: {targetPoinSemester} poin/semester</p>
                  </div>
                  <button onClick={() => setShowEditTargetModal(true)} className="px-3 py-1.5 text-sm font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                    Edit
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-sm text-foreground font-medium">Aturan Penyesuaian</span>
                    <p className="text-xs text-muted-foreground">Izinkan total poin negatif: {allowNegative ? 'Ya' : 'Tidak'}</p>
                  </div>
                  <button onClick={() => setShowEditAturanModal(true)} className="px-3 py-1.5 text-sm font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Manajemen Role */}
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center size-12 rounded-xl bg-secondary/10 shrink-0">
              <Icon icon="solar:user-id-bold" className="size-6 text-secondary" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-base font-bold text-foreground font-heading">Manajemen Role</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Kelola dan assign role pengguna aplikasi
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-foreground">Admin</span>
                  <button onClick={() => handleOpenRoleModal('admin')} className="px-3 py-1.5 text-sm font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                    Kelola
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-foreground">Dosen PA</span>
                  <button onClick={() => handleOpenRoleModal('dosen_pa')} className="px-3 py-1.5 text-sm font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                    Kelola
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-foreground">Wakil Ketua III</span>
                  <button onClick={() => handleOpenRoleModal('waket3')} className="px-3 py-1.5 text-sm font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                    Kelola
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-foreground">Musyrif</span>
                  <button onClick={() => handleOpenRoleModal('musyrif')} className="px-3 py-1.5 text-sm font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                    Kelola
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Notifikasi */}
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center size-12 rounded-xl bg-chart-2/10 shrink-0">
              <Icon icon="solar:bell-bold" className="size-6 text-chart-2" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-base font-bold text-foreground font-heading">Notifikasi</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Konfigurasi push notifications dan email alerts
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-foreground">Push Notifications</span>
                  <button onClick={togglePushNotif} className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${pushNotif ? 'bg-primary' : 'bg-muted'}`}>
                    <div className={`size-5 bg-white rounded-full transition-transform ${pushNotif ? 'ml-auto' : ''}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-foreground">Email Alerts</span>
                  <button onClick={toggleEmailAlert} className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${emailAlert ? 'bg-primary' : 'bg-muted'}`}>
                    <div className={`size-5 bg-white rounded-full transition-transform ${emailAlert ? 'ml-auto' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Backup & Data */}
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center size-12 rounded-xl bg-accent/20 shrink-0">
              <Icon icon="solar:database-bold" className="size-6 text-accent" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-base font-bold text-foreground font-heading">Backup & Data</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Backup dan restore database aplikasi
                </p>
              </div>
              <div className="space-y-2">
                <button onClick={() => alert('Fitur backup akan segera tersedia')} className="w-full py-3 px-4 bg-accent text-accent-foreground rounded-xl font-semibold text-sm hover:bg-accent/90 transition-colors">
                  Backup Database
                </button>
                <button onClick={() => alert('Fitur restore akan segera tersedia')} className="w-full py-3 px-4 bg-muted text-foreground rounded-xl font-semibold text-sm hover:bg-muted/80 transition-colors">
                  Restore Data
                </button>
                <button onClick={() => alert('Fitur export akan segera tersedia')} className="w-full py-3 px-4 bg-accent text-accent-foreground rounded-xl font-semibold text-sm hover:bg-accent/90 transition-colors">
                  Export Semua Data
                </button>
              </div>
            </div>
          </div>
          </div>

          {/* Informasi Aplikasi */}
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center size-12 rounded-xl bg-chart-4/10 shrink-0">
              <Icon icon="solar:info-circle-bold" className="size-6 text-chart-4" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-base font-bold text-foreground font-heading">
                  Informasi Aplikasi
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Detail versi dan kontak support
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-foreground">Versi Aplikasi</span>
                  <span className="text-sm font-semibold text-primary">
                    {settings.find(s => s.setting_key === 'app_version')?.setting_value || 'v2.1.4'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-foreground">Update Terakhir</span>
                  <span className="text-sm font-semibold text-muted-foreground">
                    {settings.find(s => s.setting_key === 'last_update_date')?.setting_value || '15 Januari 2025'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-foreground">Kontak Support</span>
                  <button onClick={() => {
                    const email = settings.find(s => s.setting_key === 'support_contact')?.setting_value || 'support@stit.ac.id';
                    window.location.href = `mailto:${email}`;
                  }} className="px-3 py-1.5 text-sm font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                    Hubungi
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Modal Edit Minimum Poin Kelulusan */}
      {showEditPoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Minimum Poin Kelulusan</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Minimum Poin</label>
                <input
                  type="number"
                  value={minPoinKelulusan}
                  onChange={(e) => setMinPoinKelulusan(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-input"
                  placeholder="100"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Mahasiswa harus mencapai minimal poin ini untuk lulus
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditPoinModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-border bg-background hover:bg-muted transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveMinPoin}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Icon icon="svg-spinners:ring-resize" className="size-5" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    'Simpan'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Target Poin Semester */}
      {showEditTargetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Target Poin Semester</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Target Poin per Semester</label>
                <input
                  type="number"
                  value={targetPoinSemester}
                  onChange={(e) => setTargetPoinSemester(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-input"
                  placeholder="20"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Target poin yang harus dicapai mahasiswa setiap semester
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditTargetModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-border bg-background hover:bg-muted transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveTargetPoin}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Icon icon="svg-spinners:ring-resize" className="size-5" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    'Simpan'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Aturan Penyesuaian */}
      {showEditAturanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Aturan Penyesuaian</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 px-4 bg-muted rounded-xl">
                <div>
                  <p className="text-sm font-medium">Izinkan Total Poin Negatif</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Jika diaktifkan, mahasiswa bisa memiliki total poin negatif
                  </p>
                </div>
                <button
                  onClick={() => setAllowNegative(!allowNegative)}
                  className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${allowNegative ? 'bg-primary' : 'bg-border'}`}
                >
                  <div className={`size-5 bg-white rounded-full transition-transform ${allowNegative ? 'ml-auto' : ''}`} />
                </button>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditAturanModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-border bg-background hover:bg-muted transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveAturan}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Icon icon="svg-spinners:ring-resize" className="size-5" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    'Simpan'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Tahun Ajaran */}
      {showEditTahunAjaranModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Tahun Ajaran Aktif</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tahun Ajaran</label>
                <input
                  type="text"
                  value={tahunAjaranAktif}
                  onChange={(e) => setTahunAjaranAktif(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-input"
                  placeholder="2024/2025"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Semester</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSemesterAktif('ganjil')}
                    className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-colors ${
                      semesterAktif === 'ganjil'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    Ganjil
                  </button>
                  <button
                    onClick={() => setSemesterAktif('genap')}
                    className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-colors ${
                      semesterAktif === 'genap'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    Genap
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Ganjil: Agustus - Januari | Genap: Februari - Juli
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={tanggalMulai}
                    onChange={(e) => setTanggalMulai(e.target.value)}
                    className="w-full px-2 py-2 text-sm rounded-xl border border-border bg-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tanggal Akhir</label>
                  <input
                    type="date"
                    value={tanggalAkhir}
                    onChange={(e) => setTanggalAkhir(e.target.value)}
                    className="w-full px-2 py-2 text-sm rounded-xl border border-border bg-input"
                  />
                </div>
              </div>

              <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 mt-4">
                <div className="flex items-start gap-3">
                  <Icon icon="solar:info-circle-bold" className="size-5 text-accent shrink-0 mt-0.5" />
                  <div className="text-xs text-foreground">
                    <p className="font-semibold mb-1">Perhatian:</p>
                    <p>Semua input poin baru akan otomatis menggunakan tahun ajaran dan semester yang aktif.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditTahunAjaranModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-border bg-background hover:bg-muted transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveTahunAjaran}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Icon icon="svg-spinners:ring-resize" className="size-5" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    'Simpan'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Kelola Role */}
      {showRoleModal && selectedRole && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Kelola {getRoleName(selectedRole)}</h2>
              <button
                onClick={() => setShowRoleModal(false)}
                className="flex items-center justify-center size-9 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <Icon icon="solar:close-circle-bold" className="size-5 text-foreground" />
              </button>
            </div>

            <div className="mb-4">
              <button
                onClick={() => setShowAddUserModal(true)}
                className="w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Icon icon="solar:add-circle-bold" className="size-5" />
                Tambah {getRoleName(selectedRole)}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {loadingUsers ? (
                <div className="text-center py-8">
                  <Icon icon="solar:loading-bold" className="size-8 text-primary animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Memuat data...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8">
                  <Icon icon="solar:user-cross-bold" className="size-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Belum ada pengguna dengan role ini</p>
                </div>
              ) : (
                users.map((user) => (
                  <div key={user.id} className="bg-muted rounded-xl p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{user.nama}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${user.is_active ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'}`}>
                          {user.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={isSubmitting}
                      className="flex items-center justify-center size-9 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <Icon icon="svg-spinners:ring-resize" className="size-5 text-red-600" />
                      ) : (
                        <Icon icon="solar:trash-bin-trash-bold" className="size-5 text-red-600" />
                      )}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah User */}
      {showAddUserModal && selectedRole && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Tambah {getRoleName(selectedRole)}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-input"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={newUser.nama}
                  onChange={(e) => setNewUser({ ...newUser, nama: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-input"
                  placeholder="Nama lengkap"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-input"
                  placeholder="Password"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddUserModal(false);
                    setNewUser({ email: '', nama: '', password: '' });
                  }}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-border bg-background hover:bg-muted transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
                <button
                  onClick={handleAddUser}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Icon icon="svg-spinners:ring-resize" className="size-5" />
                      <span>Menambahkan...</span>
                    </>
                  ) : (
                    'Tambah'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Campus Info */}
      {showEditCampusInfoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Informasi Kampus</h2>
            <p className="text-sm text-muted-foreground mb-4">
              <Icon icon="solar:info-circle-bold" className="inline size-4 mr-1" />
              Kontak admin dikelola di menu Kelola Pengguna
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nama Kampus</label>
                <input
                  type="text"
                  value={campusName}
                  onChange={(e) => setCampusName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-input"
                  placeholder="STIT Riyadhussholihiin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Alamat Lengkap</label>
                <textarea
                  value={campusAddress}
                  onChange={(e) => setCampusAddress(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-input"
                  rows={3}
                  placeholder="Jl. Pendidikan No. 123, Kota, Provinsi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Jam Operasional</label>
                <input
                  type="text"
                  value={campusOperationalHours}
                  onChange={(e) => setCampusOperationalHours(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-input"
                  placeholder="Senin - Jumat: 08.00 - 16.00 WIB"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowEditCampusInfoModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl bg-muted text-foreground font-semibold"
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveCampusInfo}
                  className="flex-1 px-4 py-2 rounded-xl bg-primary text-white font-semibold disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Kelola Prodi */}
      {showProdiModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Kelola Program Studi</h2>
              <button
                onClick={() => setShowProdiModal(false)}
                className="flex items-center justify-center size-9 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <Icon icon="solar:close-circle-bold" className="size-5 text-foreground" />
              </button>
            </div>

            <div className="mb-4">
              <button
                onClick={() => setShowAddProdiModal(true)}
                className="w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Icon icon="solar:add-circle-bold" className="size-5" />
                Tambah Program Studi
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {loadingProdi ? (
                <div className="text-center py-8">
                  <Icon icon="solar:loading-bold" className="size-8 text-primary animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Memuat data...</p>
                </div>
              ) : prodiList.length === 0 ? (
                <div className="text-center py-8">
                  <Icon icon="solar:document-text-bold" className="size-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Belum ada program studi</p>
                </div>
              ) : (
                prodiList.map((prodi) => (
                  <div key={prodi.id} className="bg-muted rounded-xl p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{prodi.nama_prodi}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${prodi.is_active ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'}`}>
                          {prodi.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">Kode: {prodi.kode_prodi}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProdi(prodi)}
                        className="flex items-center justify-center size-9 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                      >
                        <Icon icon="solar:pen-bold" className="size-5 text-primary" />
                      </button>
                      <button
                        onClick={() => handleDeleteProdi(prodi.id)}
                        disabled={isSubmitting || !prodi.is_active}
                        className="flex items-center justify-center size-9 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Icon icon="solar:trash-bin-trash-bold" className="size-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Prodi */}
      {showAddProdiModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Tambah Program Studi</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Kode Prodi</label>
                <input
                  type="text"
                  value={prodiForm.kode_prodi}
                  onChange={(e) => setProdiForm({ ...prodiForm, kode_prodi: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-input"
                  placeholder="PAI, ES, HKI"
                  maxLength={10}
                />
                <p className="text-xs text-muted-foreground mt-1">Gunakan singkatan, maks 10 karakter</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nama Program Studi</label>
                <input
                  type="text"
                  value={prodiForm.nama_prodi}
                  onChange={(e) => setProdiForm({ ...prodiForm, nama_prodi: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-input"
                  placeholder="Pendidikan Agama Islam"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddProdiModal(false);
                    setProdiForm({ kode_prodi: '', nama_prodi: '', is_active: true });
                  }}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-border bg-background hover:bg-muted transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
                <button
                  onClick={handleAddProdi}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Icon icon="svg-spinners:ring-resize" className="size-5" />
                      <span>Menambahkan...</span>
                    </>
                  ) : (
                    'Tambah'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Prodi */}
      {showEditProdiModal && selectedProdi && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Program Studi</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Kode Prodi</label>
                <input
                  type="text"
                  value={prodiForm.kode_prodi}
                  onChange={(e) => setProdiForm({ ...prodiForm, kode_prodi: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-input"
                  placeholder="PAI, ES, HKI"
                  maxLength={10}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nama Program Studi</label>
                <input
                  type="text"
                  value={prodiForm.nama_prodi}
                  onChange={(e) => setProdiForm({ ...prodiForm, nama_prodi: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-input"
                  placeholder="Pendidikan Agama Islam"
                />
              </div>
              <div className="flex items-center justify-between py-3 px-4 bg-muted rounded-xl">
                <div>
                  <p className="text-sm font-medium">Status Aktif</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Prodi nonaktif tidak akan muncul di form
                  </p>
                </div>
                <button
                  onClick={() => setProdiForm({ ...prodiForm, is_active: !prodiForm.is_active })}
                  className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${prodiForm.is_active ? 'bg-primary' : 'bg-border'}`}
                >
                  <div className={`size-5 bg-white rounded-full transition-transform ${prodiForm.is_active ? 'ml-auto' : ''}`} />
                </button>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditProdiModal(false);
                    setSelectedProdi(null);
                    setProdiForm({ kode_prodi: '', nama_prodi: '', is_active: true });
                  }}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-border bg-background hover:bg-muted transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
                <button
                  onClick={handleUpdateProdi}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Icon icon="svg-spinners:ring-resize" className="size-5" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    'Simpan'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

