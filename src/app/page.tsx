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

        if (user.role === 'admin') {
          redirectPath = '/admin';
        } else if (user.role === 'mahasiswa') {
          redirectPath = '/mahasiswa/dashboard';
        } else {
          // For other roles (dosen, staff, etc.)
          redirectPath = '/admin';
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
  // Show loading while checking auth
  return (
    <div className="flex items-center justify-center h-screen bg-neutral-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-neutral-600">Memuat...</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-600">Memuat...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
