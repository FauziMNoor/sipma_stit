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

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <Icon icon="svg-spinners:ring-resize" className="size-12 text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-6 py-5 bg-primary">
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center size-11"
          >
            <Icon icon="solar:arrow-left-linear" className="size-6 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white font-heading">Profil Saya</h1>
          <div className="size-11" />
        </div>
        <p className="text-sm text-white/80 text-center">Informasi akun dosen pembimbing akademik</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
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
              <p className="text-xs text-muted-foreground">Role</p>
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
            onClick={() => router.push('/dosen-pa/edit-profil')}
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
            onClick={() => router.push('/dosen-pa/ubah-password')}
            className="w-full"
          >
            <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center size-12 rounded-xl bg-accent/20">
                    <Icon icon="solar:lock-password-bold" className="size-6 text-accent-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">Ubah Password</p>
                    <p className="text-xs text-muted-foreground">Ganti password akun Anda</p>
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
  );
}

