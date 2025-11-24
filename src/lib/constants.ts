/**
 * Application constants
 */

export const APP_NAME = 'SIPMA STIT';
export const APP_DESCRIPTION = 'Sistem Poin Mahasiswa STIT Riyadhusssholihiin';

/**
 * User roles
 */
export const ROLES = {
  MAHASISWA: 'mahasiswa',
  DOSEN_PA: 'dosen_pa',
  MUSYRIF: 'musyrif',
  WAKET3: 'waket3',
  ADMIN: 'admin',
  STAFF: 'staff',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

/**
 * Poin status
 */
export const POIN_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type PoinStatus = typeof POIN_STATUS[keyof typeof POIN_STATUS];

/**
 * Poin jenis
 */
export const POIN_JENIS = {
  POSITIF: 'positif',
  NEGATIF: 'negatif',
} as const;

export type PoinJenis = typeof POIN_JENIS[keyof typeof POIN_JENIS];

/**
 * Status kelulusan
 */
export const STATUS_KELULUSAN = {
  LULUS: 'lulus',
  BELUM_LULUS: 'belum_lulus',
} as const;

export type StatusKelulusan = typeof STATUS_KELULUSAN[keyof typeof STATUS_KELULUSAN];

/**
 * Target poin untuk kelulusan
 */
export const TARGET_POIN_KELULUSAN = 200;

/**
 * File upload limits
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

/**
 * Pagination
 */
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

/**
 * Kategori utama poin
 */
export const KATEGORI_UTAMA = [
  'Akademik',
  'Dakwah',
  'Sosial',
  'Adab',
  'Pelanggaran',
  'Lainnya',
] as const;

export type KategoriUtama = typeof KATEGORI_UTAMA[number];

/**
 * Navigation items for different roles
 */
export const NAVIGATION = {
  mahasiswa: [
    { name: 'Dashboard', href: '/dashboard', icon: 'Home' },
    { name: 'Aktivitas', href: '/aktivitas', icon: 'FileText' },
    { name: 'Leaderboard', href: '/leaderboard', icon: 'Trophy' },
    { name: 'Profile', href: '/profile', icon: 'User' },
  ],
  dosen_pa: [
    { name: 'Dashboard', href: '/dashboard', icon: 'Home' },
    { name: 'Mahasiswa', href: '/mahasiswa', icon: 'Users' },
    { name: 'Verifikasi', href: '/verifikasi', icon: 'CheckCircle' },
    { name: 'Profile', href: '/profile', icon: 'User' },
  ],
  musyrif: [
    { name: 'Dashboard', href: '/dashboard', icon: 'Home' },
    { name: 'Mahasiswa', href: '/mahasiswa', icon: 'Users' },
    { name: 'Verifikasi', href: '/verifikasi', icon: 'CheckCircle' },
    { name: 'Profile', href: '/profile', icon: 'User' },
  ],
  waket3: [
    { name: 'Dashboard', href: '/dashboard', icon: 'Home' },
    { name: 'Mahasiswa', href: '/mahasiswa', icon: 'Users' },
    { name: 'Verifikasi', href: '/verifikasi', icon: 'CheckCircle' },
    { name: 'Kategori', href: '/kategori', icon: 'Tag' },
    { name: 'Profile', href: '/profile', icon: 'User' },
  ],
  admin: [
    { name: 'Dashboard', href: '/dashboard', icon: 'Home' },
    { name: 'Mahasiswa', href: '/mahasiswa', icon: 'Users' },
    { name: 'Verifikasi', href: '/verifikasi', icon: 'CheckCircle' },
    { name: 'Kategori', href: '/kategori', icon: 'Tag' },
    { name: 'Profile', href: '/profile', icon: 'User' },
  ],
} as const;

