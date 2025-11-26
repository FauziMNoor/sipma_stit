'use client';

import { Icon } from "@iconify/react";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Mahasiswa {
id: string;
nim: string;
nama: string;
email: string | null;
no_telepon: string | null;
prodi: string;
angkatan: number;
semester: number;
alamat: string | null;
tahun_ajaran_masuk: string;
foto: string | null;
is_active: boolean;
}

export function KelolaMahasiswa() {
const router = useRouter();
const [mahasiswaList, setMahasiswaList] = useState<Mahasiswa[]>([]);
const [loading, setLoading] = useState(true);
const [searchQuery, setSearchQuery] = useState('');
const [showAddModal, setShowAddModal] = useState(false);
const [showEditModal, setShowEditModal] = useState(false);
const [showDetailModal, setShowDetailModal] = useState(false);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedMahasiswa, setSelectedMahasiswa] = useState<Mahasiswa | null>(null);
const [formData, setFormData] = useState({
nim: '',
nama: '',
email: '',
no_telepon: '',
prodi: '',
angkatan: new Date().getFullYear(),
semester: 1,
alamat: '',
tahun_ajaran_masuk: '',
password: '',
foto: null as File | null,
fotoUrl: '',
});
const [showImportModal, setShowImportModal] = useState(false);
const [importFile, setImportFile] = useState<File | null>(null);
const [uploading, setUploading] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [prodiList, setProdiList] = useState<any[]>([]);

useEffect(() => {
fetchMahasiswa();
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

const fetchMahasiswa = async () => {
try {
setLoading(true);
const response = await fetch('/api/mahasiswa');
const result = await response.json();
if (result.success) {
setMahasiswaList(result.data);
} else {
alert('Gagal memuat data mahasiswa');
}
} catch (error) {
console.error('Error fetching mahasiswa:', error);
alert('Terjadi kesalahan saat memuat data');
} finally {
setLoading(false);
}
};

const handleAdd = () => {
const currentYear = new Date().getFullYear();
setFormData({
  nim: '',
  nama: '',
  email: '',
  no_telepon: '',
  prodi: '',
  angkatan: currentYear,
  semester: 1,
  alamat: '',
  tahun_ajaran_masuk: `${currentYear}/${currentYear + 1}`,
  password: '',
  foto: null,
  fotoUrl: ''
});
setShowAddModal(true);
};

const handleEdit = (mahasiswa: Mahasiswa) => {
setSelectedMahasiswa(mahasiswa);
setFormData({
  nim: mahasiswa.nim,
  nama: mahasiswa.nama,
  email: mahasiswa.email || '',
  no_telepon: mahasiswa.no_telepon || '',
  prodi: mahasiswa.prodi,
  angkatan: mahasiswa.angkatan,
  semester: mahasiswa.semester,
  alamat: mahasiswa.alamat || '',
  tahun_ajaran_masuk: mahasiswa.tahun_ajaran_masuk || `${mahasiswa.angkatan}/${mahasiswa.angkatan + 1}`,
  password: '',
  foto: null,
  fotoUrl: mahasiswa.foto || ''
});
setShowEditModal(true);
};

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const file = e.target.files?.[0];
if (file) {
setFormData({ ...formData, foto: file, fotoUrl: URL.createObjectURL(file) });
}
};

const uploadFoto = async (file: File): Promise<string | null> => {
try {
setUploading(true);
const formData = new FormData();
formData.append('file', file);

const response = await fetch('/api/upload', {
method: 'POST',
body: formData,
});

const result = await response.json();
if (result.success) {
return result.data.url;
}
return null;
} catch (error) {
console.error('Error uploading foto:', error);
return null;
} finally {
setUploading(false);
}
};

const handleDetail = (mahasiswa: Mahasiswa) => {
setSelectedMahasiswa(mahasiswa);
setShowDetailModal(true);
};

const handleDeleteConfirm = (mahasiswa: Mahasiswa) => {
setSelectedMahasiswa(mahasiswa);
setShowDeleteModal(true);
};

const submitAdd = async () => {
setIsSubmitting(true);
try {
let fotoUrl = '';
if (formData.foto) {
const uploadedUrl = await uploadFoto(formData.foto);
if (uploadedUrl) {
fotoUrl = uploadedUrl;
}
}

const response = await fetch('/api/mahasiswa', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
nim: formData.nim,
nama: formData.nama,
email: formData.email,
no_telepon: formData.no_telepon,
prodi: formData.prodi,
angkatan: formData.angkatan,
semester: formData.semester,
alamat: formData.alamat,
tahun_ajaran_masuk: formData.tahun_ajaran_masuk,
password: formData.password,
foto: fotoUrl || null,
}),
});
const result = await response.json();
if (result.success) {
alert('Mahasiswa berhasil ditambahkan');
setShowAddModal(false);
// Reset form data
setFormData({
  nim: '',
  nama: '',
  email: '',
  no_telepon: '',
  prodi: '',
  angkatan: 2024,
  semester: 1,
  alamat: '',
  tahun_ajaran_masuk: '2024/2025',
  password: '',
  foto: null,
  fotoUrl: ''
});
fetchMahasiswa();
} else {
alert(result.error || 'Gagal menambahkan mahasiswa');
}
} catch (error) {
console.error('Error adding mahasiswa:', error);
alert('Terjadi kesalahan');
} finally {
setIsSubmitting(false);
}
};

const submitEdit = async () => {
if (!selectedMahasiswa) return;
setIsSubmitting(true);
try {
let fotoUrl = formData.fotoUrl || selectedMahasiswa.foto || '';
if (formData.foto) {
const uploadedUrl = await uploadFoto(formData.foto);
if (uploadedUrl) {
fotoUrl = uploadedUrl;
}
}

console.log('📝 Submitting edit:', {
nim: formData.nim,
nama: formData.nama,
prodi: formData.prodi,
angkatan: formData.angkatan,
password: formData.password ? '***' : '',
foto: fotoUrl,
});

const response = await fetch(`/api/mahasiswa/${selectedMahasiswa.id}`, {
method: 'PUT',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
nim: formData.nim,
nama: formData.nama,
email: formData.email,
no_telepon: formData.no_telepon,
prodi: formData.prodi,
angkatan: formData.angkatan,
semester: formData.semester,
alamat: formData.alamat,
tahun_ajaran_masuk: formData.tahun_ajaran_masuk,
password: formData.password,
foto: fotoUrl || null,
}),
});
const result = await response.json();
if (result.success) {
alert('Mahasiswa berhasil diupdate');
setShowEditModal(false);
fetchMahasiswa();
} else {
alert(result.error || 'Gagal mengupdate mahasiswa');
}
} catch (error) {
console.error('Error updating mahasiswa:', error);
alert('Terjadi kesalahan');
} finally {
setIsSubmitting(false);
}
};

const submitDelete = async () => {
if (!selectedMahasiswa) return;
setIsSubmitting(true);
try {
const response = await fetch(`/api/mahasiswa/${selectedMahasiswa.id}`, { method: 'DELETE' });
const result = await response.json();
if (result.success) {
alert('Mahasiswa berhasil dihapus');
setShowDeleteModal(false);
fetchMahasiswa();
} else {
alert(result.error || 'Gagal menghapus mahasiswa');
}
} catch (error) {
console.error('Error deleting mahasiswa:', error);
alert('Terjadi kesalahan');
} finally {
setIsSubmitting(false);
}
};

const handleDownloadTemplate = () => {
window.open('/api/mahasiswa/template', '_blank');
};

const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
const file = e.target.files?.[0];
if (file) {
setImportFile(file);
}
};

const submitImport = async () => {
if (!importFile) {
alert('Pilih file terlebih dahulu');
return;
}

try {
setUploading(true);
const formData = new FormData();
formData.append('file', importFile);

const response = await fetch('/api/mahasiswa/import', {
method: 'POST',
body: formData,
});

const result = await response.json();
if (result.success) {
const { success, failed, errors } = result.data;
let message = `Berhasil: ${success}, Gagal: ${failed}`;
if (errors.length > 0) {
message += '\n\nError:\n' + errors.slice(0, 5).join('\n');
if (errors.length > 5) {
message += `\n... dan ${errors.length - 5} error lainnya`;
}
}
alert(message);
setShowImportModal(false);
setImportFile(null);
fetchMahasiswa();
} else {
alert(result.error || 'Gagal mengimport data');
}
} catch (error) {
console.error('Error importing:', error);
alert('Terjadi kesalahan');
} finally {
setUploading(false);
}
};

const filteredMahasiswa = mahasiswaList.filter(m =>
m.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
m.nim.toLowerCase().includes(searchQuery.toLowerCase())
);

return (
<div className="flex flex-col h-full bg-background">
<div className="px-4 sm:px-6 py-5 bg-primary border-b border-border">
<div className="max-w-3xl mx-auto flex items-center justify-between">
<div className="flex items-center gap-2 sm:gap-3">
<button onClick={() => router.back()} className="flex items-center justify-center size-10 sm:size-11 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
<Icon icon="solar:arrow-left-linear" className="size-5 sm:size-6 text-primary-foreground" />
</button>
<h1 className="text-lg sm:text-xl font-bold text-primary-foreground font-heading">Kelola Mahasiswa</h1>
</div>
<div className="flex gap-2">
<button onClick={() => setShowImportModal(true)} className="flex items-center justify-center size-10 sm:size-11 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
<Icon icon="solar:import-bold" className="size-5 sm:size-6 text-primary-foreground" />
</button>
<button onClick={handleAdd} className="flex items-center justify-center size-10 sm:size-11 rounded-xl bg-accent hover:bg-accent/90 transition-colors">
<Icon icon="solar:add-circle-bold" className="size-5 sm:size-6 text-accent-foreground" />
</button>
</div>
</div>
</div>
<div className="px-4 sm:px-6 py-4 bg-card border-b border-border">
<div className="max-w-3xl mx-auto">
<div className="relative">
<Icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
<input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-input text-foreground" placeholder="Cari mahasiswa..." />
</div>
</div>
</div>
<div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
<div className="max-w-3xl mx-auto space-y-4">
{loading ? (
<div className="flex items-center justify-center py-12">
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
</div>
) : filteredMahasiswa.length === 0 ? (
<div className="text-center py-12">
<Icon icon="solar:user-cross-bold" className="size-16 text-muted-foreground mx-auto mb-4" />
<p className="text-muted-foreground">Tidak ada mahasiswa ditemukan</p>
</div>
) : (
filteredMahasiswa.map((mahasiswa) => (
<div key={mahasiswa.id} className="bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md border border-border">
<div className="flex gap-3 sm:gap-4">
<img alt={mahasiswa.nama} src={mahasiswa.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(mahasiswa.nama)}&background=random`} className="size-14 sm:size-16 rounded-full object-cover flex-shrink-0" />
<div className="flex-1 min-w-0">
<div className="flex items-start justify-between gap-2 mb-1">
<div className="min-w-0">
<h3 className="text-sm sm:text-base font-bold text-foreground truncate">{mahasiswa.nama}</h3>
<p className="text-xs sm:text-sm text-muted-foreground">NIM: {mahasiswa.nim}</p>
</div>
<span className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold rounded-full whitespace-nowrap flex-shrink-0 ${mahasiswa.is_active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
{mahasiswa.is_active ? 'Aktif' : 'Nonaktif'}
</span>
</div>
<p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">{mahasiswa.prodi} • Semester {mahasiswa.semester}</p>
<div className="flex gap-1.5 sm:gap-2">
<button onClick={() => handleDetail(mahasiswa)} className="flex items-center justify-center size-8 sm:size-9 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
<Icon icon="solar:eye-bold" className="size-4 sm:size-5 text-primary" />
</button>
<button onClick={() => handleEdit(mahasiswa)} className="flex items-center justify-center size-8 sm:size-9 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors">
<Icon icon="solar:pen-bold" className="size-4 sm:size-5 text-blue-600" />
</button>
<button onClick={() => handleDeleteConfirm(mahasiswa)} className="flex items-center justify-center size-8 sm:size-9 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors">
<Icon icon="solar:trash-bin-trash-bold" className="size-4 sm:size-5 text-red-600" />
</button>
</div>
</div>
</div>
</div>
))
)}
</div>
</div>

{/* Modal Tambah Mahasiswa */}
{showAddModal && (
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
<div className="bg-card rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
<h2 className="text-xl font-bold mb-4">Tambah Mahasiswa</h2>
<div className="space-y-4">
<div>
<label className="block text-sm font-medium mb-2">Foto Mahasiswa</label>
<div className="flex items-center gap-4">
{formData.fotoUrl && (
<img src={formData.fotoUrl} alt="Preview" className="size-20 rounded-full object-cover" />
)}
<label className="flex-1 cursor-pointer">
<div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-input hover:bg-muted transition-colors">
<Icon icon="solar:camera-add-bold" className="size-5" />
<span className="text-sm">{formData.foto ? formData.foto.name : 'Pilih foto'}</span>
</div>
<input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
</label>
</div>
</div>
<div>
<label className="block text-sm font-medium mb-2">NIM</label>
<input type="text" value={formData.nim} onChange={(e) => setFormData({ ...formData, nim: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-border bg-input" placeholder="Masukkan NIM" />
</div>
<div>
<label className="block text-sm font-medium mb-2">Nama Lengkap</label>
<input type="text" value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-border bg-input" placeholder="Masukkan nama lengkap" />
</div>
<div>
<label className="block text-sm font-medium mb-2">Email</label>
<input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-border bg-input" placeholder="Masukkan email" />
</div>
<div>
<label className="block text-sm font-medium mb-2">No. Telepon</label>
<input type="tel" value={formData.no_telepon} onChange={(e) => setFormData({ ...formData, no_telepon: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-border bg-input" placeholder="Masukkan nomor telepon" />
</div>
<div>
<label className="block text-sm font-medium mb-2">Program Studi</label>
<select
  value={formData.prodi}
  onChange={(e) => setFormData({ ...formData, prodi: e.target.value })}
  className="w-full px-4 py-2 rounded-xl border border-border bg-input"
  required
>
  <option value="">Pilih Program Studi</option>
  {prodiList.map((prodi) => (
    <option key={prodi.id} value={prodi.nama_prodi}>
      {prodi.nama_prodi}
    </option>
  ))}
</select>
{prodiList.length === 0 && (
  <p className="text-xs text-red-500 mt-1">
    Belum ada prodi. Tambahkan di Pengaturan Sistem &gt; Kelola Program Studi
  </p>
)}
</div>
<div className="grid grid-cols-2 gap-4">
<div>
<label className="block text-sm font-medium mb-2">Angkatan</label>
<input type="number" value={formData.angkatan} onChange={(e) => setFormData({ ...formData, angkatan: parseInt(e.target.value) })} className="w-full px-4 py-2 rounded-xl border border-border bg-input" placeholder="2024" />
</div>
<div>
<label className="block text-sm font-medium mb-2">Semester</label>
<input type="number" min="1" max="14" value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })} className="w-full px-4 py-2 rounded-xl border border-border bg-input" placeholder="1" />
</div>
</div>
<div>
<label className="block text-sm font-medium mb-2">Alamat</label>
<textarea value={formData.alamat} onChange={(e) => setFormData({ ...formData, alamat: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-border bg-input h-20 resize-none" placeholder="Masukkan alamat lengkap" />
</div>
<div>
<label className="block text-sm font-medium mb-2">Tahun Ajaran Masuk</label>
<input type="text" value={formData.tahun_ajaran_masuk} onChange={(e) => setFormData({ ...formData, tahun_ajaran_masuk: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-border bg-input" placeholder="2024/2025" />
</div>
<div>
<label className="block text-sm font-medium mb-2">Password</label>
<input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-border bg-input" placeholder="Masukkan password" />
</div>
</div>
<div className="flex gap-3 mt-6">
<button onClick={() => setShowAddModal(false)} disabled={uploading || isSubmitting} className="flex-1 px-4 py-2 rounded-xl border border-border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Batal</button>
<button onClick={submitAdd} disabled={uploading || isSubmitting} className="flex-1 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
{uploading || isSubmitting ? (
<>
<Icon icon="svg-spinners:ring-resize" className="size-5" />
<span>Menyimpan...</span>
</>
) : (
'Simpan'
)}
</button>
</div>
</div>
</div>
)}

{/* Modal Edit Mahasiswa */}
{showEditModal && selectedMahasiswa && (
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
<div className="bg-card rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
<h2 className="text-xl font-bold mb-4">Edit Mahasiswa</h2>
<div className="space-y-4">
<div>
<label className="block text-sm font-medium mb-2">Foto Mahasiswa</label>
<div className="flex items-center gap-4">
{formData.fotoUrl && (
<img src={formData.fotoUrl} alt="Preview" className="size-20 rounded-full object-cover" />
)}
<label className="flex-1 cursor-pointer">
<div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-input hover:bg-muted transition-colors">
<Icon icon="solar:camera-add-bold" className="size-5" />
<span className="text-sm">{formData.foto ? formData.foto.name : 'Ubah foto'}</span>
</div>
<input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
</label>
</div>
</div>
<div>
<label className="block text-sm font-medium mb-2">NIM</label>
<input type="text" value={formData.nim} onChange={(e) => setFormData({ ...formData, nim: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-border bg-input" />
</div>
<div>
<label className="block text-sm font-medium mb-2">Nama Lengkap</label>
<input type="text" value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-border bg-input" />
</div>
<div>
<label className="block text-sm font-medium mb-2">Email</label>
<input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-border bg-input" placeholder="Masukkan email" />
</div>
<div>
<label className="block text-sm font-medium mb-2">No. Telepon</label>
<input type="tel" value={formData.no_telepon} onChange={(e) => setFormData({ ...formData, no_telepon: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-border bg-input" placeholder="Masukkan nomor telepon" />
</div>
<div>
<label className="block text-sm font-medium mb-2">Program Studi</label>
<select
  value={formData.prodi}
  onChange={(e) => setFormData({ ...formData, prodi: e.target.value })}
  className="w-full px-4 py-2 rounded-xl border border-border bg-input"
  required
>
  <option value="">Pilih Program Studi</option>
  {prodiList.map((prodi) => (
    <option key={prodi.id} value={prodi.nama_prodi}>
      {prodi.nama_prodi}
    </option>
  ))}
</select>
</div>
<div className="grid grid-cols-2 gap-4">
<div>
<label className="block text-sm font-medium mb-2">Angkatan</label>
<input type="number" value={formData.angkatan} onChange={(e) => setFormData({ ...formData, angkatan: parseInt(e.target.value) })} className="w-full px-4 py-2 rounded-xl border border-border bg-input" />
</div>
<div>
<label className="block text-sm font-medium mb-2">Semester</label>
<input type="number" min="1" max="14" value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })} className="w-full px-4 py-2 rounded-xl border border-border bg-input" />
</div>
</div>
<div>
<label className="block text-sm font-medium mb-2">Alamat</label>
<textarea value={formData.alamat} onChange={(e) => setFormData({ ...formData, alamat: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-border bg-input h-20 resize-none" placeholder="Masukkan alamat lengkap" />
</div>
<div>
<label className="block text-sm font-medium mb-2">Tahun Ajaran Masuk</label>
<input type="text" value={formData.tahun_ajaran_masuk} onChange={(e) => setFormData({ ...formData, tahun_ajaran_masuk: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-border bg-input" placeholder="2024/2025" />
</div>
<div>
<label className="block text-sm font-medium mb-2">Password</label>
<input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-border bg-input" placeholder="Masukkan password baru" />
</div>
</div>
<div className="flex gap-3 mt-6">
<button onClick={() => setShowEditModal(false)} disabled={uploading || isSubmitting} className="flex-1 px-4 py-3 rounded-xl border-2 border-border bg-background hover:bg-muted transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
Batal
</button>
<button onClick={submitEdit} disabled={uploading || isSubmitting} className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
{uploading || isSubmitting ? (
<>
<Icon icon="svg-spinners:ring-resize" className="size-5" />
<span>Mengupdate...</span>
</>
) : (
'Update'
)}
</button>
</div>
</div>
</div>
)}

{/* Modal Detail Mahasiswa */}
{showDetailModal && selectedMahasiswa && (
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
<div className="bg-card rounded-2xl p-6 w-full max-w-md">
<h2 className="text-xl font-bold mb-4">Detail Mahasiswa</h2>
<div className="space-y-3">
<div>
<p className="text-sm text-muted-foreground">NIM</p>
<p className="font-medium">{selectedMahasiswa.nim}</p>
</div>
<div>
<p className="text-sm text-muted-foreground">Nama Lengkap</p>
<p className="font-medium">{selectedMahasiswa.nama}</p>
</div>
<div>
<p className="text-sm text-muted-foreground">Email</p>
<p className="font-medium">{selectedMahasiswa.email || '-'}</p>
</div>
<div>
<p className="text-sm text-muted-foreground">No. Telepon</p>
<p className="font-medium">{selectedMahasiswa.no_telepon || '-'}</p>
</div>
<div>
<p className="text-sm text-muted-foreground">Program Studi</p>
<p className="font-medium">{selectedMahasiswa.prodi}</p>
</div>
<div className="grid grid-cols-2 gap-4">
<div>
<p className="text-sm text-muted-foreground">Angkatan</p>
<p className="font-medium">{selectedMahasiswa.angkatan}</p>
</div>
<div>
<p className="text-sm text-muted-foreground">Semester</p>
<p className="font-medium">{selectedMahasiswa.semester}</p>
</div>
</div>
<div>
<p className="text-sm text-muted-foreground">Alamat</p>
<p className="font-medium">{selectedMahasiswa.alamat || '-'}</p>
</div>
<div>
<p className="text-sm text-muted-foreground">Tahun Ajaran Masuk</p>
<p className="font-medium">{selectedMahasiswa.tahun_ajaran_masuk || `${selectedMahasiswa.angkatan}/${selectedMahasiswa.angkatan + 1}`}</p>
</div>
<div>
<p className="text-sm text-muted-foreground">Status</p>
<p className="font-medium">{selectedMahasiswa.is_active ? 'Aktif' : 'Nonaktif'}</p>
</div>
</div>
<div className="mt-6">
<button onClick={() => setShowDetailModal(false)} className="w-full px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Tutup</button>
</div>
</div>
</div>
)}

{/* Modal Delete Confirmation */}
{showDeleteModal && selectedMahasiswa && (
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
<div className="bg-card rounded-2xl p-6 w-full max-w-md">
<h2 className="text-xl font-bold mb-4">Hapus Mahasiswa</h2>
<p className="text-muted-foreground mb-6">Apakah Anda yakin ingin menghapus mahasiswa <strong>{selectedMahasiswa.nama}</strong>? Tindakan ini tidak dapat dibatalkan.</p>
<div className="flex gap-3">
<button onClick={() => setShowDeleteModal(false)} disabled={isSubmitting} className="flex-1 px-4 py-2 rounded-xl border border-border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Batal</button>
<button onClick={submitDelete} disabled={isSubmitting} className="flex-1 px-4 py-2 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
{isSubmitting ? (
<>
<Icon icon="svg-spinners:ring-resize" className="size-5" />
<span>Menghapus...</span>
</>
) : (
'Hapus'
)}
</button>
</div>
</div>
</div>
)}

{/* Modal Import Mahasiswa */}
{showImportModal && (
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
<div className="bg-card rounded-2xl p-6 w-full max-w-md">
<h2 className="text-xl font-bold mb-4">Import Mahasiswa</h2>
<div className="space-y-4">
<div className="bg-muted/50 rounded-xl p-4 space-y-2">
<p className="text-sm font-medium">Langkah-langkah:</p>
<ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
<li>Download template Excel</li>
<li>Isi data mahasiswa sesuai format</li>
<li>Upload file yang sudah diisi</li>
</ol>
</div>
<button onClick={handleDownloadTemplate} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border hover:bg-muted transition-colors">
<Icon icon="solar:download-bold" className="size-5" />
<span>Download Template Excel</span>
</button>
<div>
<label className="block text-sm font-medium mb-2">Upload File Excel</label>
<label className="cursor-pointer">
<div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-input hover:bg-muted transition-colors">
<Icon icon="solar:file-text-bold" className="size-5" />
<span className="text-sm">{importFile ? importFile.name : 'Pilih file CSV/Excel'}</span>
</div>
<input type="file" accept=".csv,.xlsx,.xls" onChange={handleImportFile} className="hidden" />
</label>
</div>
</div>
<div className="flex gap-3 mt-6">
<button onClick={() => { setShowImportModal(false); setImportFile(null); }} disabled={uploading} className="flex-1 px-4 py-2 rounded-xl border border-border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Batal</button>
<button onClick={submitImport} disabled={!importFile || uploading} className="flex-1 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
{uploading ? (
<>
<Icon icon="svg-spinners:ring-resize" className="size-5" />
<span>Mengimport...</span>
</>
) : (
'Import'
)}
</button>
</div>
</div>
</div>
)}
</div>
);
}
