-- ============================================
-- INSERT DATA KATEGORI POIN
-- Berdasarkan Briefing Klien STIT Riyadhussholihiin
-- ============================================

-- Clear existing data (optional, hati-hati di production!)
-- DELETE FROM kategori_poin;

-- ============================================
-- A. AKADEMIK DAN INTELEKTUAL (🟩 Hijau)
-- ============================================

INSERT INTO kategori_poin (kode, nama, jenis, bobot, deskripsi, kategori_utama, requires_verification, is_active) VALUES
('AKA01', 'Mengikuti Kuliah 100% per Semester', 'positif', 10, 'Kehadiran kuliah 100% dalam satu semester', 'Akademik', true, true),
('AKA02', 'Menjadi Asisten Dosen / Tutor', 'positif', 15, 'Membantu dosen sebagai asisten atau tutor', 'Akademik', true, true),
('AKA03', 'Mengikuti Seminar, Workshop, atau Konferensi', 'positif', 10, 'Partisipasi dalam seminar/workshop/konferensi', 'Akademik', true, true),
('AKA04', 'Menulis Artikel / Jurnal Ilmiah', 'positif', 20, 'Menulis dan mempublikasikan artikel ilmiah', 'Akademik', true, true),
('AKA05', 'Menjadi Pemakalah atau Presenter di Acara Ilmiah', 'positif', 25, 'Presentasi di seminar/konferensi ilmiah', 'Akademik', true, true),
('AKA06', 'Mengikuti Lomba Karya Tulis (Peserta)', 'positif', 15, 'Partisipasi dalam lomba karya tulis ilmiah', 'Akademik', true, true),
('AKA07', 'Juara Lomba Karya Tulis / Olimpiade / Debat', 'positif', 30, 'Menjadi juara dalam kompetisi akademik', 'Akademik', true, true);

-- ============================================
-- B. DAKWAH DAN KEAGAMAAN (🟦 Biru)
-- ============================================

INSERT INTO kategori_poin (kode, nama, jenis, bobot, deskripsi, kategori_utama, requires_verification, is_active) VALUES
('DAU01', 'Mengikuti Kajian Kampus / Halaqah Rutin', 'positif', 5, 'Menghadiri kajian atau halaqah rutin kampus', 'Dakwah', true, true),
('DAU02', 'Menjadi Imam Shalat', 'positif', 10, 'Menjadi imam shalat berjamaah', 'Dakwah', true, true),
('DAU03', 'Menjadi Muadzin', 'positif', 10, 'Menjadi muadzin untuk adzan', 'Dakwah', true, true),
('DAU04', 'Menjadi Khatib Jumat', 'positif', 10, 'Menyampaikan khutbah Jumat', 'Dakwah', true, true),
('DAU05', 'Mengajar TPA / Mengisi Majelis Taklim', 'positif', 15, 'Mengajar di TPA atau mengisi majelis taklim', 'Dakwah', true, true),
('DAU06', 'Mengikuti Daurah Ilmiah Luar Kampus', 'positif', 10, 'Partisipasi dalam daurah ilmiah di luar kampus', 'Dakwah', true, true),
('DAU07', 'Hafalan Al-Quran (per Juz)', 'positif', 10, 'Setoran hafalan Al-Quran per juz', 'Dakwah', true, true),
('DAU08', 'Menginisiasi Kegiatan Dakwah Kampus', 'positif', 20, 'Memprakarsai dan menyelenggarakan kegiatan dakwah', 'Dakwah', true, true);

-- ============================================
-- C. SOSIAL DAN KEPEMIMPINAN (🟨 Kuning/Orange)
-- ============================================

INSERT INTO kategori_poin (kode, nama, jenis, bobot, deskripsi, kategori_utama, requires_verification, is_active) VALUES
('SOS01', 'Menjadi Pengurus DEMA/UKM (per Tahun)', 'positif', 20, 'Aktif sebagai pengurus organisasi mahasiswa', 'Sosial', true, true),
('SOS02', 'Menjadi Panitia Kegiatan Kampus', 'positif', 10, 'Terlibat sebagai panitia dalam kegiatan kampus', 'Sosial', true, true),
('SOS03', 'Menjadi Panitia Bakti Sosial', 'positif', 10, 'Terlibat dalam kepanitiaan bakti sosial', 'Sosial', true, true),
('SOS04', 'Mengikuti KKN (Kuliah Kerja Nyata)', 'positif', 15, 'Partisipasi dalam program KKN', 'Sosial', true, true),
('SOS05', 'Mengikuti Kegiatan Khitan Massal / Daksos', 'positif', 15, 'Partisipasi dalam kegiatan sosial kemasyarakatan', 'Sosial', true, true),
('SOS06', 'Membantu Administrasi Lembaga / Pelayanan Mahasiswa', 'positif', 10, 'Membantu administrasi kampus atau pelayanan mahasiswa', 'Sosial', true, true);

-- ============================================
-- D. ADAB, AKHLAK, DAN KETELADANAN (🟪 Ungu)
-- ============================================

INSERT INTO kategori_poin (kode, nama, jenis, bobot, deskripsi, kategori_utama, requires_verification, is_active) VALUES
('ADB01', 'Disiplin Waktu Shalat Berjamaah (per Bulan)', 'positif', 5, 'Konsisten shalat berjamaah selama satu bulan', 'Adab', true, true),
('ADB02', 'Disiplin Waktu Kuliah (per Bulan)', 'positif', 5, 'Tidak pernah terlambat kuliah selama satu bulan', 'Adab', true, true),
('ADB03', 'Mendapat Laporan Akhlak Baik dari Musyrif', 'positif', 10, 'Penilaian akhlak baik dari musyrif/pembina', 'Adab', true, true),
('ADB04', 'Menolong Sesama Mahasiswa / Berinisiatif Positif', 'positif', 5, 'Tindakan menolong atau inisiatif positif', 'Adab', true, true),
('ADB05', 'Tidak Pernah Terlambat / Melanggar Aturan Asrama (per Bulan)', 'positif', 10, 'Kepatuhan penuh terhadap aturan asrama', 'Adab', true, true);

-- ============================================
-- E. PELANGGARAN (🟥 Merah) - POIN NEGATIF
-- ============================================

INSERT INTO kategori_poin (kode, nama, jenis, bobot, deskripsi, kategori_utama, requires_verification, is_active) VALUES
('PLG01', 'Terlambat Hadir Tanpa Izin', 'negatif', 5, 'Keterlambatan hadir tanpa keterangan yang sah', 'Pelanggaran', false, true),
('PLG02', 'Tidak Ikut Kegiatan Wajib', 'negatif', 10, 'Tidak menghadiri kegiatan yang diwajibkan', 'Pelanggaran', false, true),
('PLG03', 'Melanggar Adab Berpakaian / Ikhtilat', 'negatif', 25, 'Pelanggaran aturan berpakaian atau ikhtilat', 'Pelanggaran', false, true),
('PLG04', 'Tidak Shalat Berjamaah (Tanpa Udzur)', 'negatif', 10, 'Meninggalkan shalat berjamaah tanpa alasan syar''i', 'Pelanggaran', false, true),
('PLG05', 'Melawan Pengurus / Dosen', 'negatif', 50, 'Sikap melawan atau tidak hormat kepada pengurus/dosen', 'Pelanggaran', true, true),
('PLG06', 'Pelanggaran Berat (Maksiat, Penipuan, dll)', 'negatif', 100, 'Pelanggaran kategori berat seperti maksiat atau penipuan', 'Pelanggaran', true, true);

-- ============================================
-- SUMMARY
-- ============================================
-- Total Kategori: 32 kegiatan
-- - Akademik: 7 kegiatan
-- - Dakwah: 8 kegiatan
-- - Sosial: 6 kegiatan
-- - Adab: 5 kegiatan
-- - Pelanggaran: 6 kegiatan
-- ============================================

