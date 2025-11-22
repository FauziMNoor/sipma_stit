'use client';

import { Icon } from "@iconify/react";
import { useRouter } from 'next/navigation';

export function DashboardAdmin() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="px-6 py-5 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground font-heading">Admin Dashboard</h1>
          <button className="flex items-center justify-center size-11 rounded-xl bg-muted">
            <Icon icon="solar:settings-bold" className="size-6 text-primary" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-11 rounded-xl bg-primary/10">
                <Icon icon="solar:users-group-two-rounded-bold" className="size-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Total Mahasiswa</p>
                <p className="text-lg font-bold text-foreground font-heading">1,248</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-11 rounded-xl bg-secondary/10">
                <Icon icon="solar:calendar-bold" className="size-5 text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Total Kegiatan</p>
                <p className="text-lg font-bold text-foreground font-heading">342</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-11 rounded-xl bg-accent/20">
                <Icon icon="solar:clock-circle-bold" className="size-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Pengajuan Pending</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-foreground font-heading">28</p>
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-accent text-accent-foreground">
                    Pending
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-11 rounded-xl bg-chart-2/10">
                <Icon icon="solar:medal-star-bold" className="size-5 text-chart-2" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Total Poin</p>
                <p className="text-lg font-bold text-foreground font-heading">45,620</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4 font-heading">Menu Manajemen</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/admin/kelola-mahasiswa')}
              className="bg-card rounded-2xl p-6 shadow-md border border-border hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center size-16 rounded-2xl bg-primary/10">
                  <Icon icon="solar:users-group-rounded-bold" className="size-8 text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground">Kelola Mahasiswa</p>
              </div>
            </button>
            <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center size-16 rounded-2xl bg-secondary/10">
                  <Icon icon="solar:clipboard-list-bold" className="size-8 text-secondary" />
                </div>
                <p className="text-sm font-semibold text-foreground">Kelola Kegiatan</p>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center size-16 rounded-2xl bg-accent/20">
                  <Icon icon="solar:check-circle-bold" className="size-8 text-accent" />
                </div>
                <p className="text-sm font-semibold text-foreground">Verifikasi Semua</p>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center size-16 rounded-2xl bg-chart-2/10">
                  <Icon icon="solar:chart-bold" className="size-8 text-chart-2" />
                </div>
                <p className="text-sm font-semibold text-foreground">Laporan & Statistik</p>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center size-16 rounded-2xl bg-chart-4/10">
                  <Icon icon="solar:user-id-bold" className="size-8 text-chart-4" />
                </div>
                <p className="text-sm font-semibold text-foreground">Kelola Pengguna</p>
              </div>
            </div>
            <button onClick={() => router.push('/admin/pengaturan-sistem')} className="bg-card rounded-2xl p-6 shadow-md border border-border hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center size-16 rounded-2xl bg-muted">
                  <Icon icon="solar:settings-bold" className="size-8 text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground">Pengaturan Sistem</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

