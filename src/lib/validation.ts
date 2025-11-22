import { z } from 'zod';

/**
 * Login validation schema
 */
export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Aktivitas validation schema
 */
export const aktivitasSchema = z.object({
  kategori_id: z.string().uuid('Kategori ID tidak valid'),
  tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
  deskripsi_kegiatan: z.string().min(10, 'Deskripsi minimal 10 karakter').max(500, 'Deskripsi maksimal 500 karakter'),
  bukti: z.string().url('URL bukti tidak valid').optional(),
});

export type AktivitasInput = z.infer<typeof aktivitasSchema>;

/**
 * Verifikasi validation schema
 */
export const verifikasiSchema = z.object({
  status: z.enum(['approved', 'rejected'], {
    errorMap: () => ({ message: 'Status harus approved atau rejected' }),
  }),
  notes_verifikator: z.string().max(500, 'Catatan maksimal 500 karakter').optional(),
});

export type VerifikasiInput = z.infer<typeof verifikasiSchema>;

/**
 * Kategori Poin validation schema
 */
export const kategoriPoinSchema = z.object({
  kode: z.string().min(3, 'Kode minimal 3 karakter').max(10, 'Kode maksimal 10 karakter'),
  nama: z.string().min(3, 'Nama minimal 3 karakter').max(100, 'Nama maksimal 100 karakter'),
  jenis: z.enum(['positif', 'negatif'], {
    errorMap: () => ({ message: 'Jenis harus positif atau negatif' }),
  }),
  bobot: z.number().int('Bobot harus bilangan bulat').min(1, 'Bobot minimal 1'),
  deskripsi: z.string().max(500, 'Deskripsi maksimal 500 karakter').optional(),
  kategori_utama: z.string().max(50, 'Kategori utama maksimal 50 karakter').optional(),
  requires_verification: z.boolean().default(true),
});

export type KategoriPoinInput = z.infer<typeof kategoriPoinSchema>;

/**
 * Mahasiswa validation schema
 */
export const mahasiswaSchema = z.object({
  nim: z.string().min(5, 'NIM minimal 5 karakter').max(20, 'NIM maksimal 20 karakter'),
  nama: z.string().min(3, 'Nama minimal 3 karakter').max(100, 'Nama maksimal 100 karakter'),
  prodi: z.string().min(3, 'Prodi minimal 3 karakter').max(100, 'Prodi maksimal 100 karakter'),
  angkatan: z.number().int('Angkatan harus bilangan bulat').min(2000, 'Angkatan minimal 2000').max(2100, 'Angkatan maksimal 2100'),
  wali_dosen_id: z.string().uuid('Wali dosen ID tidak valid').optional(),
  musyrif_id: z.string().uuid('Musyrif ID tidak valid').optional(),
});

export type MahasiswaInput = z.infer<typeof mahasiswaSchema>;

/**
 * File upload validation
 */
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: 'File harus berupa File object' }),
  maxSize: z.number().default(5 * 1024 * 1024), // 5MB default
  allowedTypes: z.array(z.string()).default(['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']),
});

/**
 * Validate file upload
 */
export function validateFileUpload(file: File, maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']) {
  if (file.size > maxSize) {
    throw new Error(`Ukuran file maksimal ${maxSize / 1024 / 1024}MB`);
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Tipe file harus salah satu dari: ${allowedTypes.join(', ')}`);
  }
  
  return true;
}

