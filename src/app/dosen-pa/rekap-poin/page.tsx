'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Icon } from '@iconify/react';
import RekapPoinDosenPA from '@/components/RekapPoinDosenPA';

export default function RekapPoinPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (!isLoading && user && user.role !== 'dosen_pa') {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Show loading or redirect - let component handle its own loading
  if (isLoading || !user || user.role !== 'dosen_pa') {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <Icon icon="svg-spinners:ring-resize" className="size-12 text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  return <RekapPoinDosenPA />;
}

