/**
 * Core types for SIPMA application
 */

export type UserRole = 'mahasiswa' | 'dosen_pa' | 'musyrif' | 'waket3' | 'admin' | 'staff';
export type PoinStatus = 'pending' | 'approved' | 'rejected';
export type PoinJenis = 'positif' | 'negatif';
export type StatusKelulusan = 'lulus' | 'belum_lulus';

/**
 * User type
 */
export interface User {
  id: string;
  email: string;
  nama: string;
  nip: string | null;
  role: UserRole;
  foto: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Mahasiswa type
 */
export interface Mahasiswa {
  id: string;
  user_id: string | null;
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
  foto: string | null;
  wali_dosen_id: string | null;
  musyrif_id: string | null;
  dosen_pa_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  user?: User;
  wali_dosen?: User;
  musyrif?: User;
  dosen_pa?: User;
  poin_summary?: PoinSummary;
}

/**
 * Kategori Poin type
 */
export interface KategoriPoin {
  id: string;
  kode: string;
  nama: string;
  jenis: PoinJenis;
  bobot: number;
  deskripsi: string | null;
  kategori_utama: string | null;
  requires_verification: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Poin Aktivitas type
 */
export interface PoinAktivitas {
  id: string;
  mahasiswa_id: string;
  kategori_id: string;
  bukti: string | null;
  tanggal: string;
  deskripsi_kegiatan: string | null;
  status: PoinStatus;
  verifikator_id: string | null;
  notes_verifikator: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  mahasiswa?: Mahasiswa;
  kategori?: KategoriPoin;
  verifikator?: User;
}

/**
 * Poin Summary type
 */
export interface PoinSummary {
  mahasiswa_id: string;
  total_poin_positif: number;
  total_poin_negatif: number;
  total_poin: number;
  status_kelulusan: StatusKelulusan;
  last_updated: string;
  // Relations
  mahasiswa?: Mahasiswa;
}

/**
 * API Response types
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Dashboard stats type
 */
export interface DashboardStats {
  total_poin: number;
  total_poin_positif: number;
  total_poin_negatif: number;
  status_kelulusan: StatusKelulusan;
  progress_percentage: number;
  recent_aktivitas: PoinAktivitas[];
  monthly_chart_data: {
    month: string;
    poin: number;
  }[];
}

/**
 * Leaderboard entry type
 */
export interface LeaderboardEntry {
  rank: number;
  mahasiswa: Mahasiswa;
  total_poin: number;
  total_aktivitas: number;
}

/**
 * Filter types
 */
export interface AktivitasFilter {
  status?: PoinStatus;
  kategori_id?: string;
  mahasiswa_id?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  pageSize?: number;
}

export interface LeaderboardFilter {
  angkatan?: number;
  prodi?: string;
  periode?: 'all' | 'month' | 'semester' | 'year';
  limit?: number;
}

