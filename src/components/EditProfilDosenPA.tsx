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
}

export default function EditProfilDosenPA() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<DosenProfile | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    nip: '',
  });

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

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
        setFormData({
          nama: result.data.nama,
          email: result.data.email,
          nip: result.data.nip,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama.trim() || !formData.email.trim()) {
      alert('Nama dan email wajib diisi');
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/dosen-pa/profile/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('Profil berhasil diperbarui');
        router.back();
      } else {
        alert(result.error || 'Gagal memperbarui profil');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Terjadi kesalahan saat memperbarui profil');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <Icon icon="svg-spinners:ring-resize" className="size-12 text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-6 py-5 bg-primary border-b border-border">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center size-11 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Icon icon="solar:arrow-left-linear" className="size-6 text-white" />
            </button>
            <h1 className="text-lg font-bold text-white font-heading">Edit Profil</h1>
            <div className="size-11" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photo */}
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <div className="flex flex-col items-center">
                <img
                  alt={profile.nama}
                  src={profile.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.nama)}&size=128`}
                  className="size-24 rounded-full border-4 border-primary object-cover mb-4"
                />
                <p className="text-xs text-muted-foreground text-center">
                  Untuk mengubah foto profil, hubungi admin
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  NIP <span className="text-muted-foreground">(Tidak dapat diubah)</span>
                </label>
                <input
                  type="text"
                  value={formData.nip}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-muted-foreground cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Nama Lengkap <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Masukkan email"
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 px-4 rounded-xl bg-muted text-foreground font-semibold hover:bg-muted/80 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
