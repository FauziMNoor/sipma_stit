'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

interface KategoriPoin {
  id: string;
  kode: string;
  nama: string;
  jenis: 'positif' | 'negatif';
  bobot: number;
  deskripsi: string | null;
  kategori_utama: string | null;
  requires_verification: boolean;
  is_active: boolean;
}

const KATEGORI_UTAMA = ['Semua', 'Akademik', 'Dakwah', 'Sosial', 'Adab', 'Pelanggaran'];

const KATEGORI_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  Akademik: { bg: 'bg-primary/10', text: 'text-primary', icon: 'solar:book-bold' },
  Dakwah: { bg: 'bg-green-600/10', text: 'text-green-600', icon: 'solar:book-2-bold' },
  Sosial: { bg: 'bg-orange-500/10', text: 'text-orange-500', icon: 'solar:hand-heart-bold' },
  Adab: { bg: 'bg-purple-600/10', text: 'text-purple-600', icon: 'solar:star-bold' },
  Pelanggaran: { bg: 'bg-red-600/10', text: 'text-red-600', icon: 'solar:danger-bold' },
};

export default function KelolaKegiatan() {
  const router = useRouter();
  const [kegiatan, setKegiatan] = useState<KategoriPoin[]>([]);
  const [filteredKegiatan, setFilteredKegiatan] = useState<KategoriPoin[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingKegiatan, setEditingKegiatan] = useState<KategoriPoin | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    kode: '',
    nama: '',
    jenis: 'positif' as 'positif' | 'negatif',
    bobot: 0,
    deskripsi: '',
    kategori_utama: 'Akademik',
    requires_verification: true,
  });

  useEffect(() => {
    fetchKegiatan();
  }, []);

  useEffect(() => {
    filterKegiatan();
  }, [kegiatan, searchQuery, selectedKategori]);

  const fetchKegiatan = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/kategori-poin', {
        credentials: 'include',
      });
      const result = await response.json();
      if (result.success) {
        setKegiatan(result.data);
      } else {
        console.error('Error fetching kegiatan:', result.error);
      }
    } catch (error) {
      console.error('Error fetching kegiatan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterKegiatan = () => {
    let filtered = kegiatan;

    // Filter by kategori
    if (selectedKategori !== 'Semua') {
      filtered = filtered.filter((k) => k.kategori_utama === selectedKategori);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((k) =>
        k.nama.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredKegiatan(filtered);
  };

  const handleAddKegiatan = () => {
    setFormData({
      kode: '',
      nama: '',
      jenis: 'positif',
      bobot: 0,
      deskripsi: '',
      kategori_utama: 'Akademik',
      requires_verification: true,
    });
    setShowAddModal(true);
  };

  const handleEditKegiatan = (kegiatan: KategoriPoin) => {
    setEditingKegiatan(kegiatan);
    setFormData({
      kode: kegiatan.kode,
      nama: kegiatan.nama,
      jenis: kegiatan.jenis,
      bobot: kegiatan.bobot,
      deskripsi: kegiatan.deskripsi || '',
      kategori_utama: kegiatan.kategori_utama || 'Akademik',
      requires_verification: kegiatan.requires_verification,
    });
    setShowEditModal(true);
  };

  const handleDeleteKegiatan = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/kategori-poin/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const result = await response.json();
      if (result.success) {
        alert('Kegiatan berhasil dihapus');
        fetchKegiatan();
      } else {
        alert(result.error || 'Gagal menghapus kegiatan');
      }
    } catch (error) {
      console.error('Error deleting kegiatan:', error);
      alert('Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitAdd = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/kategori-poin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        alert('Kegiatan berhasil ditambahkan');
        setShowAddModal(false);
        setFormData({
          kode: '',
          nama: '',
          jenis: 'positif',
          bobot: 0,
          deskripsi: '',
          kategori_utama: 'Akademik',
          requires_verification: true,
        });
        fetchKegiatan();
      } else {
        alert(result.error || 'Gagal menambahkan kegiatan');
      }
    } catch (error) {
      console.error('Error adding kegiatan:', error);
      alert('Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitEdit = async () => {
    if (!editingKegiatan) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/kategori-poin/${editingKegiatan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        alert('Kegiatan berhasil diupdate');
        setShowEditModal(false);
        setEditingKegiatan(null);
        fetchKegiatan();
      } else {
        alert(result.error || 'Gagal mengupdate kegiatan');
      }
    } catch (error) {
      console.error('Error updating kegiatan:', error);
      alert('Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getKategoriStyle = (kategori: string | null) => {
    return KATEGORI_COLORS[kategori || 'Akademik'] || KATEGORI_COLORS.Akademik;
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-4 sm:px-6 py-5 bg-card border-b border-border">
        <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center size-10 sm:size-11 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer"
              type="button"
            >
              <Icon icon="solar:arrow-left-linear" className="size-5 sm:size-6 text-primary" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-foreground font-heading">
              Kelola Kegiatan & Kategori
            </h1>
          </div>
        </div>
        <button
          onClick={handleAddKegiatan}
          className="w-full py-2.5 sm:py-3 px-4 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <Icon icon="solar:add-circle-bold" className="size-5" />Tambah Kegiatan
        </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 sm:px-6 py-4 bg-card border-b border-border">
        <div className="max-w-3xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-11 rounded-xl border border-border bg-input"
            placeholder="Cari kegiatan..."
          />
          <Icon
            icon="solar:magnifer-linear"
            className="size-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2"
          />
        </div>
        </div>
      </div>

      {/* Filter Kategori */}
      <div className="bg-card border-b border-border overflow-x-auto">
        <div className="max-w-3xl mx-auto">
        <div className="flex px-4 sm:px-6 gap-3 sm:gap-4 py-4">
          {KATEGORI_UTAMA.map((kategori) => (
            <button
              key={kategori}
              onClick={() => setSelectedKategori(kategori)}
              className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap ${
                selectedKategori === kategori
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground'
              }`}
            >
              {kategori}
            </button>
          ))}
        </div>
        </div>
      </div>

      {/* List Kegiatan */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Icon icon="svg-spinners:ring-resize" className="size-8 text-primary" />
          </div>
        ) : filteredKegiatan.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Tidak ada kegiatan ditemukan</p>
          </div>
        ) : (
          filteredKegiatan.map((item) => {
            const style = getKategoriStyle(item.kategori_utama);
            return (
              <div key={item.id} className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border border-border">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`flex items-center justify-center size-12 sm:size-14 rounded-xl ${style.bg} flex-shrink-0`}>
                    <Icon icon={style.icon} className={`size-6 sm:size-7 ${style.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-semibold text-foreground mb-1 truncate">{item.nama}</p>
                    <span
                      className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full ${style.bg} ${style.text}`}
                    >
                      {item.kategori_utama || 'Lainnya'}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Poin</p>
                    <p
                      className={`text-xl sm:text-2xl font-bold font-heading ${
                        item.jenis === 'negatif' ? 'text-destructive' : 'text-accent'
                      }`}
                    >
                      {item.jenis === 'negatif' ? '-' : ''}
                      {item.bobot}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border">
                  <button
                    onClick={() => handleEditKegiatan(item)}
                    className="flex-1 py-2 px-3 sm:px-4 bg-secondary/10 text-secondary rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold flex items-center justify-center gap-1.5 sm:gap-2"
                  >
                    <Icon icon="solar:pen-bold" className="size-4 sm:size-5" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteKegiatan(item.id)}
                    disabled={isSubmitting}
                    className="flex-1 py-2 px-3 sm:px-4 bg-destructive/10 text-destructive rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Icon icon="svg-spinners:ring-resize" className="size-4 sm:size-5" />
                    ) : (
                      <Icon icon="solar:trash-bin-trash-bold" className="size-4 sm:size-5" />
                    )}
                    <span className="hidden sm:inline">Hapus</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
        </div>
      </div>

      {/* Modal Tambah Kegiatan */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-foreground mb-4 font-heading">Tambah Kegiatan</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Kode</label>
                <input
                  type="text"
                  value={formData.kode}
                  onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-input"
                  placeholder="Contoh: AKD001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nama Kegiatan</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-input"
                  placeholder="Contoh: Seminar Nasional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Kategori Utama</label>
                <select
                  value={formData.kategori_utama}
                  onChange={(e) => setFormData({ ...formData, kategori_utama: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-input"
                >
                  {KATEGORI_UTAMA.filter((k) => k !== 'Semua').map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Jenis</label>
                <select
                  value={formData.jenis}
                  onChange={(e) =>
                    setFormData({ ...formData, jenis: e.target.value as 'positif' | 'negatif' })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-border bg-input"
                >
                  <option value="positif">Positif</option>
                  <option value="negatif">Negatif (Pelanggaran)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bobot Poin</label>
                <input
                  type="number"
                  value={formData.bobot}
                  onChange={(e) => setFormData({ ...formData, bobot: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-input"
                  placeholder="Contoh: 50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Deskripsi (Opsional)</label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-input"
                  rows={3}
                  placeholder="Deskripsi kegiatan..."
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="requires_verification"
                  checked={formData.requires_verification}
                  onChange={(e) =>
                    setFormData({ ...formData, requires_verification: e.target.checked })
                  }
                  className="size-4 rounded border-border"
                />
                <label htmlFor="requires_verification" className="text-sm">
                  Memerlukan verifikasi
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                disabled={isSubmitting}
                className="flex-1 py-2 px-4 bg-muted text-foreground rounded-xl font-semibold disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={submitAdd}
                disabled={isSubmitting}
                className="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Icon icon="svg-spinners:ring-resize" className="size-5" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Kegiatan */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-foreground mb-4 font-heading">Edit Kegiatan</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Kode</label>
                <input
                  type="text"
                  value={formData.kode}
                  onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nama Kegiatan</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Kategori Utama</label>
                <select
                  value={formData.kategori_utama}
                  onChange={(e) => setFormData({ ...formData, kategori_utama: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-input"
                >
                  {KATEGORI_UTAMA.filter((k) => k !== 'Semua').map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Jenis</label>
                <select
                  value={formData.jenis}
                  onChange={(e) =>
                    setFormData({ ...formData, jenis: e.target.value as 'positif' | 'negatif' })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-border bg-input"
                >
                  <option value="positif">Positif</option>
                  <option value="negatif">Negatif (Pelanggaran)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bobot Poin</label>
                <input
                  type="number"
                  value={formData.bobot}
                  onChange={(e) => setFormData({ ...formData, bobot: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Deskripsi (Opsional)</label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-input"
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit_requires_verification"
                  checked={formData.requires_verification}
                  onChange={(e) =>
                    setFormData({ ...formData, requires_verification: e.target.checked })
                  }
                  className="size-4 rounded border-border"
                />
                <label htmlFor="edit_requires_verification" className="text-sm">
                  Memerlukan verifikasi
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingKegiatan(null);
                }}
                disabled={isSubmitting}
                className="flex-1 py-2 px-4 bg-muted text-foreground rounded-xl font-semibold disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={submitEdit}
                disabled={isSubmitting}
                className="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Icon icon="svg-spinners:ring-resize" className="size-5" />
                    Mengupdate...
                  </>
                ) : (
                  'Update'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

