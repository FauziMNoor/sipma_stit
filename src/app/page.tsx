'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Splash } from '@/components/Splash';
import { Onboarding } from '@/components/Onboarding';
import { useAuth } from '@/hooks/useAuth';

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Force onboarding with ?onboarding=true
  const forceOnboarding = searchParams.get('onboarding') === 'true';

  useEffect(() => {
    // Show splash for 3 seconds
    console.log('🎬 Splash screen started');
    console.log('🎬 Initial state:', { showSplash, showOnboarding, forceOnboarding, hasUser: !!user });

    const timer = setTimeout(() => {
      console.log('🎬 Splash screen done - 3 seconds passed');
      console.log('🎬 About to set showSplash to false');
      setShowSplash(false);

      // ALWAYS show onboarding if user is NOT logged in
      console.log('🔍 Checking onboarding after splash:', {
        hasUser: !!user,
        forceOnboarding
      });

      if (!user || forceOnboarding) {
        console.log('✅ SETTING showOnboarding to TRUE (user not logged in)');
        setShowOnboarding(true);
      } else {
        console.log('❌ Skipping onboarding (user already logged in)');
      }
    }, 3000);

    return () => {
      console.log('🎬 Cleanup timer');
      clearTimeout(timer);
    };
  }, [forceOnboarding, user]);

  useEffect(() => {
    // Redirect after splash and onboarding are done
    if (!showSplash && !showOnboarding && !isLoading) {
      if (user) {
        console.log('🚀 Redirecting to dashboard (user logged in)');
        let redirectPath = '/login';

        if (user.role === 'admin' || user.role === 'staff') {
          redirectPath = '/admin';
        } else if (user.role === 'dosen_pa') {
          redirectPath = '/dosen-pa/dashboard';
        } else if (user.role === 'waket3') {
          redirectPath = '/waket3/dashboard';
        } else if (user.role === 'mahasiswa') {
          redirectPath = '/mahasiswa/dashboard';
        } else {
          // For other unknown roles, redirect to login
          redirectPath = '/login';
        }

        window.location.href = redirectPath;
      } else {
        console.log('🚀 Redirecting to login (no user)');
        window.location.href = '/login';
      }
    }
  }, [showSplash, showOnboarding, isLoading, user, router]);

  const handleOnboardingComplete = () => {
    console.log('✅ Onboarding completed - redirecting to login');
    // No need to save to localStorage anymore
    // Onboarding will always show for non-logged-in users
    setShowOnboarding(false);
  };

  console.log('🎨 ========== RENDER ==========');
  console.log('🎨 Rendering Home:', {
    showSplash,
    showOnboarding,
    isLoading,
    hasUser: !!user,
    userName: user?.nama
  });

  if (showSplash) {
    console.log('🎨 ✅ Rendering: Splash');
    return <Splash />;
  }

  if (showOnboarding) {
    console.log('🎨 ✅ Rendering: Onboarding');
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  console.log('🎨 ✅ Rendering: Loading/Redirecting');
  // Show skeleton loader while checking auth and redirecting
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

            {/* Button Skeleton */}
            <div className="h-12 sm:h-14 bg-neutral-200 rounded-xl sm:rounded-2xl animate-pulse mt-8" />

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

export default function Home() {
  return (
    <Suspense fallback={
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

              {/* Button Skeleton */}
              <div className="h-12 sm:h-14 bg-neutral-200 rounded-xl sm:rounded-2xl animate-pulse mt-8" />

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
    }>
      <HomeContent />
    </Suspense>
  );
}
