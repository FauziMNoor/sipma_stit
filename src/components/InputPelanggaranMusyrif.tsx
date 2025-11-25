'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

interface Mahasiswa {
  id: string;
  nim: string;
  nama: string;
  foto: string | null;
}

interface KategoriPelanggaran {
  id: string;
  kode: string;
  nama: string;
  bobot: number;
  jenis: 'negatif';
  kategori_utama: 'Pelanggaran';
}

export default function InputPelanggaranMusyrif() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mahasiswaList, setMahasiswaList] = useState<Mahasiswa[]>([]);
  const [kategoriList, setKategoriList] = useState<KategoriPelanggaran[]>([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [bukti, setBukti] = useState('');
  const [buktiFile, setBuktiFile] = useState<File | null>(null);
  const [buktiPreview, setBuktiPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchData();
    // Set today as default date
    const today = new Date().toISOString().split('T')[0];
    setTanggal(today);
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth-token');
      
      // Fetch mahasiswa bimbingan
      const mahasiswaRes = await fetch('/api/musyrif/mahasiswa', {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });
      
      if (mahasiswaRes.ok) {
        const result = await mahasiswaRes.json();
        console.log('Mahasiswa data:', result);
        setMahasiswaList(result.data || []);
      } else {
        console.error('Failed to fetch mahasiswa:', mahasiswaRes.status);
      }

      // Fetch kategori pelanggaran
      const kategoriRes = await fetch('/api/kategori-poin?kategori_utama=Pelanggaran', {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });
      
      if (kategoriRes.ok) {
        const result = await kategoriRes.json();
        console.log('Kategori data:', result);
        setKategoriList(result.data || []);
      } else {
        console.error('Failed to fetch kategori:', kategoriRes.status);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran foto maksimal 2MB');
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Tipe file tidak didukung. Gunakan JPG, PNG, atau WEBP');
        return;
      }

      setBuktiFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBuktiPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!buktiFile) return null;

    setIsUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', buktiFile);
      formDataUpload.append('bucket', 'pelanggaran-mahasiswa'); // Use dedicated bucket

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
        credentials: 'include',
      });

      const result = await response.json();
      if (result.success && result.data?.url) {
        console.log('✅ Upload successful:', result.data.url);
        return result.data.url;
      } else {
        console.error('❌ Upload failed:', result);
        const errorMsg = result.details 
          ? `${result.error}\n\n${result.details}` 
          : result.error || 'Gagal mengupload foto';
        alert(errorMsg);
        return null;
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Terjadi kesalahan saat mengupload foto');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMahasiswa || !selectedKategori || !tanggal || !keterangan.trim()) {
      alert('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload photo if exists
      let buktiUrl = null;
      if (buktiFile) {
        buktiUrl = await uploadPhoto();
        if (!buktiUrl && buktiFile) {
          // Upload failed but user had selected a file
          setIsSubmitting(false);
          return;
        }
      }

      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/musyrif/pelanggaran', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          mahasiswa_id: selectedMahasiswa,
          kategori_poin_id: selectedKategori,
          tanggal,
          keterangan,
          bukti: buktiUrl,
        }),
      });

      const result = await response.json();
      console.log('📤 Submit response:', result);

      if (result.success) {
        alert('Pelanggaran berhasil dicatat dan menunggu validasi Waket3');
        // Reset form
        setSelectedMahasiswa('');
        setSelectedKategori('');
        setKeterangan('');
        setBukti('');
        setBuktiFile(null);
        setBuktiPreview(null);
        const today = new Date().toISOString().split('T')[0];
        setTanggal(today);
      } else {
        console.error('❌ Submit failed:', result);
        const errorMsg = result.details 
          ? `${result.error}\n\nDetail: ${result.details}` 
          : result.error || 'Gagal mencatat pelanggaran';
        alert(errorMsg);
      }
    } catch (error) {
      console.error('❌ Error submitting pelanggaran:', error);
      alert('Terjadi kesalahan saat mencatat pelanggaran');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="px-4 sm:px-6 py-5 bg-primary">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-1">
              <button className="flex items-center justify-center size-10 sm:size-11">
                <Icon icon="solar:arrow-left-linear" className="size-5 sm:size-6 text-white" />
              </button>
              <h1 className="text-base sm:text-lg font-bold text-white font-heading">Input Pelanggaran</h1>
              <div className="size-10 sm:size-11" />
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Icon icon="svg-spinners:ring-resize" className="size-12 text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  const selectedMahasiswaData = mahasiswaList.find(m => m.id === selectedMahasiswa);
  const selectedKategoriData = kategoriList.find(k => k.id === selectedKategori);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-4 sm:px-6 py-5 bg-primary">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-1">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center size-10 sm:size-11 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Icon icon="solar:arrow-left-linear" className="size-5 sm:size-6 text-white" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-white font-heading">Input Pelanggaran</h1>
            <div className="size-10 sm:size-11" />
          </div>
          <p className="text-xs sm:text-sm text-white/80 text-center">
            Catat pelanggaran mahasiswa untuk validasi Waket3
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Info Alert */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Icon icon="solar:info-circle-bold" className="size-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-orange-900">Catatan Penting</p>
                <p className="text-xs text-orange-700 mt-1">
                  Pelanggaran yang Anda catat akan menunggu validasi dari Wakil Ketua III sebelum poin dikurangkan.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Pilih Mahasiswa */}
            <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
              <label className="block text-sm font-semibold text-foreground mb-3">
                Pilih Mahasiswa <span className="text-destructive">*</span>
              </label>
              {mahasiswaList.length === 0 ? (
                <div className="p-4 bg-muted rounded-lg text-center">
                  <Icon icon="solar:users-group-rounded-bold" className="size-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Tidak ada data mahasiswa</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Hubungi admin untuk menambahkan mahasiswa
                  </p>
                </div>
              ) : (
                <select
                  value={selectedMahasiswa}
                  onChange={(e) => setSelectedMahasiswa(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm"
                  required
                >
                  <option value="">-- Pilih Mahasiswa ({mahasiswaList.length} mahasiswa) --</option>
                  {mahasiswaList.map((mhs) => (
                    <option key={mhs.id} value={mhs.id}>
                      {mhs.nim} - {mhs.nama}
                    </option>
                  ))}
                </select>
              )}
              {selectedMahasiswaData && (
                <div className="mt-3 flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <img
                    src={selectedMahasiswaData.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMahasiswaData.nama)}`}
                    alt={selectedMahasiswaData.nama}
                    className="size-10 rounded-full object-cover border-2 border-border"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{selectedMahasiswaData.nama}</p>
                    <p className="text-xs text-muted-foreground">{selectedMahasiswaData.nim}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Kategori Pelanggaran */}
            <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
              <label className="block text-sm font-semibold text-foreground mb-3">
                Kategori Pelanggaran <span className="text-destructive">*</span>
              </label>
              {kategoriList.length === 0 ? (
                <div className="p-4 bg-muted rounded-lg text-center">
                  <Icon icon="solar:danger-triangle-bold" className="size-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Tidak ada kategori pelanggaran</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Hubungi admin untuk menambahkan kategori
                  </p>
                </div>
              ) : (
                <select
                  value={selectedKategori}
                  onChange={(e) => setSelectedKategori(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm"
                  required
                >
                  <option value="">-- Pilih Kategori Pelanggaran ({kategoriList.length} kategori) --</option>
                  {kategoriList.map((kat) => (
                    <option key={kat.id} value={kat.id}>
                      {kat.nama} ({kat.bobot} poin)
                    </option>
                  ))}
                </select>
              )}
              {selectedKategoriData && (
                <div className="mt-3 p-3 bg-destructive/10 rounded-lg border border-destructive/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-destructive">{selectedKategoriData.nama}</p>
                      <p className="text-xs text-muted-foreground mt-1">Poin Negatif</p>
                    </div>
                    <p className="text-xl font-bold text-destructive">{selectedKategoriData.bobot}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Tanggal */}
            <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
              <label className="block text-sm font-semibold text-foreground mb-3">
                Tanggal Pelanggaran <span className="text-destructive">*</span>
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm"
                required
              />
            </div>

            {/* Keterangan */}
            <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
              <label className="block text-sm font-semibold text-foreground mb-3">
                Keterangan Pelanggaran <span className="text-destructive">*</span>
              </label>
              <textarea
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm resize-none"
                rows={4}
                placeholder="Jelaskan detail pelanggaran yang dilakukan..."
                required
              />
              <p className="text-xs text-muted-foreground mt-2">
                {keterangan.length} karakter
              </p>
            </div>

            {/* Bukti Foto (Optional) */}
            <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
              <label className="block text-sm font-semibold text-foreground mb-3">
                Foto Bukti (Opsional)
              </label>
              
              {buktiPreview ? (
                <div className="space-y-3">
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted border border-border">
                    <img
                      src={buktiPreview}
                      alt="Preview bukti"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setBuktiFile(null);
                      setBuktiPreview(null);
                    }}
                    className="w-full py-2 px-4 rounded-lg bg-destructive/10 text-destructive text-sm font-semibold hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon icon="solar:trash-bin-trash-bold" className="size-4" />
                    Hapus Foto
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="bukti-upload"
                  />
                  <label
                    htmlFor="bukti-upload"
                    className="flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <Icon icon="solar:gallery-add-bold" className="size-12 text-muted-foreground mb-2" />
                    <p className="text-sm font-semibold text-foreground">Upload Foto Bukti</p>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG, atau WEBP (Max 2MB)</p>
                  </label>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground mt-2">
                Upload foto bukti pelanggaran jika ada
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 px-4 rounded-xl bg-muted text-foreground font-semibold hover:bg-muted/80 transition-colors"
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploading || mahasiswaList.length === 0 || kategoriList.length === 0}
                className="flex-1 py-3 px-4 rounded-xl bg-destructive text-white font-semibold hover:bg-destructive/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting || isUploading ? (
                  <>
                    <Icon icon="svg-spinners:ring-resize" className="size-5" />
                    {isUploading ? 'Mengupload foto...' : 'Menyimpan...'}
                  </>
                ) : (
                  <>
                    <Icon icon="solar:danger-triangle-bold" className="size-5" />
                    Catat Pelanggaran
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
