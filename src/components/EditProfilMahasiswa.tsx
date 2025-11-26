'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface MahasiswaData {
  id: string;
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
  semester: number;
  foto: string | null;
  email?: string;
  no_telepon?: string;
  alamat?: string;
}

export default function EditProfilMahasiswa() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mahasiswa, setMahasiswa] = useState<MahasiswaData | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    no_telepon: '',
    alamat: '',
    prodi: '',
  });
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/mahasiswa/${user?.id}`);
      const result = await response.json();

      if (result.success && result.data) {
        setMahasiswa(result.data);
        setFormData({
          nama: result.data.nama || '',
          email: result.data.email || '',
          no_telepon: result.data.no_telepon || '',
          alamat: result.data.alamat || '',
          prodi: result.data.prodi || '',
        });
        setFotoPreview(result.data.foto);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);

      // Get token from localStorage
      const token = localStorage.getItem('auth-token');

      // Upload foto if changed
      let fotoUrl = mahasiswa?.foto;
      if (fotoFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', fotoFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: uploadFormData,
          credentials: 'include',
        });

        const uploadResult = await uploadResponse.json();
        if (uploadResult.success) {
          fotoUrl = uploadResult.url;
        }
      }

      // Update profile
      const response = await fetch(`/api/mahasiswa/${user?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          foto: fotoUrl,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Profil berhasil diperbarui!');
        router.push('/mahasiswa/profil');
      } else {
        alert('Gagal memperbarui profil: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Terjadi kesalahan saat memperbarui profil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
            <div className="h-4 bg-white/20 rounded w-40 mx-auto animate-pulse mt-2" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Photo Upload Skeleton */}
            <div className="flex flex-col items-center space-y-4">
              <div className="size-32 rounded-full bg-muted animate-pulse" />
              <div className="h-10 bg-muted rounded-lg w-40 animate-pulse" />
            </div>

            {/* Form Fields Skeleton */}
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i}>
                  <div className="h-4 bg-muted rounded w-24 mb-2 animate-pulse" />
                  <div className="h-12 bg-muted rounded-lg w-full animate-pulse" />
                </div>
              ))}
            </div>

            {/* Buttons Skeleton */}
            <div className="flex gap-3">
              <div className="h-12 bg-muted rounded-lg flex-1 animate-pulse" />
              <div className="h-12 bg-muted rounded-lg flex-1 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <div className="max-w-3xl mx-auto w-full flex items-center justify-between">
          <button
            onClick={() => router.push('/mahasiswa/profil')}
            className="flex items-center justify-center size-11"
          >
            <Icon icon="solar:arrow-left-linear" className="size-6 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold font-heading text-foreground">Edit Profil</h1>
          <div className="size-11" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6">
          <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-3xl p-6 border border-border shadow-sm">
            {/* Photo Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <img
                  alt="Profile"
                  src={fotoPreview || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(mahasiswa?.nama || 'User')}
                  className="size-28 rounded-full border-4 border-primary shadow-lg object-cover"
                />
                <label
                  htmlFor="foto-upload"
                  className="absolute bottom-0 right-0 flex items-center justify-center size-10 rounded-full bg-accent border-2 border-card shadow-lg cursor-pointer hover:bg-accent/90 transition-colors"
                >
                  <Icon icon="solar:camera-bold" className="size-5 text-accent-foreground" />
                </label>
                <input
                  id="foto-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFotoChange}
                  className="hidden"
                />
              </div>
              <label htmlFor="foto-upload" className="mt-3 text-sm font-semibold text-primary cursor-pointer hover:underline">
                Ubah Foto
              </label>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nama lengkap"
                  required
                />
              </div>

              {/* NIM (Disabled) */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  NIM
                </label>
                <input
                  type="text"
                  value={mahasiswa?.nim || ''}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-border bg-muted text-muted-foreground cursor-not-allowed"
                  placeholder="NIM"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="email@example.com"
                />
              </div>

              {/* No. Telepon */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  No. Telepon
                </label>
                <input
                  type="tel"
                  name="no_telepon"
                  value={formData.no_telepon}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0812-3456-7890"
                />
              </div>

              {/* Alamat */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Alamat
                </label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground h-24 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Masukkan alamat lengkap"
                />
              </div>

              {/* Program Studi */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Program Studi
                </label>
                <input
                  type="text"
                  name="prodi"
                  value={formData.prodi}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Program Studi"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 pb-8">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 px-6 rounded-2xl font-bold text-white shadow-lg bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Icon icon="solar:loading-bold" className="size-5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan Perubahan</span>
              )}
            </button>
          </div>
          </div>
        </form>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-3xl mx-auto flex items-center justify-around py-3 px-6">
          <button
            onClick={() => router.push('/mahasiswa/dashboard')}
            className="flex flex-col items-center gap-1.5 flex-1"
          >
            <Icon icon="solar:home-2-bold" className="size-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Home</span>
          </button>
          <button
            onClick={() => router.push('/mahasiswa/kegiatan')}
            className="flex flex-col items-center gap-1.5 flex-1"
          >
            <Icon icon="solar:calendar-bold" className="size-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Kegiatan</span>
          </button>
          <button
            onClick={() => router.push('/mahasiswa/profil')}
            className="flex flex-col items-center gap-1.5 flex-1"
          >
            <Icon icon="solar:user-bold" className="size-6 text-primary" />
            <span className="text-xs text-primary font-semibold">Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
}

