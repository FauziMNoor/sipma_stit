'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

export default function BantuanDosenPA() {
  const router = useRouter();
  const [campusInfo, setCampusInfo] = useState({
    name: 'STIT Riyadhussholihiin',
    address: 'Jl. Pendidikan No. 123, Kota, Provinsi',
    operational_hours: 'Senin - Jumat: 08.00 - 16.00 WIB'
  });
  const [adminContacts, setAdminContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch campus info
      const settingsResponse = await fetch('/api/settings?category=general');
      const settingsResult = await settingsResponse.json();
      if (settingsResult.success && settingsResult.data) {
        const settings = settingsResult.data;
        setCampusInfo({
          name: settings.find((s: any) => s.setting_key === 'campus_name')?.setting_value || 'STIT Riyadhussholihiin',
          address: settings.find((s: any) => s.setting_key === 'campus_address')?.setting_value || 'Jl. Pendidikan No. 123, Kota, Provinsi',
          operational_hours: settings.find((s: any) => s.setting_key === 'campus_operational_hours')?.setting_value || 'Senin - Jumat: 08.00 - 16.00 WIB'
        });
      }

      // Fetch admin contacts
      const usersResponse = await fetch('/api/users?role=admin');
      const usersResult = await usersResponse.json();
      if (usersResult.success && usersResult.data) {
        // Filter only active admins
        const activeAdmins = usersResult.data.filter((u: any) => u.is_active);
        setAdminContacts(activeAdmins);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
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
            <h1 className="text-lg font-bold text-white font-heading">Bantuan</h1>
            <div className="size-11" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Main Info */}
          <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-center shadow-lg">
            <Icon icon="solar:chat-round-call-bold" className="size-16 text-white mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Butuh Bantuan?</h2>
            <p className="text-sm text-white/90">
              Hubungi admin kampus untuk bantuan terkait sistem SIPMA
            </p>
          </div>

          {/* Contact Cards */}
          <div className="space-y-4">
            {adminContacts.length > 0 ? (
              adminContacts.map((admin, index) => (
                <div key={admin.id} className="bg-card rounded-2xl p-5 shadow-sm border border-border">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10 flex-shrink-0">
                      <Icon icon="solar:user-id-bold" className="size-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground mb-1">{admin.nama}</p>
                      <p className="text-xs text-muted-foreground mb-3">
                        Administrator Sistem - Untuk bantuan teknis dan pertanyaan tentang sistem
                      </p>
                      <div className="space-y-2">
                        <a
                          href={`mailto:${admin.email}`}
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <Icon icon="solar:letter-bold" className="size-4" />
                          {admin.email}
                        </a>
                        {admin.no_hp && (
                          <a
                            href={`tel:${admin.no_hp}`}
                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                          >
                            <Icon icon="solar:phone-bold" className="size-4" />
                            {admin.no_hp}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10 flex-shrink-0">
                    <Icon icon="solar:user-id-bold" className="size-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground mb-1">Administrator Sistem</p>
                    <p className="text-xs text-muted-foreground">
                      Data kontak admin belum tersedia. Silakan hubungi bagian akademik.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center size-12 rounded-xl bg-chart-2/10 flex-shrink-0">
                  <Icon icon="solar:map-point-bold" className="size-6 text-chart-2" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground mb-1">Kantor Kampus</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Kunjungi kami secara langsung di kampus
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Icon icon="solar:map-point-bold" className="size-4 flex-shrink-0 mt-0.5" />
                      <span>{campusInfo.name}, {campusInfo.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon icon="solar:clock-circle-bold" className="size-4" />
                      <span>{campusInfo.operational_hours}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
            <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
              <Icon icon="solar:question-circle-bold" className="size-5 text-primary" />
              Pertanyaan Umum
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  Bagaimana cara memverifikasi kegiatan mahasiswa?
                </p>
                <p className="text-xs text-muted-foreground">
                  Buka menu "Verifikasi" dari dashboard, pilih kegiatan yang ingin diverifikasi, lalu klik "Setujui" atau "Tolak" dengan memberikan catatan jika diperlukan.
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  Bagaimana melihat mahasiswa bimbingan saya?
                </p>
                <p className="text-xs text-muted-foreground">
                  Klik menu "Mahasiswa Bimbingan" dari dashboard untuk melihat daftar mahasiswa yang Anda bimbing beserta rekap poin mereka.
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  Lupa password, apa yang harus dilakukan?
                </p>
                <p className="text-xs text-muted-foreground">
                  Hubungi administrator sistem melalui kontak yang tertera di atas untuk mereset password Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
