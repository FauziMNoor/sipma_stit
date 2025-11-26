'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

interface LaporanStats {
  kategoriStats: Record<string, number>;
  totalPoin: number;
  topMahasiswa: Array<{ nama: string; poin: number }>;
  statusDistribution: {
    sangat_aktif: number;
    aktif: number;
    cukup_aktif: number;
    pasif: number;
  };
  totalMahasiswa: number;
  rataRataPoin: number;
  kegiatanTerbanyak: string;
  kategoriPalingAktif: string;
}

export default function LaporanStatistik() {
  const router = useRouter();
  const [stats, setStats] = useState<LaporanStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  // Filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [semester, setSemester] = useState('all');
  const [prodi, setProdi] = useState('all');
  const [tahunAjaranAktif, setTahunAjaranAktif] = useState('');
  const [prodiList, setProdiList] = useState<any[]>([]);

  // Fetch tahun ajaran aktif on mount
  useEffect(() => {
    fetchTahunAjaranAktif();
    fetchProdiList();
  }, []);

  const fetchProdiList = async () => {
    try {
      const response = await fetch('/api/master-prodi?active_only=true');
      const result = await response.json();
      if (result.success) {
        setProdiList(result.data);
      }
    } catch (error) {
      console.error('Error fetching prodi:', error);
    }
  };

  // Fetch stats when filters change (but only after tahun ajaran is loaded)
  useEffect(() => {
    if (startDate && endDate) {
      fetchStats();
    }
  }, [startDate, endDate, semester, prodi]);

  const fetchTahunAjaranAktif = async () => {
    setIsLoadingSettings(true);
    try {
      const response = await fetch('/api/settings?category=general', {
        credentials: 'include',
      });
      const result = await response.json();

      if (result.success) {
        const tahunAjaranSetting = result.data.find(
          (s: any) => s.setting_key === 'tahun_ajaran_aktif'
        );
        const tanggalMulaiSetting = result.data.find(
          (s: any) => s.setting_key === 'tanggal_mulai_semester'
        );
        const tanggalAkhirSetting = result.data.find(
          (s: any) => s.setting_key === 'tanggal_akhir_semester'
        );

        if (tahunAjaranSetting) {
          setTahunAjaranAktif(tahunAjaranSetting.setting_value);
        }

        // Set default dates from settings or calculate from tahun ajaran
        if (tanggalMulaiSetting && tanggalAkhirSetting) {
          setStartDate(tanggalMulaiSetting.setting_value);
          setEndDate(tanggalAkhirSetting.setting_value);
        } else if (tahunAjaranSetting) {
          // Calculate from tahun ajaran (e.g., "2024/2025" -> 2024-08-01 to 2025-07-31)
          const [startYear, endYear] = tahunAjaranSetting.setting_value.split('/');
          setStartDate(`${startYear}-08-01`);
          setEndDate(`${endYear}-07-31`);
        } else {
          // Fallback to current year
          const currentYear = new Date().getFullYear();
          setStartDate(`${currentYear}-01-01`);
          setEndDate(`${currentYear}-12-31`);
        }
      }
    } catch (error) {
      console.error('Error fetching tahun ajaran:', error);
      // Fallback to current year
      const currentYear = new Date().getFullYear();
      setStartDate(`${currentYear}-01-01`);
      setEndDate(`${currentYear}-12-31`);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (semester !== 'all') params.append('semester', semester);
      if (prodi !== 'all') params.append('prodi', prodi);

      const response = await fetch(`/api/laporan/stats?${params.toString()}`, {
        credentials: 'include',
      });
      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      } else {
        console.error('Error fetching stats:', result.error);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    alert('Download PDF - Coming soon!');
  };

  const handleExportExcel = () => {
    alert('Export Excel - Coming soon!');
  };

  // Calculate percentages for kategori
  const getKategoriPercentages = () => {
    if (!stats || stats.totalPoin === 0) return [];
    
    return Object.entries(stats.kategoriStats).map(([kategori, poin]) => ({
      kategori,
      poin,
      percentage: Math.round((poin / stats.totalPoin) * 100),
    }));
  };

  // Calculate percentages for status
  const getStatusPercentages = () => {
    if (!stats || stats.totalMahasiswa === 0) return [];
    
    const { statusDistribution, totalMahasiswa } = stats;
    return [
      {
        label: '≥300 poin',
        count: statusDistribution.sangat_aktif,
        percentage: Math.round((statusDistribution.sangat_aktif / totalMahasiswa) * 100),
        color: '#0059a8',
      },
      {
        label: '200-299 poin',
        count: statusDistribution.aktif,
        percentage: Math.round((statusDistribution.aktif / totalMahasiswa) * 100),
        color: '#009ee3',
      },
      {
        label: '150-199 poin',
        count: statusDistribution.cukup_aktif,
        percentage: Math.round((statusDistribution.cukup_aktif / totalMahasiswa) * 100),
        color: '#ffd646',
      },
      {
        label: '<150 poin',
        count: statusDistribution.pasif,
        percentage: Math.round((statusDistribution.pasif / totalMahasiswa) * 100),
        color: '#5a7a9b',
      },
    ];
  };

  // Get color for kategori
  const getKategoriColor = (kategori: string) => {
    const colors: Record<string, string> = {
      'Akademik': '#0059a8',
      'Dakwah': '#16a34a',
      'Sosial': '#f97316',
      'Adab': '#9333ea',
      'Pelanggaran': '#dc2626',
    };
    return colors[kategori] || '#5a7a9b';
  };

  if (isLoadingSettings || (isLoading && !stats)) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="px-6 py-5 bg-card border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center size-11 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
                type="button"
              >
                <Icon icon="solar:arrow-left-linear" className="size-6 text-primary" />
              </button>
              <h1 className="text-xl font-bold text-foreground font-heading">Laporan & Statistik</h1>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Icon icon="svg-spinners:ring-resize" className="size-12 text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  const kategoriPercentages = getKategoriPercentages();
  const statusPercentages = getStatusPercentages();
  const maxPoin = stats?.topMahasiswa[0]?.poin || 1;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-4 sm:px-6 py-5 bg-card border-b border-border">
        <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center size-11 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
              type="button"
            >
              <Icon icon="solar:arrow-left-linear" className="size-6 text-primary" />
            </button>
            <h1 className="text-xl font-bold text-foreground font-heading">Laporan & Statistik</h1>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center justify-center size-11 rounded-xl bg-primary hover:bg-primary/90 transition-colors"
            type="button"
          >
            <Icon icon="solar:download-bold" className="size-6 text-primary-foreground" />
          </button>
        </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
        {/* Filter Section */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          <div className="space-y-4">
            {/* Tahun Ajaran Info */}
            {tahunAjaranAktif && (
              <div className="flex items-center gap-2 px-4 py-3 bg-primary/5 rounded-xl border border-primary/20">
                <Icon icon="solar:calendar-bold" className="size-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Tahun Ajaran Aktif</p>
                  <p className="text-sm font-semibold text-foreground">{tahunAjaranAktif}</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Periode Tanggal
                <span className="text-xs text-muted-foreground ml-2">(Otomatis dari tahun ajaran aktif)</span>
              </label>
              <div className="flex gap-3">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm"
                >
                  <option value="all">Semua Semester</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                  <option value="5">Semester 5</option>
                  <option value="6">Semester 6</option>
                  <option value="7">Semester 7</option>
                  <option value="8">Semester 8</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Program Studi</label>
                <select
                  value={prodi}
                  onChange={(e) => setProdi(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm"
                >
                  <option value="all">Semua Prodi</option>
                  {prodiList.map((p) => (
                    <option key={p.id} value={p.nama_prodi}>
                      {p.nama_prodi}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Total Poin per Kategori */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          <h3 className="text-base font-bold text-foreground mb-4 font-heading">
            Total Poin per Kategori
          </h3>
          <div className="flex items-center justify-center py-8">
            <div className="relative size-48">
              <div className="absolute inset-0 rounded-full bg-muted"></div>
              <div className="absolute inset-4 bg-card rounded-full flex items-center justify-center">
                <p className="text-2xl font-bold text-foreground font-heading">
                  {stats?.totalPoin.toLocaleString('id-ID') || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3 mt-4">
            {kategoriPercentages.map((item) => (
              <div key={item.kategori} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    style={{ backgroundColor: getKategoriColor(item.kategori) }}
                    className="size-4 rounded-full"
                  />
                  <p className="text-sm text-foreground">{item.kategori}</p>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {item.poin.toLocaleString('id-ID')} ({item.percentage}%)
                </p>
              </div>
            ))}
            {kategoriPercentages.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Belum ada data</p>
            )}
          </div>
        </div>

        {/* Top 10 Mahasiswa */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          <h3 className="text-base font-bold text-foreground mb-4 font-heading">
            Top 10 Mahasiswa Teraktif
          </h3>
          <div className="space-y-3">
            {stats?.topMahasiswa.slice(0, 10).map((mhs, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-foreground">{mhs.nama}</p>
                  <p className="text-sm font-semibold text-foreground">{mhs.poin} poin</p>
                </div>
                <div className="h-8 bg-muted rounded-lg overflow-hidden">
                  <div
                    style={{ width: `${(mhs.poin / maxPoin) * 100}%` }}
                    className="h-full bg-accent rounded-lg transition-all"
                  />
                </div>
              </div>
            ))}
            {(!stats?.topMahasiswa || stats.topMahasiswa.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">Belum ada data</p>
            )}
          </div>
        </div>

        {/* Status Kelulusan */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          <h3 className="text-base font-bold text-foreground mb-4 font-heading">Status Kelulusan</h3>
          <div className="flex items-center justify-center py-8">
            <div className="relative size-48">
              <div className="absolute inset-0 rounded-full bg-muted"></div>
              <div className="absolute inset-4 bg-card rounded-full flex items-center justify-center">
                <p className="text-2xl font-bold text-foreground font-heading">
                  {stats?.totalMahasiswa.toLocaleString('id-ID') || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3 mt-4">
            {statusPercentages.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    style={{ backgroundColor: item.color }}
                    className="size-4 rounded-full"
                  />
                  <p className="text-sm text-foreground">{item.label}</p>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {item.count} ({item.percentage}%)
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10">
                <Icon icon="solar:chart-bold" className="size-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rata-rata Poin</p>
                <p className="text-2xl font-bold text-foreground font-heading">
                  {stats?.rataRataPoin || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center size-12 rounded-xl bg-secondary/10">
                <Icon icon="solar:calendar-bold" className="size-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kegiatan Terbanyak</p>
                <p className="text-lg font-bold text-foreground font-heading">
                  {stats?.kegiatanTerbanyak || '-'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center size-12 rounded-xl bg-accent/20">
                <Icon icon="solar:medal-star-bold" className="size-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kategori Paling Aktif</p>
                <p className="text-lg font-bold text-foreground font-heading">
                  {stats?.kategoriPalingAktif || '-'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="space-y-3 pb-4">
          <button
            onClick={handleDownloadPDF}
            className="w-full py-4 px-4 bg-destructive text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-destructive/90 transition-colors"
            type="button"
          >
            <Icon icon="solar:document-bold" className="size-5" />
            <span>Download PDF</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="w-full py-4 px-4 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
            type="button"
          >
            <Icon icon="solar:file-bold" className="size-5" />
            <span>Export Excel</span>
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}


