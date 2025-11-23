'use client';

import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

interface KategoriPoin {
  id: string;
  kode: string;
  nama: string;
  kategori_utama: string;
  bobot: number;
  jenis: string;
}

export default function InputKegiatan() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kategoriList, setKategoriList] = useState<KategoriPoin[]>([]);
  const [kategoriUtamaList, setKategoriUtamaList] = useState<string[]>([]);
  const [selectedKategoriUtama, setSelectedKategoriUtama] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchKategori();
  }, []);

  const fetchKategori = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('kategori_poin')
        .select('id, kode, nama, kategori_utama, bobot, jenis')
        .eq('jenis', 'positif')
        .eq('is_active', true)
        .order('kategori_utama', { ascending: true })
        .order('nama', { ascending: true });

      if (error) {
        console.error('Error fetching kategori:', error);
        alert('Gagal memuat kategori: ' + error.message);
      } else {
        console.log('📊 Kategori data:', data);
        setKategoriList(data || []);

        // Extract unique kategori_utama
        const uniqueKategoriUtama = Array.from(
          new Set(data?.map((item) => item.kategori_utama) || [])
        ).filter(Boolean) as string[];
        console.log('📊 Unique kategori utama:', uniqueKategoriUtama);
        setKategoriUtamaList(uniqueKategoriUtama);
      }
    } catch (error) {
      console.error('Error fetching kategori:', error);
      alert('Terjadi kesalahan saat memuat kategori');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!selectedPhoto) return null;

    try {
      const fileExt = selectedPhoto.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName; // Langsung di root bucket, tidak perlu subfolder

      const { data, error } = await supabase.storage
        .from('bukti-kegiatan')
        .upload(filePath, selectedPhoto);

      if (error) {
        console.error('Error uploading photo:', error);
        alert('Gagal mengupload foto: ' + error.message);
        return null;
      }

      const { data: publicUrlData } = supabase.storage
        .from('bukti-kegiatan')
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Terjadi kesalahan saat mengupload foto');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert('Anda harus login terlebih dahulu');
      return;
    }

    if (!selectedKategori) {
      alert('Pilih kategori kegiatan');
      return;
    }

    if (!tanggal) {
      alert('Pilih tanggal kegiatan');
      return;
    }

    if (!keterangan.trim()) {
      alert('Masukkan keterangan kegiatan');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload photo if selected
      let buktiUrl = null;
      if (selectedPhoto) {
        buktiUrl = await uploadPhoto();
        if (!buktiUrl) {
          setIsSubmitting(false);
          return;
        }
      }

      // Submit kegiatan
      const response = await fetch('/api/mahasiswa/kegiatan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          kategori_poin_id: selectedKategori,
          tanggal,
          keterangan,
          bukti: buktiUrl,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Kegiatan berhasil diajukan! Menunggu verifikasi.');
        router.push('/mahasiswa/dashboard');
      } else {
        alert('Gagal mengajukan kegiatan: ' + result.error);
      }
    } catch (error) {
      console.error('Error submitting kegiatan:', error);
      alert('Terjadi kesalahan saat mengajukan kegiatan');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter kategori by selected kategori_utama
  const filteredKategori = selectedKategoriUtama
    ? kategoriList.filter((item) => item.kategori_utama === selectedKategoriUtama)
    : [];

  // Reset selected kategori when kategori_utama changes
  const handleKategoriUtamaChange = (value: string) => {
    setSelectedKategoriUtama(value);
    setSelectedKategori(''); // Reset kategori selection
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 bg-card border-b border-border">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center size-11"
          type="button"
        >
          <Icon icon="solar:arrow-left-linear" className="size-6 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold font-heading text-foreground">Input Kegiatan</h1>
        <div className="size-11" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-5">
          {/* Kategori Utama */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Kategori Utama
            </label>
            <select
              value={selectedKategoriUtama}
              onChange={(e) => handleKategoriUtamaChange(e.target.value)}
              className="w-full px-4 py-4 rounded-xl bg-input text-foreground border border-border shadow-sm"
              required
            >
              <option value="">Pilih Kategori Utama</option>
              {kategoriUtamaList.map((kategori) => (
                <option key={kategori} value={kategori}>
                  {kategori}
                </option>
              ))}
            </select>
          </div>

          {/* Nama Kegiatan */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Nama Kegiatan
            </label>
            <select
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="w-full px-4 py-4 rounded-xl bg-input text-foreground border border-border shadow-sm"
              required
              disabled={!selectedKategoriUtama}
            >
              <option value="">
                {selectedKategoriUtama ? 'Pilih Nama Kegiatan' : 'Pilih Kategori Utama Dulu'}
              </option>
              {filteredKategori.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama} (+{item.bobot} poin)
                </option>
              ))}
            </select>
            {!selectedKategoriUtama && (
              <p className="text-xs text-muted-foreground mt-2">
                * Pilih kategori utama terlebih dahulu
              </p>
            )}
          </div>

          {/* Tanggal Kegiatan */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Tanggal Kegiatan
            </label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full px-4 py-4 rounded-xl bg-input text-foreground border border-border shadow-sm"
              required
            />
          </div>

          {/* Foto Bukti */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Foto Bukti</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="block w-full rounded-xl border-2 border-dashed border-border bg-input shadow-sm cursor-pointer hover:bg-muted/50 transition-colors"
            >
              {photoPreview ? (
                <div className="relative w-full h-48">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-semibold">Klik untuk ganti foto</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <div className="flex items-center justify-center size-16 rounded-full bg-muted mb-3">
                    <Icon icon="solar:camera-bold" className="size-8 text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">Upload Foto Bukti</p>
                  <p className="text-xs text-muted-foreground mt-1">Tap untuk memilih foto</p>
                </div>
              )}
            </label>
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Keterangan Kegiatan
            </label>
            <textarea
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              rows={4}
              className="w-full px-4 py-4 rounded-xl bg-input text-foreground border border-border shadow-sm resize-none"
              placeholder="Tulis keterangan kegiatan..."
              required
            />
          </div>
        </div>
      </form>

      {/* Submit Button */}
      <div className="px-6 py-6 bg-card border-t border-border">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-5 px-6 rounded-2xl font-semibold text-lg shadow-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Icon icon="svg-spinners:ring-resize" className="size-5" />
              Mengirim...
            </span>
          ) : (
            <span>Kirim untuk Verifikasi</span>
          )}
        </button>
      </div>
    </div>
  );
}

