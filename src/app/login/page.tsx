'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import { Icon } from '@iconify/react';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const toast = useToast();
  const router = useRouter();
  const { login, user, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      console.log('🔄 Login page - User authenticated, redirecting...', { role: user.role, nama: user.nama });

      // User already logged in, redirect based on role
      let redirectPath = '/dashboard';
      if (user.role === 'admin' || user.role === 'staff') {
        redirectPath = '/admin';
      } else if (user.role === 'dosen_pa') {
        redirectPath = '/dosen-pa/dashboard';
      } else if (user.role === 'waket3') {
        redirectPath = '/waket3/dashboard';
      } else if (user.role === 'musyrif') {
        redirectPath = '/musyrif/dashboard';
      } else if (user.role === 'mahasiswa') {
        redirectPath = '/mahasiswa/dashboard';
      }

      console.log('🔄 Redirecting to:', redirectPath);
      window.location.href = redirectPath; // Use window.location for full page reload
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success && result.user) {
        toast.success('Login berhasil!');
        // Don't redirect here - let useEffect handle it after user state is updated
        // This prevents race condition and ensures cookie is properly set
      } else {
        toast.error(result.error || 'Login gagal');
        setIsLoading(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'Terjadi kesalahan');
      setIsLoading(false);
    }
  };

  // Show skeleton loader during auth check or login process
  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col h-screen bg-white">
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-12">
          <div className="w-full max-w-md mx-auto space-y-8">
            {/* Logo and Title Skeleton */}
            <div className="text-center space-y-4 mb-12">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-neutral-200 animate-pulse" />
              </div>
              <div className="h-8 sm:h-10 bg-neutral-200 rounded-lg w-3/4 mx-auto animate-pulse" />
              <div className="h-4 bg-neutral-200 rounded w-1/2 mx-auto animate-pulse" />
            </div>

            {/* Form Skeleton */}
            <div className="space-y-6">
              {/* Input Field 1 */}
              <div>
                <div className="h-4 bg-neutral-200 rounded w-24 mb-3 animate-pulse" />
                <div className="h-12 sm:h-14 bg-neutral-200 rounded-xl sm:rounded-2xl animate-pulse" />
              </div>

              {/* Input Field 2 */}
              <div>
                <div className="h-4 bg-neutral-200 rounded w-24 mb-3 animate-pulse" />
                <div className="h-12 sm:h-14 bg-neutral-200 rounded-xl sm:rounded-2xl animate-pulse" />
              </div>

              {/* Button Skeleton - dengan efek loading */}
              <div className="h-12 sm:h-14 bg-gradient-to-r from-primary-400 to-primary-500 rounded-xl sm:rounded-2xl animate-pulse mt-8" />

              {/* Link Skeleton */}
              <div className="flex justify-center">
                <div className="h-4 bg-neutral-200 rounded w-32 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="px-6 pb-6 sm:pb-8 text-center">
          <div className="h-4 bg-neutral-200 rounded w-48 mx-auto animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-12">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="text-center space-y-4 mb-12">
            <div className="flex justify-center mb-6">
              <Image
                src="/logo.png"
                alt="Logo STIT Riyadhusssholihiin"
                width={120}
                height={120}
                className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 object-contain"
                priority
              />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900">
              Selamat Datang di SIPMA
            </h1>
            <p className="text-sm sm:text-base text-neutral-600">Silakan masuk untuk melanjutkan</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2 sm:mb-3">
                NIM / Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl bg-neutral-50 border-2 border-neutral-200 text-sm sm:text-base text-neutral-900 placeholder:text-neutral-500 focus:border-primary-500 focus:outline-none transition-colors"
                  placeholder="Masukkan NIM atau Email Anda"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2 sm:mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 sm:px-5 sm:py-4 sm:pr-14 rounded-xl sm:rounded-2xl bg-neutral-50 border-2 border-neutral-200 text-sm sm:text-base text-neutral-900 placeholder:text-neutral-500 focus:border-primary-500 focus:outline-none transition-colors"
                  placeholder="Masukkan password Anda"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition"
                  disabled={isLoading}
                >
                  <Icon
                    icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    className="size-5 sm:size-6"
                  />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 sm:py-4 px-6 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg shadow-lg bg-primary-500 text-white hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6 sm:mt-8"
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

      <div className="px-6 pb-6 sm:pb-8 text-center space-y-4">
        <p className="text-xs sm:text-sm font-medium text-neutral-700">STIT Riyadhusssholihiin</p>
      </div>
    </div>
  );
}

