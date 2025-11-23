'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { Icon } from '@iconify/react';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const toast = useToast();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success && result.user) {
        toast.success('Login berhasil!');

        // Redirect based on role
        let redirectPath = '/dashboard';
        if (result.user.role === 'admin' || result.user.role === 'dosen' || result.user.role === 'staff') {
          redirectPath = '/admin';
        } else if (result.user.role === 'mahasiswa') {
          redirectPath = '/mahasiswa/dashboard';
        }

        // Use window.location for full page reload
        window.location.href = redirectPath;
      } else {
        toast.error(result.error || 'Login gagal');
        setIsLoading(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'Terjadi kesalahan');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex-1 flex flex-col justify-center px-8 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-3 mb-12">
            <h1 className="text-3xl font-bold text-neutral-900">
              Selamat Datang di SIPMA
            </h1>
            <p className="text-base text-neutral-600">Silakan masuk untuk melanjutkan</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-3">
                NIM / Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-neutral-50 border-2 border-neutral-200 text-neutral-900 placeholder:text-neutral-500 focus:border-primary-500 focus:outline-none transition-colors"
                  placeholder="Masukkan NIM atau Email Anda"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 pr-14 rounded-2xl bg-neutral-50 border-2 border-neutral-200 text-neutral-900 placeholder:text-neutral-500 focus:border-primary-500 focus:outline-none transition-colors"
                  placeholder="Masukkan password Anda"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition"
                  disabled={isLoading}
                >
                  <Icon
                    icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    className="size-6"
                  />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg bg-primary-500 text-white hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              {isLoading ? 'Memuat...' : 'Masuk'}
            </button>

            <div className="text-center">
              <a href="#" className="text-sm font-medium text-primary-500 hover:text-primary-600 transition">
                Lupa password?
              </a>
            </div>
          </form>
        </div>
      </div>

      <div className="px-6 pb-8 text-center space-y-4">
        <p className="text-sm font-medium text-neutral-700">STIT Riyadhusssholihiin</p>
      </div>
    </div>
  );
}

