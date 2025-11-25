'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Icon } from '@iconify/react';
import EditProfilDosenPA from '@/components/EditProfilDosenPA';

export default function EditProfilDosenPAPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (!isLoading && user && user.role !== 'dosen_pa') {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <Icon icon="svg-spinners:ring-resize" className="size-12 text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'dosen_pa') {
    return null;
  }

  return <EditProfilDosenPA />;
}
