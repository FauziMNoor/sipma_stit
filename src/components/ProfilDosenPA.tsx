'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface DosenProfile {
  id: string;
  nip: string;
  nama: string;
  email: string;
  foto: string | null;
  total_mahasiswa_bimbingan: number;
  total_verifikasi: number;
}

export default function ProfilDosenPA() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<DosenProfile | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    nip: '',
    email: '',
    no_hp: '',
  });

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/dosen-pa/profile/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        setProfile(result.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm('Apakah Anda yakin ingin logout?')) return;

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        localStorage.removeItem('auth-token');
        router.push('/login');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const openEditModal = async () => {
    if (profile && user?.id) {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });
      
      let no_hp = '';
      if (response.ok) {
        const result = await response.json();
        no_hp = result.data?.no_hp || '';
      }

      setFormData({
        nama: profile.nama,
        nip: profile.nip,
        email: profile.email,
        no_hp,
      });
      setPhotoPreview(profile.foto);
      setShowEditModal(true);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran foto maksimal 2MB');
        return;
      }
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

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', selectedPhoto);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
        credentials: 'include',
      });

      const result = await response.json();
      if (result.success && result.url) {
        return result.url;
      } else {
        alert('Gagal mengupload foto');
        return null;
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Terjadi kesalahan saat mengupload foto');
      return null;
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsSubmitting(true);
    try {
      let fotoUrl = profile?.foto;

      if (selectedPhoto) {
        const uploadedUrl = await uploadPhoto();
        if (uploadedUrl) {
          fotoUrl = uploadedUrl;
        }
      }

      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/dosen-pa/profile/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          nama: formData.nama,
          nip: formData.nip,
          email: formData.email,
          no_hp: formData.no_hp,
          foto: fotoUrl,
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert('Profil berhasil diupdate!');
        setShowEditModal(false);
        setSelectedPhoto(null);
        fetchProfile();
      } else {
        alert('Gagal mengupdate profil: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Terjadi kesalahan saat mengupdate profil');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="flex flex-col h-full bg-background">
        {/* Header Skeleton */}
        <div className="px-6 py-5 bg-primary">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-1">
              <div className="size-11 rounded-xl bg-white/20 animate-pulse" />
              <div className="h-6 bg-white/20 rounded w-32 animate-pulse" />
              <div className="size-11" />
            </div>
            <div className="h-4 bg-white/20 rounded w-44 mx-auto animate-pulse mt-2" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Profile Card Skeleton */}
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="size-24 rounded-full bg-muted animate-pulse mb-4" />
                <div className="h-6 bg-muted rounded w-48 mx-auto animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded w-32 mx-auto animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded w-40 mx-auto animate-pulse mb-4" />
                <div className="px-4 py-2 rounded-lg bg-muted animate-pulse w-40 h-12" />
              </div>
              <div className="h-12 bg-muted rounded-xl animate-pulse" />
            </div>

            {/* Stats Skeleton */}
            <div>
              <div className="h-6 bg-muted rounded w-32 mb-4 animate-pulse" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-card rounded-2xl p-4 shadow-sm border border-border">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="size-12 rounded-xl bg-muted animate-pulse" />
                      <div className="h-6 bg-muted rounded w-12 mx-auto animate-pulse" />
                      <div className="h-3 bg-muted rounded w-24 mx-auto animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Logout Button Skeleton */}
            <div className="pb-6">
              <div className="h-14 bg-muted rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-6 py-5 bg-primary">
        <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center size-11 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Icon icon="solar:arrow-left-linear" className="size-6 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white font-heading">Profil Saya</h1>
          <div className="size-11" />
        </div>
        <p className="text-sm text-white/80 text-center">Informasi akun dosen pembimbing akademik</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="flex flex-col items-center text-center mb-6">
            <img
              alt={profile.nama}
              src={
                profile.foto ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.nama)}&size=128`
              }
              className="size-24 rounded-full border-4 border-primary object-cover mb-4"
            />
            <h2 className="text-xl font-bold text-foreground mb-1">{profile.nama}</h2>
            <p className="text-sm text-muted-foreground mb-1">NIP: {profile.nip}</p>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <div className="mt-4 px-4 py-2 rounded-lg bg-primary/10">
              <p className="text-xs text-muted-foreground">Jabatan</p>
              <p className="text-sm font-semibold text-primary">Dosen Pembimbing Akademik</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted rounded-xl p-4 text-center">
              <Icon icon="solar:users-group-rounded-bold" className="size-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{profile.total_mahasiswa_bimbingan}</p>
              <p className="text-xs text-muted-foreground">Mahasiswa Bimbingan</p>
            </div>
            <div className="bg-muted rounded-xl p-4 text-center">
              <Icon icon="solar:clipboard-check-bold" className="size-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{profile.total_verifikasi}</p>
              <p className="text-xs text-muted-foreground">Total Verifikasi</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="space-y-3">
          <button
            onClick={openEditModal}
            className="w-full"
          >
            <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10">
                    <Icon icon="solar:user-bold" className="size-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">Edit Profil</p>
                    <p className="text-xs text-muted-foreground">Ubah informasi profil Anda</p>
                  </div>
                </div>
                <Icon icon="solar:alt-arrow-right-linear" className="size-5 text-muted-foreground" />
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/dosen-pa/bantuan')}
            className="w-full"
          >
            <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center size-12 rounded-xl bg-secondary/10">
                    <Icon icon="solar:info-circle-bold" className="size-6 text-secondary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">Bantuan</p>
                    <p className="text-xs text-muted-foreground">Panduan penggunaan sistem</p>
                  </div>
                </div>
                <Icon icon="solar:alt-arrow-right-linear" className="size-5 text-muted-foreground" />
              </div>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="w-full"
          >
            <div className="bg-card rounded-2xl p-5 shadow-sm border border-destructive/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center size-12 rounded-xl bg-destructive/10">
                    <Icon icon="solar:logout-2-bold" className="size-6 text-destructive" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-destructive">Logout</p>
                    <p className="text-xs text-muted-foreground">Keluar dari akun Anda</p>
                  </div>
                </div>
                <Icon icon="solar:alt-arrow-right-linear" className="size-5 text-destructive" />
              </div>
            </div>
          </button>
        </div>

        {/* Info */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-5 border border-primary/20">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center size-14 rounded-xl bg-primary/20">
              <Icon icon="solar:shield-check-bold" className="size-7 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Keamanan Akun</p>
              <p className="text-xs text-muted-foreground">
                Pastikan password Anda aman dan tidak dibagikan kepada siapapun
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground font-heading">Edit Profil</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedPhoto(null);
                  setPhotoPreview(null);
                }}
                className="flex items-center justify-center size-8 rounded-lg hover:bg-muted transition-colors"
                type="button"
              >
                <Icon icon="solar:close-circle-bold" className="size-6 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
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
                  NIP <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nip}
                  onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm"
                  required
                />
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

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedPhoto(null);
                    setPhotoPreview(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-muted text-foreground font-semibold hover:bg-muted/80 transition-colors"
                  disabled={isSubmitting}
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
    </div>
  );
}

