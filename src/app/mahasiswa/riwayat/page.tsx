'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import RiwayatPoin from '@/components/RiwayatPoin';
import { Icon } from '@iconify/react';

export default function RiwayatPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Icon icon="svg-spinners:ring-resize" className="size-12 text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <RiwayatPoin userId={user.id} />;
}

