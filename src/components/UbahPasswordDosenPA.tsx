'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function UbahPasswordDosenPA() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert('Password baru dan konfirmasi password tidak cocok');
      return;
    }

    if (formData.newPassword.length < 6) {
      alert('Password baru minimal 6 karakter');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/dosen-pa/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user?.id,
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('Password berhasil diubah');
        router.back();
      } else {
        alert(result.error || 'Gagal mengubah password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Terjadi kesalahan saat mengubah password');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1 className="text-lg font-bold text-white font-heading">Ubah Password</h1>
            <div className="size-11" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Info Card */}
            <div className="bg-accent/10 rounded-2xl p-4 border border-accent/20">
              <div className="flex items-start gap-3">
                <Icon icon="solar:info-circle-bold" className="size-6 text-accent-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">Tips Keamanan Password</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Gunakan minimal 6 karakter</li>
                    <li>• Kombinasikan huruf besar, kecil, dan angka</li>
                    <li>• Jangan gunakan password yang mudah ditebak</li>
                    <li>• Jangan bagikan password kepada siapapun</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Password Lama <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    value={formData.oldPassword}
                    onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Masukkan password lama"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <Icon icon={showOldPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} className="size-5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Password Baru <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Masukkan password baru"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <Icon icon={showNewPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} className="size-5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Konfirmasi Password Baru <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ulangi password baru"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <Icon icon={showConfirmPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} className="size-5" />
                  </button>
                </div>
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
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Menyimpan...' : 'Ubah Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
