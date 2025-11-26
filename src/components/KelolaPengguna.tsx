'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type UserRole = 'mahasiswa' | 'dosen' | 'dosen_pa' | 'musyrif' | 'waket3' | 'admin' | 'staff';

interface User {
  id: string;
  email: string;
  nama: string;
  nip: string | null;
  no_hp: string | null;
  role: UserRole;
  foto: string | null;
  is_active: boolean;
  created_at: string;
}

interface Counts {
  all: number;
  admin: number;
  dosen: number; // includes dosen, dosen_pa, waket3
  musyrif: number;
}

export default function KelolaPengguna() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [counts, setCounts] = useState<Counts>({
    all: 0,
    admin: 0,
    dosen: 0,
    musyrif: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    email: '',
    nama: '',
    nip: '',
    no_hp: '',
    role: 'dosen' as UserRole,
    password: '',
    is_active: true,
  });

  // Photo upload
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, searchQuery]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('role', roleFilter);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/users?${params.toString()}`, {
        credentials: 'include',
      });
      const result = await response.json();

      if (result.success) {
        setUsers(result.data);
        setCounts(result.counts);
      } else {
        console.error('Error fetching users:', result.error);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message || 'Pengguna berhasil ditambahkan!');
        setShowAddModal(false);
        resetForm();
        fetchUsers();
      } else {
        alert('Gagal menambahkan pengguna: ' + result.error);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Terjadi kesalahan saat menambahkan pengguna');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!selectedPhoto) return null;

    setIsUploadingPhoto(true);
    try {
      const fileExt = selectedPhoto.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `users/${fileName}`;

      const { data, error } = await supabase.storage
        .from('photos')
        .upload(filePath, selectedPhoto);

      if (error) {
        console.error('Error uploading photo:', error);
        alert('Gagal mengupload foto: ' + error.message);
        return null;
      }

      const { data: publicUrlData } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Terjadi kesalahan saat mengupload foto');
      return null;
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setIsSubmitting(true);

    try {
      // Upload photo if selected
      let photoUrl = selectedUser.foto;
      if (selectedPhoto) {
        const uploadedUrl = await uploadPhoto();
        if (uploadedUrl) {
          photoUrl = uploadedUrl;
        } else {
          setIsSubmitting(false);
          return; // Stop if photo upload failed
        }
      }

      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: selectedUser.id,
          email: formData.email,
          nama: formData.nama,
          nip: formData.nip,
          no_hp: formData.no_hp,
          role: formData.role,
          foto: photoUrl,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message || 'Data pengguna berhasil diupdate!');
        setShowEditModal(false);
        setSelectedUser(null);
        resetForm();
        fetchUsers();
      } else {
        alert('Gagal mengupdate pengguna: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Terjadi kesalahan saat mengupdate pengguna');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    if (!confirm(`Yakin ingin mengubah status pengguna ${user.nama} menjadi ${user.is_active ? 'nonaktif' : 'aktif'}?`)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: user.id,
          action: 'toggle_status',
          is_active: !user.is_active,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        fetchUsers();
      } else {
        alert('Gagal mengubah status: ' + result.error);
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Terjadi kesalahan saat mengubah status');
    } finally {
      setIsSubmitting(false);
      setShowActionMenu(null);
    }
  };

  const handleResetPassword = async (user: User) => {
    const newPassword = prompt(`Masukkan password baru untuk ${user.nama} (minimal 8 karakter):`);

    if (!newPassword) return;

    if (newPassword.length < 8) {
      alert('Password minimal 8 karakter');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: user.id,
          action: 'reset_password',
          new_password: newPassword,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
      } else {
        alert('Gagal reset password: ' + result.error);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Terjadi kesalahan saat reset password');
    } finally {
      setIsSubmitting(false);
      setShowActionMenu(null);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Yakin ingin menghapus pengguna ${user.nama}? Tindakan ini tidak dapat dibatalkan!`)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/users?id=${user.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        fetchUsers();
      } else {
        alert('Gagal menghapus pengguna: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Terjadi kesalahan saat menghapus pengguna');
    } finally {
      setIsSubmitting(false);
      setShowActionMenu(null);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      nama: '',
      nip: '',
      no_hp: '',
      role: 'dosen',
      password: '',
      is_active: true,
    });
    setSelectedPhoto(null);
    setPhotoPreview(null);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      nama: user.nama,
      nip: user.nip || '',
      no_hp: user.no_hp || '',
      role: user.role,
      password: '',
      is_active: user.is_active,
    });
    setPhotoPreview(user.foto);
    setSelectedPhoto(null);
    setShowEditModal(true);
    setShowActionMenu(null);
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-destructive/10 text-destructive';
      case 'dosen':
      case 'dosen_pa':
      case 'waket3':
        return 'bg-blue-500/10 text-blue-600';
      case 'musyrif':
        return 'bg-green-600/10 text-green-700';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'dosen':
        return 'Dosen';
      case 'dosen_pa':
        return 'Dosen PA';
      case 'musyrif':
        return 'Musyrif';
      case 'waket3':
        return 'Wakil Ketua III';
      case 'staff':
        return 'Staff';
      case 'mahasiswa':
        return 'Mahasiswa';
      default:
        return role;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="px-6 py-5 bg-primary">
          <div className="flex items-center justify-between mb-1">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center size-11"
              type="button"
            >
              <Icon icon="solar:arrow-left-linear" className="size-6 text-white" />
            </button>
            <h1 className="text-lg font-bold text-white font-heading">Kelola Pengguna</h1>
            <div className="size-11"></div>
          </div>
        </div>
        {/* Content Skeleton */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Search Bar Skeleton */}
            <div className="h-12 bg-muted rounded-xl animate-pulse" />

            {/* Filter Tabs Skeleton */}
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-9 bg-muted rounded-full w-20 animate-pulse" />
              ))}
            </div>

            {/* User List Skeleton */}
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-card rounded-2xl p-4 shadow-sm border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="size-12 rounded-full bg-muted animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-32 animate-pulse" />
                        <div className="h-3 bg-muted rounded w-24 animate-pulse" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="size-9 rounded-lg bg-muted animate-pulse" />
                      <div className="size-9 rounded-lg bg-muted animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Button Skeleton */}
        <div className="px-6 pb-6">
          <div className="max-w-3xl mx-auto">
            <div className="h-14 bg-muted rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-4 sm:px-6 py-5 bg-primary">
        <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center size-11"
            type="button"
          >
            <Icon icon="solar:arrow-left-linear" className="size-6 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white font-heading">Kelola Pengguna</h1>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center justify-center size-11"
            type="button"
          >
            <Icon icon="solar:add-circle-bold" className="size-6 text-white" />
          </button>
        </div>
        <p className="text-sm text-white/80 text-center">
          Kelola akun pengguna sistem
        </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-card border-b border-border px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto">
        <div className="relative">
          <Icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="bg-card border-b border-border px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto">
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap shadow-sm transition-colors ${
              roleFilter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Semua
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              roleFilter === 'all' ? 'bg-white/20' : 'bg-primary/10 text-primary'
            }`}>
              {counts.all}
            </span>
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-colors ${
              roleFilter === 'admin'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Admin
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              roleFilter === 'admin' ? 'bg-white/20' : 'bg-destructive/10 text-destructive'
            }`}>
              {counts.admin}
            </span>
          </button>
          <button
            onClick={() => setRoleFilter('dosen')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-colors ${
              roleFilter === 'dosen'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Dosen
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              roleFilter === 'dosen' ? 'bg-white/20' : 'bg-blue-500/10 text-blue-600'
            }`}>
              {counts.dosen}
            </span>
          </button>
          <button
            onClick={() => setRoleFilter('musyrif')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-colors ${
              roleFilter === 'musyrif'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Musyrif
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              roleFilter === 'musyrif' ? 'bg-white/20' : 'bg-green-600/10 text-green-700'
            }`}>
              {counts.musyrif}
            </span>
          </button>
        </div>
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
        <div className="max-w-3xl mx-auto space-y-4">
        {users.length === 0 ? (
          <div className="text-center py-12">
            <Icon icon="solar:user-cross-rounded-bold" className="size-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Tidak ada pengguna</p>
          </div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-border relative">
              <div className="flex gap-3">
                <img
                  alt={user.nama}
                  src={user.foto || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.nama)}
                  className="size-12 rounded-full border-2 border-secondary object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{user.nama}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  {user.nip && (
                    <p className="text-xs text-muted-foreground">NIP: {user.nip}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${getRoleBadgeClass(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      user.is_active ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'
                    }`}>
                      {user.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowActionMenu(showActionMenu === user.id ? null : user.id)}
                  className="flex items-center justify-center size-8 rounded-lg hover:bg-muted transition-colors"
                  type="button"
                >
                  <Icon icon="solar:menu-dots-bold" className="size-5 text-muted-foreground" />
                </button>
              </div>

              {/* Action Menu */}
              {showActionMenu === user.id && (
                <div className="absolute right-4 top-16 bg-card rounded-xl shadow-lg border border-border z-10 py-2 min-w-[180px]">
                  <button
                    onClick={() => openEditModal(user)}
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                    type="button"
                  >
                    <Icon icon="solar:pen-bold" className="size-4" />
                    Edit Pengguna
                  </button>
                  <button
                    onClick={() => handleResetPassword(user)}
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                    type="button"
                  >
                    <Icon icon="solar:key-bold" className="size-4" />
                    Reset Password
                  </button>
                  <button
                    onClick={() => handleToggleStatus(user)}
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                    type="button"
                  >
                    <Icon icon="solar:refresh-bold" className="size-4" />
                    Toggle Status
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
                    type="button"
                  >
                    <Icon icon="solar:trash-bin-trash-bold" className="size-4" />
                    Hapus Pengguna
                  </button>
                </div>
              )}
            </div>
          ))
        )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground font-heading">Tambah Pengguna Baru</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="flex items-center justify-center size-8 rounded-lg hover:bg-muted transition-colors"
                type="button"
              >
                <Icon icon="solar:close-circle-bold" className="size-6 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nama Lengkap <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  NIP (Nomor Induk Pegawai)
                </label>
                <input
                  type="text"
                  value={formData.nip}
                  onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm"
                  placeholder="Opsional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  No HP/WhatsApp
                </label>
                <input
                  type="tel"
                  value={formData.no_hp}
                  onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm"
                  placeholder="+628xxxxxxxxxx"
                />
                <p className="text-xs text-muted-foreground mt-1">Format: +62... (Opsional)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password <span className="text-destructive">*</span>
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm"
                  minLength={8}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">Minimal 8 karakter</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Role <span className="text-destructive">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm"
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="dosen">Dosen</option>
                  <option value="dosen_pa">Dosen PA</option>
                  <option value="musyrif">Musyrif</option>
                  <option value="waket3">Wakil Ketua III</option>
                  <option value="staff">Staff</option>
                  <option value="mahasiswa">Mahasiswa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="is_active"
                      checked={formData.is_active === true}
                      onChange={() => setFormData({ ...formData, is_active: true })}
                      className="size-4"
                    />
                    <span className="text-sm text-foreground">Aktif</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="is_active"
                      checked={formData.is_active === false}
                      onChange={() => setFormData({ ...formData, is_active: false })}
                      className="size-4"
                    />
                    <span className="text-sm text-foreground">Nonaktif</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-muted text-foreground font-semibold hover:bg-muted/80 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground font-heading">Edit Pengguna</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                  resetForm();
                }}
                className="flex items-center justify-center size-8 rounded-lg hover:bg-muted transition-colors"
                type="button"
              >
                <Icon icon="solar:close-circle-bold" className="size-6 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleEditUser} className="space-y-4">
              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Foto Profil</label>
                <div className="flex items-center gap-4">
                  <div className="relative size-20 rounded-xl overflow-hidden bg-muted border border-border">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="size-full flex items-center justify-center">
                        <Icon icon="solar:user-bold" className="size-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      id="edit-photo-upload"
                    />
                    <label
                      htmlFor="edit-photo-upload"
                      className="inline-block px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold cursor-pointer hover:bg-primary/90 transition-colors"
                    >
                      Pilih Foto
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Format: JPG, PNG (Max 2MB)
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nama Lengkap <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  NIP (Nomor Induk Pegawai)
                </label>
                <input
                  type="text"
                  value={formData.nip}
                  onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm"
                  placeholder="Opsional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  No HP/WhatsApp
                </label>
                <input
                  type="tel"
                  value={formData.no_hp}
                  onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm"
                  placeholder="+628xxxxxxxxxx"
                />
                <p className="text-xs text-muted-foreground mt-1">Format: +62... (Opsional)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Role <span className="text-destructive">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm"
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="dosen">Dosen</option>
                  <option value="dosen_pa">Dosen PA</option>
                  <option value="musyrif">Musyrif</option>
                  <option value="waket3">Wakil Ketua III</option>
                  <option value="staff">Staff</option>
                  <option value="mahasiswa">Mahasiswa</option>
                </select>
              </div>

              <div className="bg-muted/50 rounded-xl p-3">
                <p className="text-xs text-muted-foreground">
                  <Icon icon="solar:info-circle-bold" className="inline size-4 mr-1" />
                  Untuk mengubah password, gunakan menu "Reset Password"
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                    resetForm();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-muted text-foreground font-semibold hover:bg-muted/80 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingPhoto}
                  className="flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isUploadingPhoto ? (
                    <>
                      <Icon icon="svg-spinners:ring-resize" className="inline size-4 mr-2" />
                      Upload Foto...
                    </>
                  ) : isSubmitting ? (
                    'Menyimpan...'
                  ) : (
                    'Simpan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


