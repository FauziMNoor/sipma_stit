* DASHBOARD WAKIL KETUA III
import { Icon } from "@iconify/react";

export function DashboardWakilKetuaIII() {
	return (
		<div className="flex flex-col h-full bg-background">
			<div className="px-6 py-5 bg-primary border-b border-primary">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-3">
						<img
							alt="Wakil Ketua III Profile"
							src="https://randomuser.me/api/portraits/men/32.jpg"
							className="size-12 rounded-full border-2 border-accent"
						/>
						<div>
							<p className="text-base font-bold text-white">Dashboard Wakil Ketua III</p>
							<p className="text-xs text-white/80">Verifikasi Kemahasiswaan</p>
						</div>
					</div>
					<button className="flex items-center justify-center size-11 rounded-xl bg-white/20">
						<Icon icon="solar:bell-bold" className="size-6 text-accent" />
					</button>
				</div>
			</div>
			<div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
				<div>
					<h3 className="text-lg font-bold text-foreground mb-4 font-heading">
						Ringkasan Verifikasi
					</h3>
					<div className="grid grid-cols-3 gap-3">
						<div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
							<div className="flex flex-col items-center text-center space-y-2">
								<div className="flex items-center justify-center size-12 rounded-xl bg-accent/20">
									<Icon icon="solar:clock-circle-bold" className="size-6 text-accent-foreground" />
								</div>
								<p className="text-2xl font-bold text-foreground">28</p>
								<p className="text-xs text-muted-foreground">Pending Verifikasi</p>
							</div>
						</div>
						<div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
							<div className="flex flex-col items-center text-center space-y-2">
								<div className="flex items-center justify-center size-12 rounded-xl bg-green-500/10">
									<Icon icon="solar:check-circle-bold" className="size-6 text-green-600" />
								</div>
								<p className="text-2xl font-bold text-foreground">142</p>
								<p className="text-xs text-muted-foreground">Disetujui Bulan Ini</p>
							</div>
						</div>
						<div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
							<div className="flex flex-col items-center text-center space-y-2">
								<div className="flex items-center justify-center size-12 rounded-xl bg-destructive/10">
									<Icon icon="solar:close-circle-bold" className="size-6 text-destructive" />
								</div>
								<p className="text-2xl font-bold text-foreground">15</p>
								<p className="text-xs text-muted-foreground">Ditolak</p>
							</div>
						</div>
					</div>
				</div>
				<div>
					<h3 className="text-lg font-bold text-foreground mb-4 font-heading">Menu Utama</h3>
					<div className="grid grid-cols-2 gap-3">
						<div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-5 shadow-lg">
							<div className="flex flex-col items-center text-center space-y-3">
								<div className="flex items-center justify-center size-14 rounded-2xl bg-white/20">
									<Icon icon="solar:clipboard-check-bold" className="size-7 text-white" />
								</div>
								<div>
									<p className="text-sm font-bold text-white">Verifikasi Kegiatan Kemahasiswaan</p>
									<p className="text-xs text-white/80 mt-1">Tinjau pengajuan</p>
								</div>
							</div>
						</div>
						<div className="bg-card rounded-3xl p-5 shadow-sm border border-border">
							<div className="flex flex-col items-center text-center space-y-3">
								<div className="flex items-center justify-center size-14 rounded-2xl bg-secondary/10">
									<Icon icon="solar:hand-heart-bold" className="size-7 text-secondary" />
								</div>
								<div>
									<p className="text-sm font-bold text-foreground">
										Kegiatan Sosial & Kepemimpinan
									</p>
									<p className="text-xs text-muted-foreground mt-1">Tinjau kegiatan</p>
								</div>
							</div>
						</div>
						<div className="bg-card rounded-3xl p-5 shadow-sm border border-border">
							<div className="flex flex-col items-center text-center space-y-3">
								<div className="flex items-center justify-center size-14 rounded-2xl bg-accent/20">
									<Icon icon="solar:chart-bold" className="size-7 text-accent-foreground" />
								</div>
								<div>
									<p className="text-sm font-bold text-foreground">Rekapitulasi Poin</p>
									<p className="text-xs text-muted-foreground mt-1">Statistik poin</p>
								</div>
							</div>
						</div>
						<div className="bg-card rounded-3xl p-5 shadow-sm border border-border">
							<div className="flex flex-col items-center text-center space-y-3">
								<div className="flex items-center justify-center size-14 rounded-2xl bg-primary/10">
									<Icon icon="solar:history-bold" className="size-7 text-primary" />
								</div>
								<div>
									<p className="text-sm font-bold text-foreground">Riwayat Verifikasi</p>
									<p className="text-xs text-muted-foreground mt-1">Lihat riwayat</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="pb-6">
					<h3 className="text-lg font-bold text-foreground mb-4 font-heading">
						Kegiatan Menunggu Verifikasi
					</h3>
					<div className="space-y-3">
						<div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
							<div className="flex items-center justify-between mb-3">
								<span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/20 text-xs font-semibold text-accent-foreground">
									Pending
								</span>
								<span className="text-xs text-muted-foreground">2 jam lalu</span>
							</div>
							<div className="flex items-start gap-4">
								<img
									alt="Student"
									src="https://randomuser.me/api/portraits/women/28.jpg"
									className="size-12 rounded-full border-2 border-border"
								/>
								<div className="flex-1">
									<p className="text-sm font-semibold text-foreground">
										Seminar Nasional Teknologi
									</p>
									<p className="text-xs text-muted-foreground mt-1">Siti Nurhaliza - 2101010123</p>
									<div className="flex items-center gap-2 mt-2">
										<Icon icon="solar:calendar-bold" className="size-4 text-muted-foreground" />
										<span className="text-xs text-muted-foreground">15 Januari 2025</span>
									</div>
								</div>
							</div>
						</div>
						<div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
							<div className="flex items-center justify-between mb-3">
								<span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/20 text-xs font-semibold text-accent-foreground">
									Pending
								</span>
								<span className="text-xs text-muted-foreground">5 jam lalu</span>
							</div>
							<div className="flex items-start gap-4">
								<img
									alt="Student"
									src="https://randomuser.me/api/portraits/men/62.jpg"
									className="size-12 rounded-full border-2 border-border"
								/>
								<div className="flex-1">
									<p className="text-sm font-semibold text-foreground">Bakti Sosial Desa Binaan</p>
									<p className="text-xs text-muted-foreground mt-1">Ahmad Fauzi - 2101010087</p>
									<div className="flex items-center gap-2 mt-2">
										<Icon icon="solar:calendar-bold" className="size-4 text-muted-foreground" />
										<span className="text-xs text-muted-foreground">14 Januari 2025</span>
									</div>
								</div>
							</div>
						</div>
						<div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
							<div className="flex items-center justify-between mb-3">
								<span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/20 text-xs font-semibold text-accent-foreground">
									Pending
								</span>
								<span className="text-xs text-muted-foreground">1 hari lalu</span>
							</div>
							<div className="flex items-start gap-4">
								<img
									alt="Student"
									src="https://randomuser.me/api/portraits/women/44.jpg"
									className="size-12 rounded-full border-2 border-border"
								/>
								<div className="flex-1">
									<p className="text-sm font-semibold text-foreground">
										Workshop Kepemimpinan Mahasiswa
									</p>
									<p className="text-xs text-muted-foreground mt-1">Rina Wijaya - 2101010156</p>
									<div className="flex items-center gap-2 mt-2">
										<Icon icon="solar:calendar-bold" className="size-4 text-muted-foreground" />
										<span className="text-xs text-muted-foreground">13 Januari 2025</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}


* VERIFIKASI KEMAHASISWAAN

import { Icon } from "@iconify/react";

export function VerifikasiKemahasiswaan() {
	return (
		<div className="flex flex-col h-full bg-background">
			<div className="px-6 py-5 bg-primary">
				<div className="flex items-center justify-between mb-1">
					<button className="flex items-center justify-center size-11">
						<Icon icon="solar:arrow-left-linear" className="size-6 text-white" />
					</button>
					<h1 className="text-lg font-bold text-white font-heading">Verifikasi Kemahasiswaan</h1>
					<button className="flex items-center justify-center size-11">
						<Icon icon="solar:filter-bold" className="size-6 text-white" />
					</button>
				</div>
				<p className="text-sm text-white/80 text-center">
					Wakil Ketua III - Kegiatan Kemahasiswaan
				</p>
			</div>
			<div className="px-6 py-4 bg-card border-b border-border">
				<div className="relative mb-4">
					<input
						type="text"
						className="w-full pl-11 pr-4 py-3 rounded-xl bg-input border border-border text-sm"
						placeholder="Cari mahasiswa atau kegiatan..."
					/>
					<Icon
						icon="solar:magnifer-linear"
						className="size-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2"
					/>
				</div>
				<div className="flex gap-2 overflow-x-auto">
					<button className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm whitespace-nowrap shadow-sm">
						Semua<span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs">18</span>
					</button>
					<button className="px-5 py-2.5 rounded-xl bg-muted text-muted-foreground font-semibold text-sm whitespace-nowrap">
						Pending
						<span className="ml-2 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs">
							10
						</span>
					</button>
					<button className="px-5 py-2.5 rounded-xl bg-muted text-muted-foreground font-semibold text-sm whitespace-nowrap">
						Disetujui
						<span className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">
							6
						</span>
					</button>
					<button className="px-5 py-2.5 rounded-xl bg-muted text-muted-foreground font-semibold text-sm whitespace-nowrap">
						Ditolak
						<span className="ml-2 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs">
							2
						</span>
					</button>
				</div>
			</div>
			<div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
				<div className="bg-secondary/5 rounded-2xl p-4 shadow-sm border border-secondary/20">
					<div className="flex gap-3 mb-3">
						<img
							alt="Mahasiswa"
							src="https://randomuser.me/api/portraits/women/28.jpg"
							className="size-12 rounded-full border-2 border-secondary"
						/>
						<div className="flex-1">
							<p className="text-sm font-bold text-foreground">Rina Marlina</p>
							<p className="text-xs text-muted-foreground">2201234580</p>
							<span className="inline-block mt-1 px-2.5 py-1 rounded-lg bg-accent text-accent-foreground text-xs font-semibold">
								Pending
							</span>
						</div>
						<div className="text-right">
							<p className="text-lg font-bold text-primary">+25</p>
							<p className="text-xs text-muted-foreground">Poin</p>
						</div>
					</div>
					<div className="space-y-2 mb-3">
						<p className="text-sm font-semibold text-foreground">Bakti Sosial Desa Maju Bersama</p>
						<div className="flex items-center gap-2">
							<span className="px-2.5 py-1 rounded-lg bg-green-600/10 text-green-700 text-xs font-semibold">
								Sosial
							</span>
							<span className="text-xs text-muted-foreground">•</span>
							<span className="text-xs text-muted-foreground">18 Maret 2024</span>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<img
							alt="Bukti"
							src="https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/generation-assets/placeholder/square.png"
							className="size-20 rounded-xl object-cover border border-border"
						/>
						<div className="flex-1 space-y-2">
							<p className="text-xs text-muted-foreground">Bukti Kegiatan</p>
							<div className="flex gap-2">
								<button className="flex-1 py-2 px-3 rounded-xl bg-green-600 text-white text-xs font-semibold">
									Setujui
								</button>
								<button className="flex-1 py-2 px-3 rounded-xl bg-destructive text-white text-xs font-semibold">
									Tolak
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className="bg-secondary/5 rounded-2xl p-4 shadow-sm border border-secondary/20">
					<div className="flex gap-3 mb-3">
						<img
							alt="Mahasiswa"
							src="https://randomuser.me/api/portraits/men/45.jpg"
							className="size-12 rounded-full border-2 border-secondary"
						/>
						<div className="flex-1">
							<p className="text-sm font-bold text-foreground">Agus Setiawan</p>
							<p className="text-xs text-muted-foreground">2201234581</p>
							<span className="inline-block mt-1 px-2.5 py-1 rounded-lg bg-accent text-accent-foreground text-xs font-semibold">
								Pending
							</span>
						</div>
						<div className="text-right">
							<p className="text-lg font-bold text-primary">+30</p>
							<p className="text-xs text-muted-foreground">Poin</p>
						</div>
					</div>
					<div className="space-y-2 mb-3">
						<p className="text-sm font-semibold text-foreground">
							Pelatihan Kepemimpinan Mahasiswa
						</p>
						<div className="flex items-center gap-2">
							<span className="px-2.5 py-1 rounded-lg bg-blue-600/10 text-blue-700 text-xs font-semibold">
								Kepemimpinan
							</span>
							<span className="text-xs text-muted-foreground">•</span>
							<span className="text-xs text-muted-foreground">17 Maret 2024</span>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<img
							alt="Bukti"
							src="https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/generation-assets/placeholder/square.png"
							className="size-20 rounded-xl object-cover border border-border"
						/>
						<div className="flex-1 space-y-2">
							<p className="text-xs text-muted-foreground">Bukti Kegiatan</p>
							<div className="flex gap-2">
								<button className="flex-1 py-2 px-3 rounded-xl bg-green-600 text-white text-xs font-semibold">
									Setujui
								</button>
								<button className="flex-1 py-2 px-3 rounded-xl bg-destructive text-white text-xs font-semibold">
									Tolak
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className="bg-secondary/5 rounded-2xl p-4 shadow-sm border border-secondary/20">
					<div className="flex gap-3 mb-3">
						<img
							alt="Mahasiswa"
							src="https://randomuser.me/api/portraits/women/62.jpg"
							className="size-12 rounded-full border-2 border-secondary"
						/>
						<div className="flex-1">
							<p className="text-sm font-bold text-foreground">Lisa Rahmawati</p>
							<p className="text-xs text-muted-foreground">2201234582</p>
							<span className="inline-block mt-1 px-2.5 py-1 rounded-lg bg-accent text-accent-foreground text-xs font-semibold">
								Pending
							</span>
						</div>
						<div className="text-right">
							<p className="text-lg font-bold text-primary">+20</p>
							<p className="text-xs text-muted-foreground">Poin</p>
						</div>
					</div>
					<div className="space-y-2 mb-3">
						<p className="text-sm font-semibold text-foreground">
							Pengabdian Masyarakat Kampung Literasi
						</p>
						<div className="flex items-center gap-2">
							<span className="px-2.5 py-1 rounded-lg bg-orange-600/10 text-orange-700 text-xs font-semibold">
								Pengabdian
							</span>
							<span className="text-xs text-muted-foreground">•</span>
							<span className="text-xs text-muted-foreground">16 Maret 2024</span>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<img
							alt="Bukti"
							src="https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/generation-assets/placeholder/square.png"
							className="size-20 rounded-xl object-cover border border-border"
						/>
						<div className="flex-1 space-y-2">
							<p className="text-xs text-muted-foreground">Bukti Kegiatan</p>
							<div className="flex gap-2">
								<button className="flex-1 py-2 px-3 rounded-xl bg-green-600 text-white text-xs font-semibold">
									Setujui
								</button>
								<button className="flex-1 py-2 px-3 rounded-xl bg-destructive text-white text-xs font-semibold">
									Tolak
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className="bg-secondary/5 rounded-2xl p-4 shadow-sm border border-secondary/20">
					<div className="flex gap-3 mb-3">
						<img
							alt="Mahasiswa"
							src="https://randomuser.me/api/portraits/men/33.jpg"
							className="size-12 rounded-full border-2 border-secondary"
						/>
						<div className="flex-1">
							<p className="text-sm font-bold text-foreground">Rudi Hartono</p>
							<p className="text-xs text-muted-foreground">2201234583</p>
							<span className="inline-block mt-1 px-2.5 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold">
								Disetujui
							</span>
						</div>
						<div className="text-right">
							<p className="text-lg font-bold text-primary">+25</p>
							<p className="text-xs text-muted-foreground">Poin</p>
						</div>
					</div>
					<div className="space-y-2 mb-3">
						<p className="text-sm font-semibold text-foreground">Donor Darah Kemanusiaan</p>
						<div className="flex items-center gap-2">
							<span className="px-2.5 py-1 rounded-lg bg-green-600/10 text-green-700 text-xs font-semibold">
								Sosial
							</span>
							<span className="text-xs text-muted-foreground">•</span>
							<span className="text-xs text-muted-foreground">15 Maret 2024</span>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<img
							alt="Bukti"
							src="https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/generation-assets/placeholder/square.png"
							className="size-20 rounded-xl object-cover border border-border"
						/>
						<div className="flex-1">
							<p className="text-xs text-muted-foreground mb-2">Bukti Kegiatan</p>
							<div className="flex gap-2">
								<button className="flex-1 py-2 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold">
									Lihat Detail
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className="bg-secondary/5 rounded-2xl p-4 shadow-sm border border-secondary/20">
					<div className="flex gap-3 mb-3">
						<img
							alt="Mahasiswa"
							src="https://randomuser.me/api/portraits/women/19.jpg"
							className="size-12 rounded-full border-2 border-secondary"
						/>
						<div className="flex-1">
							<p className="text-sm font-bold text-foreground">Maya Kusuma</p>
							<p className="text-xs text-muted-foreground">2201234584</p>
							<span className="inline-block mt-1 px-2.5 py-1 rounded-lg bg-accent text-accent-foreground text-xs font-semibold">
								Pending
							</span>
						</div>
						<div className="text-right">
							<p className="text-lg font-bold text-primary">+20</p>
							<p className="text-xs text-muted-foreground">Poin</p>
						</div>
					</div>
					<div className="space-y-2 mb-3">
						<p className="text-sm font-semibold text-foreground">Workshop Organisasi Mahasiswa</p>
						<div className="flex items-center gap-2">
							<span className="px-2.5 py-1 rounded-lg bg-blue-600/10 text-blue-700 text-xs font-semibold">
								Kepemimpinan
							</span>
							<span className="text-xs text-muted-foreground">•</span>
							<span className="text-xs text-muted-foreground">14 Maret 2024</span>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<img
							alt="Bukti"
							src="https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/generation-assets/placeholder/square.png"
							className="size-20 rounded-xl object-cover border border-border"
						/>
						<div className="flex-1 space-y-2">
							<p className="text-xs text-muted-foreground">Bukti Kegiatan</p>
							<div className="flex gap-2">
								<button className="flex-1 py-2 px-3 rounded-xl bg-green-600 text-white text-xs font-semibold">
									Setujui
								</button>
								<button className="flex-1 py-2 px-3 rounded-xl bg-destructive text-white text-xs font-semibold">
									Tolak
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className="bg-secondary/5 rounded-2xl p-4 shadow-sm border border-secondary/20">
					<div className="flex gap-3 mb-3">
						<img
							alt="Mahasiswa"
							src="https://randomuser.me/api/portraits/men/71.jpg"
							className="size-12 rounded-full border-2 border-secondary"
						/>
						<div className="flex-1">
							<p className="text-sm font-bold text-foreground">Irfan Hakim</p>
							<p className="text-xs text-muted-foreground">2201234585</p>
							<span className="inline-block mt-1 px-2.5 py-1 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold">
								Ditolak
							</span>
						</div>
						<div className="text-right">
							<p className="text-lg font-bold text-muted-foreground">+15</p>
							<p className="text-xs text-muted-foreground">Poin</p>
						</div>
					</div>
					<div className="space-y-2 mb-3">
						<p className="text-sm font-semibold text-foreground">
							Kegiatan Gotong Royong Lingkungan
						</p>
						<div className="flex items-center gap-2">
							<span className="px-2.5 py-1 rounded-lg bg-green-600/10 text-green-700 text-xs font-semibold">
								Sosial
							</span>
							<span className="text-xs text-muted-foreground">•</span>
							<span className="text-xs text-muted-foreground">13 Maret 2024</span>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<img
							alt="Bukti"
							src="https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/generation-assets/placeholder/square.png"
							className="size-20 rounded-xl object-cover border border-border"
						/>
						<div className="flex-1">
							<p className="text-xs text-muted-foreground mb-2">Bukti Kegiatan</p>
							<div className="flex gap-2">
								<button className="flex-1 py-2 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold">
									Lihat Detail
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}


* PROFIL WAKIL KETUA III

BUATKAN HALMAN PROFIL WAKIL KETUA III YANG BISA DIKLIK DARI HALAMAN DASHBOARD.