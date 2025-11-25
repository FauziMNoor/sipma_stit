* HALMAN REKAP POIN MAHASISWA

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>RekapPoinMahasiswa</title>
		<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link
			href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
			rel="stylesheet"
		>
		<link
			href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&display=swap"
			rel="stylesheet"
		>
		<link
			href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap"
			rel="stylesheet"
		>
		<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
		<script src="https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js"></script>
		<style type="text/tailwindcss">
		@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  --font-font-sans: var(--font-sans);
  --font-font-heading: var(--font-heading);
  --font-font-serif: var(--font-serif);
  --font-font-mono: var(--font-mono);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --tracking-tighter: calc(var(--tracking-normal) - 0.05em);
  --tracking-tight: calc(var(--tracking-normal) - 0.025em);
  --tracking-wide: calc(var(--tracking-normal) + 0.025em);
  --tracking-wider: calc(var(--tracking-normal) + 0.05em);
  --tracking-widest: calc(var(--tracking-normal) + 0.1em);
  --tracking-normal: var(--tracking-normal);
}

		:root {
			--background: #f9fafb;
			--foreground: #013463;
			--primary: #0059a8;
			--primary-foreground: #ffffff;
			--secondary: #009ee3;
			--secondary-foreground: #ffffff;
			--muted: #e5edf5;
			--muted-foreground: #5a7a9b;
			--accent: #ffd646;
			--accent-foreground: #013463;
			--destructive: #e63946;
			--card: #ffffff;
			--card-foreground: #013463;
			--popover: #ffffff;
			--popover-foreground: #013463;
			--border: #d1e0ed;
			--input: #ffffff;
			--ring: #0059a8;
			--sidebar: #013463;
			--sidebar-foreground: #e5edf5;
			--sidebar-primary: #0059a8;
			--sidebar-primary-foreground: #ffffff;
			--sidebar-accent: #ffd646;
			--sidebar-accent-foreground: #013463;
			--sidebar-border: #024080;
			--sidebar-ring: #ffd646;
			--chart-1: #0059a8;
			--chart-2: #009ee3;
			--chart-3: #ffd646;
			--chart-4: #5a7a9b;
			--chart-5: #1e88e5;

			--font-sans: "Inter";
			--font-heading: "Inter";
			--font-serif: "Playfair Display";
			--font-mono: "JetBrains Mono";

			--radius: 0.75rem;
		}
		</style>
	</head>
	<body>
		<div class="flex flex-col h-full bg-background">
			<div class="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
				<button class="flex items-center justify-center size-11 rounded-xl bg-muted">
					<iconify-icon
						icon="solar:arrow-left-linear"
						class="size-6 text-foreground"
					></iconify-icon>
				</button>
				<h1 class="text-lg font-bold font-heading text-foreground">Rekap Poin Mahasiswa</h1>
				<div class="size-11"/>
			</div>
			<div class="flex-1 overflow-y-auto px-6 py-6 space-y-4">
				<div class="relative">
					<iconify-icon
						icon="solar:magnifer-linear"
						class="size-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2"
					></iconify-icon>
					<input
						type="text"
						placeholder="Cari nama atau NIM mahasiswa..."
						class="w-full pl-12 pr-4 py-3 rounded-xl bg-input border border-border text-sm"
					>
				</div>
				<div class="flex gap-3">
					<select
						class="flex-1 px-4 py-3 rounded-xl bg-input border border-border text-sm text-foreground"
					>
						<option>Semua Semester</option>
						<option>Semester 1</option>
						<option>Semester 2</option>
						<option>Semester 3</option>
						<option>Semester 4</option>
						<option>Semester 5</option>
						<option>Semester 6</option>
						<option>Semester 7</option>
						<option>Semester 8</option>
					</select>
					<select
						class="flex-1 px-4 py-3 rounded-xl bg-input border border-border text-sm text-foreground"
					>
						<option>Semua Kategori</option>
						<option>Akademik</option>
						<option>Organisasi</option>
						<option>Prestasi</option>
						<option>Kegiatan Sosial</option>
					</select>
				</div>
				<div class="space-y-3">
					<div class="bg-card rounded-2xl p-4 shadow-sm border border-border">
						<div class="flex items-center gap-4 mb-3">
							<img
								alt="Mahasiswa"
								src="https://randomuser.me/api/portraits/women/32.jpg"
								class="size-14 rounded-xl border-2 border-border"
							>
							<div class="flex-1">
								<p class="text-sm font-bold text-foreground">Siti Nurhaliza</p>
								<p class="text-xs text-muted-foreground">21050123001</p>
							</div>
							<div class="flex flex-col items-end gap-1">
								<span class="px-3 py-1 rounded-lg bg-green-500/10 text-green-600 text-xs font-bold"
									>350 Poin</span
								>
							</div>
						</div>
						<div class="flex items-center justify-between pt-3 border-t border-border">
							<p class="text-xs text-muted-foreground">
								Status: <span class="font-semibold text-green-600">Sangat Aktif</span>
							</p>
							<button
								class="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
							>
								Lihat Detail
							</button>
						</div>
					</div>
					<div class="bg-card rounded-2xl p-4 shadow-sm border border-border">
						<div class="flex items-center gap-4 mb-3">
							<img
								alt="Mahasiswa"
								src="https://randomuser.me/api/portraits/men/67.jpg"
								class="size-14 rounded-xl border-2 border-border"
							>
							<div class="flex-1">
								<p class="text-sm font-bold text-foreground">Ahmad Fauzi</p>
								<p class="text-xs text-muted-foreground">21050123002</p>
							</div>
							<div class="flex flex-col items-end gap-1">
								<span class="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-600 text-xs font-bold"
									>245 Poin</span
								>
							</div>
						</div>
						<div class="flex items-center justify-between pt-3 border-t border-border">
							<p class="text-xs text-muted-foreground">
								Status: <span class="font-semibold text-blue-600">Aktif</span>
							</p>
							<button
								class="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
							>
								Lihat Detail
							</button>
						</div>
					</div>
					<div class="bg-card rounded-2xl p-4 shadow-sm border border-border">
						<div class="flex items-center gap-4 mb-3">
							<img
								alt="Mahasiswa"
								src="https://randomuser.me/api/portraits/women/54.jpg"
								class="size-14 rounded-xl border-2 border-border"
							>
							<div class="flex-1">
								<p class="text-sm font-bold text-foreground">Dewi Safitri</p>
								<p class="text-xs text-muted-foreground">21050123003</p>
							</div>
							<div class="flex flex-col items-end gap-1">
								<span
									class="px-3 py-1 rounded-lg bg-yellow-500/10 text-yellow-700 text-xs font-bold"
									>178 Poin</span
								>
							</div>
						</div>
						<div class="flex items-center justify-between pt-3 border-t border-border">
							<p class="text-xs text-muted-foreground">
								Status: <span class="font-semibold text-yellow-700">Cukup Aktif</span>
							</p>
							<button
								class="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
							>
								Lihat Detail
							</button>
						</div>
					</div>
					<div class="bg-card rounded-2xl p-4 shadow-sm border border-border">
						<div class="flex items-center gap-4 mb-3">
							<img
								alt="Mahasiswa"
								src="https://randomuser.me/api/portraits/men/28.jpg"
								class="size-14 rounded-xl border-2 border-border"
							>
							<div class="flex-1">
								<p class="text-sm font-bold text-foreground">Budi Santoso</p>
								<p class="text-xs text-muted-foreground">21050123004</p>
							</div>
							<div class="flex flex-col items-end gap-1">
								<span class="px-3 py-1 rounded-lg bg-red-500/10 text-destructive text-xs font-bold"
									>125 Poin</span
								>
							</div>
						</div>
						<div class="flex items-center justify-between pt-3 border-t border-border">
							<p class="text-xs text-muted-foreground">
								Status: <span class="font-semibold text-destructive">Pasif</span>
							</p>
							<button
								class="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
							>
								Lihat Detail
							</button>
						</div>
					</div>
					<div class="bg-card rounded-2xl p-4 shadow-sm border border-border">
						<div class="flex items-center gap-4 mb-3">
							<img
								alt="Mahasiswa"
								src="https://randomuser.me/api/portraits/women/19.jpg"
								class="size-14 rounded-xl border-2 border-border"
							>
							<div class="flex-1">
								<p class="text-sm font-bold text-foreground">Rina Wulandari</p>
								<p class="text-xs text-muted-foreground">21050123005</p>
							</div>
							<div class="flex flex-col items-end gap-1">
								<span class="px-3 py-1 rounded-lg bg-green-500/10 text-green-600 text-xs font-bold"
									>420 Poin</span
								>
							</div>
						</div>
						<div class="flex items-center justify-between pt-3 border-t border-border">
							<p class="text-xs text-muted-foreground">
								Status: <span class="font-semibold text-green-600">Sangat Aktif</span>
							</p>
							<button
								class="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
							>
								Lihat Detail
							</button>
						</div>
					</div>
					<div class="bg-card rounded-2xl p-4 shadow-sm border border-border">
						<div class="flex items-center gap-4 mb-3">
							<img
								alt="Mahasiswa"
								src="https://randomuser.me/api/portraits/men/41.jpg"
								class="size-14 rounded-xl border-2 border-border"
							>
							<div class="flex-1">
								<p class="text-sm font-bold text-foreground">Rizki Pratama</p>
								<p class="text-xs text-muted-foreground">21050123006</p>
							</div>
							<div class="flex flex-col items-end gap-1">
								<span class="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-600 text-xs font-bold"
									>215 Poin</span
								>
							</div>
						</div>
						<div class="flex items-center justify-between pt-3 border-t border-border">
							<p class="text-xs text-muted-foreground">
								Status: <span class="font-semibold text-blue-600">Aktif</span>
							</p>
							<button
								class="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
							>
								Lihat Detail
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>


* HALAMAN RIWAYAT VERIFIKASI
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>RiwayatVerifikasiDosen</title>
		<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link
			href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
			rel="stylesheet"
		>
		<link
			href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&display=swap"
			rel="stylesheet"
		>
		<link
			href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap"
			rel="stylesheet"
		>
		<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
		<script src="https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js"></script>
		<style type="text/tailwindcss">
		@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  --font-font-sans: var(--font-sans);
  --font-font-heading: var(--font-heading);
  --font-font-serif: var(--font-serif);
  --font-font-mono: var(--font-mono);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --tracking-tighter: calc(var(--tracking-normal) - 0.05em);
  --tracking-tight: calc(var(--tracking-normal) - 0.025em);
  --tracking-wide: calc(var(--tracking-normal) + 0.025em);
  --tracking-wider: calc(var(--tracking-normal) + 0.05em);
  --tracking-widest: calc(var(--tracking-normal) + 0.1em);
  --tracking-normal: var(--tracking-normal);
}

		:root {
			--background: #f9fafb;
			--foreground: #013463;
			--primary: #0059a8;
			--primary-foreground: #ffffff;
			--secondary: #009ee3;
			--secondary-foreground: #ffffff;
			--muted: #e5edf5;
			--muted-foreground: #5a7a9b;
			--accent: #ffd646;
			--accent-foreground: #013463;
			--destructive: #e63946;
			--card: #ffffff;
			--card-foreground: #013463;
			--popover: #ffffff;
			--popover-foreground: #013463;
			--border: #d1e0ed;
			--input: #ffffff;
			--ring: #0059a8;
			--sidebar: #013463;
			--sidebar-foreground: #e5edf5;
			--sidebar-primary: #0059a8;
			--sidebar-primary-foreground: #ffffff;
			--sidebar-accent: #ffd646;
			--sidebar-accent-foreground: #013463;
			--sidebar-border: #024080;
			--sidebar-ring: #ffd646;
			--chart-1: #0059a8;
			--chart-2: #009ee3;
			--chart-3: #ffd646;
			--chart-4: #5a7a9b;
			--chart-5: #1e88e5;

			--font-sans: "Inter";
			--font-heading: "Inter";
			--font-serif: "Playfair Display";
			--font-mono: "JetBrains Mono";

			--radius: 0.75rem;
		}
		</style>
	</head>
	<body>
		<div class="flex flex-col h-full bg-background">
			<div class="flex items-center justify-between px-4 py-3 bg-primary border-b border-primary">
				<button class="flex items-center justify-center size-11">
					<iconify-icon icon="solar:arrow-left-linear" class="size-6 text-white"></iconify-icon>
				</button>
				<h1 class="text-lg font-semibold text-white font-heading">Riwayat Verifikasi</h1>
				<div class="size-11"/>
			</div>
			<div class="px-6 py-4 bg-card border-b border-border">
				<div class="space-y-3">
					<div class="flex items-center gap-3">
						<div class="flex-1">
							<label class="block text-xs font-medium text-muted-foreground mb-1.5">
								Tanggal Mulai
							</label>
							<div
								class="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-input border border-border"
							>
								<iconify-icon
									icon="solar:calendar-bold"
									class="size-5 text-muted-foreground"
								></iconify-icon>
								<input
									type="date"
									class="flex-1 bg-transparent text-sm text-foreground outline-none"
								>
							</div>
						</div>
						<div class="flex-1">
							<label class="block text-xs font-medium text-muted-foreground mb-1.5">
								Tanggal Akhir
							</label>
							<div
								class="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-input border border-border"
							>
								<iconify-icon
									icon="solar:calendar-bold"
									class="size-5 text-muted-foreground"
								></iconify-icon>
								<input
									type="date"
									class="flex-1 bg-transparent text-sm text-foreground outline-none"
								>
							</div>
						</div>
					</div>
					<div>
						<label class="block text-xs font-medium text-muted-foreground mb-1.5">
							Status Verifikasi
						</label>
						<div class="flex gap-2">
							<button
								class="flex-1 py-2.5 px-4 rounded-xl bg-primary text-white text-sm font-semibold"
							>
								Semua
							</button>
							<button
								class="flex-1 py-2.5 px-4 rounded-xl bg-muted text-muted-foreground text-sm font-semibold"
							>
								Disetujui
							</button>
							<button
								class="flex-1 py-2.5 px-4 rounded-xl bg-muted text-muted-foreground text-sm font-semibold"
							>
								Ditolak
							</button>
						</div>
					</div>
				</div>
			</div>
			<div class="flex-1 overflow-y-auto px-6 py-4 space-y-3">
				<div class="bg-card rounded-2xl p-4 shadow-sm border border-border">
					<div class="flex items-start justify-between mb-3">
						<div class="flex-1">
							<p class="text-sm font-bold text-foreground">Ahmad Fauzi</p>
							<p class="text-xs text-muted-foreground">NIM: 2021110045</p>
						</div>
						<div class="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/10">
							<iconify-icon
								icon="solar:check-circle-bold"
								class="size-4 text-green-600"
							></iconify-icon>
							<span class="text-xs font-semibold text-green-600">Disetujui</span>
						</div>
					</div>
					<div class="space-y-2">
						<p class="text-sm font-semibold text-foreground">
							Seminar Nasional Teknologi Informasi 2024
						</p>
						<div class="flex items-center gap-2">
							<div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10">
								<iconify-icon
									icon="solar:mortarboard-bold"
									class="size-4 text-primary"
								></iconify-icon>
								<span class="text-xs font-medium text-primary">Akademik</span>
							</div>
							<span class="text-xs text-muted-foreground">15 Mar 2024</span>
						</div>
						<div class="flex items-center justify-between pt-2 border-t border-border">
							<p class="text-xs text-muted-foreground">Poin Diberikan</p>
							<p class="text-base font-bold text-accent-foreground">+15</p>
						</div>
					</div>
				</div>
				<div class="bg-card rounded-2xl p-4 shadow-sm border border-border">
					<div class="flex items-start justify-between mb-3">
						<div class="flex-1">
							<p class="text-sm font-bold text-foreground">Siti Nurhaliza</p>
							<p class="text-xs text-muted-foreground">NIM: 2021110032</p>
						</div>
						<div class="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/10">
							<iconify-icon
								icon="solar:check-circle-bold"
								class="size-4 text-green-600"
							></iconify-icon>
							<span class="text-xs font-semibold text-green-600">Disetujui</span>
						</div>
					</div>
					<div class="space-y-2">
						<p class="text-sm font-semibold text-foreground">
							Workshop Pengembangan Aplikasi Mobile
						</p>
						<div class="flex items-center gap-2">
							<div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10">
								<iconify-icon
									icon="solar:mortarboard-bold"
									class="size-4 text-primary"
								></iconify-icon>
								<span class="text-xs font-medium text-primary">Akademik</span>
							</div>
							<span class="text-xs text-muted-foreground">14 Mar 2024</span>
						</div>
						<div class="flex items-center justify-between pt-2 border-t border-border">
							<p class="text-xs text-muted-foreground">Poin Diberikan</p>
							<p class="text-base font-bold text-accent-foreground">+10</p>
						</div>
					</div>
				</div>
				<div class="bg-card rounded-2xl p-4 shadow-sm border border-border">
					<div class="flex items-start justify-between mb-3">
						<div class="flex-1">
							<p class="text-sm font-bold text-foreground">Budi Santoso</p>
							<p class="text-xs text-muted-foreground">NIM: 2021110018</p>
						</div>
						<div class="flex items-center gap-2 px-3 py-1 rounded-lg bg-destructive/10">
							<iconify-icon
								icon="solar:close-circle-bold"
								class="size-4 text-destructive"
							></iconify-icon>
							<span class="text-xs font-semibold text-destructive">Ditolak</span>
						</div>
					</div>
					<div class="space-y-2">
						<p class="text-sm font-semibold text-foreground">
							Lomba Pemrograman Tingkat Universitas
						</p>
						<div class="flex items-center gap-2">
							<div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10">
								<iconify-icon
									icon="solar:mortarboard-bold"
									class="size-4 text-primary"
								></iconify-icon>
								<span class="text-xs font-medium text-primary">Akademik</span>
							</div>
							<span class="text-xs text-muted-foreground">13 Mar 2024</span>
						</div>
						<div class="mt-2 p-3 rounded-xl bg-destructive/5 border border-destructive/20">
							<p class="text-xs font-medium text-destructive mb-1">Alasan Penolakan:</p>
							<p class="text-xs text-foreground">
								Bukti sertifikat tidak sesuai dengan format yang ditentukan. Silakan upload ulang
								dengan format PDF atau JPG yang jelas.
							</p>
						</div>
					</div>
				</div>
				<div class="bg-card rounded-2xl p-4 shadow-sm border border-border">
					<div class="flex items-start justify-between mb-3">
						<div class="flex-1">
							<p class="text-sm font-bold text-foreground">Dewi Lestari</p>
							<p class="text-xs text-muted-foreground">NIM: 2021110056</p>
						</div>
						<div class="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/10">
							<iconify-icon
								icon="solar:check-circle-bold"
								class="size-4 text-green-600"
							></iconify-icon>
							<span class="text-xs font-semibold text-green-600">Disetujui</span>
						</div>
					</div>
					<div class="space-y-2">
						<p class="text-sm font-semibold text-foreground">
							Pelatihan Sertifikasi Oracle Database
						</p>
						<div class="flex items-center gap-2">
							<div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10">
								<iconify-icon
									icon="solar:mortarboard-bold"
									class="size-4 text-primary"
								></iconify-icon>
								<span class="text-xs font-medium text-primary">Akademik</span>
							</div>
							<span class="text-xs text-muted-foreground">12 Mar 2024</span>
						</div>
						<div class="flex items-center justify-between pt-2 border-t border-border">
							<p class="text-xs text-muted-foreground">Poin Diberikan</p>
							<p class="text-base font-bold text-accent-foreground">+20</p>
						</div>
					</div>
				</div>
				<div class="bg-card rounded-2xl p-4 shadow-sm border border-border">
					<div class="flex items-start justify-between mb-3">
						<div class="flex-1">
							<p class="text-sm font-bold text-foreground">Rizki Pratama</p>
							<p class="text-xs text-muted-foreground">NIM: 2021110023</p>
						</div>
						<div class="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/10">
							<iconify-icon
								icon="solar:check-circle-bold"
								class="size-4 text-green-600"
							></iconify-icon>
							<span class="text-xs font-semibold text-green-600">Disetujui</span>
						</div>
					</div>
					<div class="space-y-2">
						<p class="text-sm font-semibold text-foreground">Kompetisi Desain UI/UX Nasional</p>
						<div class="flex items-center gap-2">
							<div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10">
								<iconify-icon
									icon="solar:mortarboard-bold"
									class="size-4 text-primary"
								></iconify-icon>
								<span class="text-xs font-medium text-primary">Akademik</span>
							</div>
							<span class="text-xs text-muted-foreground">11 Mar 2024</span>
						</div>
						<div class="flex items-center justify-between pt-2 border-t border-border">
							<p class="text-xs text-muted-foreground">Poin Diberikan</p>
							<p class="text-base font-bold text-accent-foreground">+25</p>
						</div>
					</div>
				</div>
				<div class="bg-card rounded-2xl p-4 shadow-sm border border-border">
					<div class="flex items-start justify-between mb-3">
						<div class="flex-1">
							<p class="text-sm font-bold text-foreground">Maya Putri</p>
							<p class="text-xs text-muted-foreground">NIM: 2021110067</p>
						</div>
						<div class="flex items-center gap-2 px-3 py-1 rounded-lg bg-destructive/10">
							<iconify-icon
								icon="solar:close-circle-bold"
								class="size-4 text-destructive"
							></iconify-icon>
							<span class="text-xs font-semibold text-destructive">Ditolak</span>
						</div>
					</div>
					<div class="space-y-2">
						<p class="text-sm font-semibold text-foreground">Seminar Kewirausahaan Digital</p>
						<div class="flex items-center gap-2">
							<div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10">
								<iconify-icon
									icon="solar:mortarboard-bold"
									class="size-4 text-primary"
								></iconify-icon>
								<span class="text-xs font-medium text-primary">Akademik</span>
							</div>
							<span class="text-xs text-muted-foreground">10 Mar 2024</span>
						</div>
						<div class="mt-2 p-3 rounded-xl bg-destructive/5 border border-destructive/20">
							<p class="text-xs font-medium text-destructive mb-1">Alasan Penolakan:</p>
							<p class="text-xs text-foreground">
								Foto dokumentasi tidak memenuhi syarat. Harap upload foto yang menunjukkan kehadiran
								Anda di acara tersebut.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>
