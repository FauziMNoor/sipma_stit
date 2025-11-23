* DASHBOARD MUSYRIF

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>DashboardMusyrif</title>
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
			<div class="px-6 py-5 bg-card border-b border-border">
				<div class="flex items-center justify-between mb-4">
					<div class="flex items-center gap-3">
						<img
							alt="Musyrif Profile"
							src="https://randomuser.me/api/portraits/men/32.jpg"
							class="size-12 rounded-full border-2 border-primary"
						>
						<div>
							<p class="text-base font-bold text-foreground">Dashboard Musyrif/LPM</p>
							<p class="text-xs text-muted-foreground">Verifikasi &amp; Monitoring Asrama</p>
						</div>
					</div>
					<button class="flex items-center justify-center size-11 rounded-xl bg-muted">
						<iconify-icon icon="solar:bell-bold" class="size-6 text-accent"></iconify-icon>
					</button>
				</div>
			</div>
			<div class="flex-1 overflow-y-auto px-6 py-6 space-y-6">
				<div>
					<h3 class="text-lg font-bold text-foreground mb-4 font-heading">Ringkasan</h3>
					<div class="grid grid-cols-3 gap-3">
						<div class="bg-card rounded-2xl p-4 shadow-sm border border-border">
							<div class="flex flex-col items-center text-center space-y-2">
								<div class="flex items-center justify-center size-12 rounded-xl bg-destructive/10">
									<iconify-icon
										icon="solar:clock-circle-bold"
										class="size-6 text-destructive"
									></iconify-icon>
								</div>
								<p class="text-2xl font-bold text-foreground">15</p>
								<p class="text-xs text-muted-foreground">Pending Verifikasi</p>
							</div>
						</div>
						<div class="bg-card rounded-2xl p-4 shadow-sm border border-border">
							<div class="flex flex-col items-center text-center space-y-2">
								<div class="flex items-center justify-center size-12 rounded-xl bg-primary/10">
									<iconify-icon
										icon="solar:users-group-rounded-bold"
										class="size-6 text-primary"
									></iconify-icon>
								</div>
								<p class="text-2xl font-bold text-foreground">128</p>
								<p class="text-xs text-muted-foreground">Mahasiswa Monitored</p>
							</div>
						</div>
						<div class="bg-card rounded-2xl p-4 shadow-sm border border-border">
							<div class="flex flex-col items-center text-center space-y-2">
								<div class="flex items-center justify-center size-12 rounded-xl bg-green-500/10">
									<iconify-icon
										icon="solar:check-circle-bold"
										class="size-6 text-green-600"
									></iconify-icon>
								</div>
								<p class="text-2xl font-bold text-foreground">42</p>
								<p class="text-xs text-muted-foreground">Aktivitas Bulan Ini</p>
							</div>
						</div>
					</div>
				</div>
				<div>
					<h3 class="text-lg font-bold text-foreground mb-4 font-heading">Menu Utama</h3>
					<div class="grid grid-cols-2 gap-3">
						<div class="bg-gradient-to-br from-accent to-accent/70 rounded-3xl p-6 shadow-lg">
							<div class="flex flex-col items-center text-center space-y-3">
								<div class="flex items-center justify-center size-16 rounded-2xl bg-white/30">
									<iconify-icon
										icon="solar:star-bold"
										class="size-8 text-accent-foreground"
									></iconify-icon>
								</div>
								<div>
									<p class="text-base font-bold text-accent-foreground">
										Verifikasi Adab &amp; Akhlak
									</p>
									<p class="text-xs text-accent-foreground/80">Penilaian perilaku</p>
								</div>
							</div>
						</div>
						<div class="bg-gradient-to-br from-primary to-secondary rounded-3xl p-6 shadow-lg">
							<div class="flex flex-col items-center text-center space-y-3">
								<div class="flex items-center justify-center size-16 rounded-2xl bg-white/30">
									<iconify-icon
										icon="solar:buildings-2-bold"
										class="size-8 text-white"
									></iconify-icon>
								</div>
								<div>
									<p class="text-base font-bold text-white">Kegiatan Asrama</p>
									<p class="text-xs text-white/80">Verifikasi kegiatan</p>
								</div>
							</div>
						</div>
						<div class="bg-card rounded-2xl p-5 shadow-sm border border-border">
							<div class="flex flex-col items-center text-center space-y-3">
								<div class="flex items-center justify-center size-14 rounded-xl bg-destructive/10">
									<iconify-icon
										icon="solar:danger-triangle-bold"
										class="size-7 text-destructive"
									></iconify-icon>
								</div>
								<div>
									<p class="text-sm font-semibold text-foreground">Laporan Pelanggaran</p>
									<p class="text-xs text-muted-foreground">Catat pelanggaran</p>
								</div>
							</div>
						</div>
						<div class="bg-card rounded-2xl p-5 shadow-sm border border-border">
							<div class="flex flex-col items-center text-center space-y-3">
								<div class="flex items-center justify-center size-14 rounded-xl bg-secondary/10">
									<iconify-icon
										icon="solar:users-group-rounded-bold"
										class="size-7 text-secondary"
									></iconify-icon>
								</div>
								<div>
									<p class="text-sm font-semibold text-foreground">Mahasiswa Asrama</p>
									<p class="text-xs text-muted-foreground">Data penghuni</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div>
					<h3 class="text-lg font-bold text-foreground mb-4 font-heading">Aktivitas Terbaru</h3>
					<div class="space-y-3">
						<div class="bg-card rounded-2xl p-4 shadow-sm border border-border">
							<div class="flex items-start gap-3">
								<img
									alt="Student"
									src="https://randomuser.me/api/portraits/men/67.jpg"
									class="size-11 rounded-xl border border-border"
								>
								<div class="flex-1">
									<div class="flex items-start justify-between mb-1">
										<div>
											<p class="text-sm font-semibold text-foreground">Ahmad Fauzi</p>
											<p class="text-xs text-muted-foreground">Mengaji Ba'da Maghrib</p>
										</div>
										<span
											class="text-xs font-medium text-accent-foreground bg-accent/20 px-2 py-1 rounded-lg"
											>Pending</span
										>
									</div>
									<p class="text-xs text-muted-foreground">10 menit yang lalu</p>
								</div>
							</div>
						</div>
						<div class="bg-card rounded-2xl p-4 shadow-sm border border-border">
							<div class="flex items-start gap-3">
								<img
									alt="Student"
									src="https://randomuser.me/api/portraits/men/54.jpg"
									class="size-11 rounded-xl border border-border"
								>
								<div class="flex-1">
									<div class="flex items-start justify-between mb-1">
										<div>
											<p class="text-sm font-semibold text-foreground">Muhammad Rizki</p>
											<p class="text-xs text-muted-foreground">Laporan Pelanggaran Kedisiplinan</p>
										</div>
										<span
											class="text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-lg"
											>Urgent</span
										>
									</div>
									<p class="text-xs text-muted-foreground">25 menit yang lalu</p>
								</div>
							</div>
						</div>
						<div class="bg-card rounded-2xl p-4 shadow-sm border border-border">
							<div class="flex items-start gap-3">
								<img
									alt="Student"
									src="https://randomuser.me/api/portraits/men/41.jpg"
									class="size-11 rounded-xl border border-border"
								>
								<div class="flex-1">
									<div class="flex items-start justify-between mb-1">
										<div>
											<p class="text-sm font-semibold text-foreground">Abdullah Rahman</p>
											<p class="text-xs text-muted-foreground">Kajian Pagi Asrama</p>
										</div>
										<span
											class="text-xs font-medium text-accent-foreground bg-accent/20 px-2 py-1 rounded-lg"
											>Pending</span
										>
									</div>
									<p class="text-xs text-muted-foreground">1 jam yang lalu</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="pb-6">
					<div
						class="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-5 border border-primary/20"
					>
						<div class="flex items-center gap-4">
							<div class="flex items-center justify-center size-14 rounded-xl bg-primary/20">
								<iconify-icon
									icon="solar:info-circle-bold"
									class="size-7 text-primary"
								></iconify-icon>
							</div>
							<div>
								<p class="text-sm font-semibold text-foreground">Catatan Penting</p>
								<p class="text-xs text-muted-foreground">
									Verifikasi paling lambat 24 jam setelah pengajuan diterima
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>


* VERIFIKASI ADAB DAN ASRAMA

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>VerifikasiAdabAsrama</title>
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
			<div class="px-6 py-5 bg-primary">
				<div class="flex items-center justify-between mb-1">
					<button class="flex items-center justify-center size-11">
						<iconify-icon icon="solar:arrow-left-linear" class="size-6 text-white"></iconify-icon>
					</button>
					<h1 class="text-lg font-bold text-white font-heading">Verifikasi Adab &amp; Asrama</h1>
					<button class="flex items-center justify-center size-11">
						<iconify-icon icon="solar:filter-bold" class="size-6 text-white"></iconify-icon>
					</button>
				</div>
				<p class="text-sm text-white/80 text-center">
					Verifikasi kegiatan adab, akhlak &amp; asrama
				</p>
			</div>
			<div class="bg-card px-6 py-4">
				<div class="relative mb-4">
					<input
						type="text"
						class="w-full pl-11 pr-4 py-3 rounded-xl bg-input border border-border"
						placeholder="Cari nama mahasiswa atau NIM..."
					>
					<iconify-icon
						icon="solar:magnifer-linear"
						class="size-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2"
					></iconify-icon>
				</div>
				<div class="flex gap-2 overflow-x-auto pb-2">
					<button
						class="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm whitespace-nowrap shadow-sm"
					>
						Semua<span class="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs">28</span>
					</button>
					<button
						class="px-5 py-2.5 rounded-xl bg-muted text-muted-foreground font-semibold text-sm whitespace-nowrap"
					>
						Pending<span
							class="ml-2 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs"
							>15</span
						>
					</button>
					<button
						class="px-5 py-2.5 rounded-xl bg-muted text-muted-foreground font-semibold text-sm whitespace-nowrap"
					>
						Disetujui<span class="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs"
							>10</span
						>
					</button>
					<button
						class="px-5 py-2.5 rounded-xl bg-muted text-muted-foreground font-semibold text-sm whitespace-nowrap"
					>
						Ditolak<span
							class="ml-2 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs"
							>3</span
						>
					</button>
				</div>
			</div>
			<div class="flex-1 overflow-y-auto px-6 py-5 space-y-4">
				<div class="bg-green-50 rounded-2xl p-4 shadow-sm border border-green-200">
					<div class="flex gap-3 mb-3">
						<img
							alt="Mahasiswa"
							src="https://randomuser.me/api/portraits/men/45.jpg"
							class="size-12 rounded-full border-2 border-green-500"
						>
						<div class="flex-1">
							<p class="text-sm font-bold text-foreground">Muhammad Ridwan</p>
							<p class="text-xs text-muted-foreground">2201234573</p>
							<span
								class="inline-block mt-1 px-2.5 py-1 rounded-lg bg-accent text-accent-foreground text-xs font-semibold"
								>Pending</span
							>
						</div>
						<div class="text-right">
							<p class="text-lg font-bold text-green-600">+15</p>
							<p class="text-xs text-muted-foreground">Poin</p>
						</div>
					</div>
					<div class="space-y-2 mb-3">
						<p class="text-sm font-semibold text-foreground">Disiplin Shalat Berjamaah</p>
						<div class="flex items-center gap-2">
							<span class="px-2.5 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold"
								>Ibadah</span
							><span class="text-xs text-muted-foreground">•</span><span
								class="text-xs text-muted-foreground"
								>16 Maret 2024</span
							>
						</div>
					</div>
					<div class="flex items-center gap-3">
						<img
							alt="Bukti"
							src="https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/generation-assets/placeholder/square.png"
							class="size-20 rounded-xl object-cover border border-border"
						>
						<div class="flex-1 space-y-2">
							<p class="text-xs text-muted-foreground">Dokumentasi Kegiatan</p>
							<div class="flex gap-2">
								<button
									class="flex-1 py-2.5 px-3 rounded-xl bg-green-600 text-white text-xs font-semibold flex items-center justify-center gap-1"
								>
									<iconify-icon icon="solar:check-circle-bold" class="size-4"></iconify-icon>Setujui
								</button>
								<button
									class="flex-1 py-2.5 px-3 rounded-xl bg-destructive text-white text-xs font-semibold flex items-center justify-center gap-1"
								>
									<iconify-icon icon="solar:close-circle-bold" class="size-4"></iconify-icon>Tolak
								</button>
							</div>
						</div>
					</div>
				</div>
				<div class="bg-destructive/5 rounded-2xl p-4 shadow-sm border border-destructive/30">
					<div class="flex items-start gap-2 mb-3 p-2 bg-destructive/10 rounded-lg">
						<iconify-icon
							icon="solar:danger-triangle-bold"
							class="size-5 text-destructive flex-shrink-0 mt-0.5"
						></iconify-icon>
						<p class="text-xs font-semibold text-destructive">Pelanggaran - Poin Negatif</p>
					</div>
					<div class="flex gap-3 mb-3">
						<img
							alt="Mahasiswa"
							src="https://randomuser.me/api/portraits/women/28.jpg"
							class="size-12 rounded-full border-2 border-destructive"
						>
						<div class="flex-1">
							<p class="text-sm font-bold text-foreground">Nurul Aini</p>
							<p class="text-xs text-muted-foreground">2201234574</p>
							<span
								class="inline-block mt-1 px-2.5 py-1 rounded-lg bg-accent text-accent-foreground text-xs font-semibold"
								>Pending</span
							>
						</div>
						<div class="text-right">
							<p class="text-lg font-bold text-destructive">-10</p>
							<p class="text-xs text-muted-foreground">Poin</p>
						</div>
					</div>
					<div class="space-y-2 mb-3">
						<p class="text-sm font-semibold text-foreground">Terlambat Kembali ke Asrama</p>
						<div class="flex items-center gap-2">
							<span
								class="px-2.5 py-1 rounded-lg bg-destructive/20 text-destructive text-xs font-semibold"
								>Pelanggaran</span
							><span class="text-xs text-muted-foreground">•</span><span
								class="text-xs text-muted-foreground"
								>16 Maret 2024</span
							>
						</div>
					</div>
					<div class="flex items-center gap-3">
						<img
							alt="Bukti"
							src="https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/generation-assets/placeholder/square.png"
							class="size-20 rounded-xl object-cover border border-border"
						>
						<div class="flex-1 space-y-2">
							<p class="text-xs text-muted-foreground">Bukti Pelanggaran</p>
							<div class="flex gap-2">
								<button
									class="flex-1 py-2.5 px-3 rounded-xl bg-green-600 text-white text-xs font-semibold flex items-center justify-center gap-1"
								>
									<iconify-icon icon="solar:check-circle-bold" class="size-4"></iconify-icon>Setujui
								</button>
								<button
									class="flex-1 py-2.5 px-3 rounded-xl bg-destructive text-white text-xs font-semibold flex items-center justify-center gap-1"
								>
									<iconify-icon icon="solar:close-circle-bold" class="size-4"></iconify-icon>Tolak
								</button>
							</div>
						</div>
					</div>
				</div>
				<div class="bg-green-50 rounded-2xl p-4 shadow-sm border border-green-200">
					<div class="flex gap-3 mb-3">
						<img
							alt="Mahasiswa"
							src="https://randomuser.me/api/portraits/men/56.jpg"
							class="size-12 rounded-full border-2 border-green-500"
						>
						<div class="flex-1">
							<p class="text-sm font-bold text-foreground">Faisal Rahman</p>
							<p class="text-xs text-muted-foreground">2201234575</p>
							<span
								class="inline-block mt-1 px-2.5 py-1 rounded-lg bg-accent text-accent-foreground text-xs font-semibold"
								>Pending</span
							>
						</div>
						<div class="text-right">
							<p class="text-lg font-bold text-green-600">+10</p>
							<p class="text-xs text-muted-foreground">Poin</p>
						</div>
					</div>
					<div class="space-y-2 mb-3">
						<p class="text-sm font-semibold text-foreground">Membantu Kebersihan Asrama</p>
						<div class="flex items-center gap-2">
							<span class="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold"
								>Kegiatan Asrama</span
							><span class="text-xs text-muted-foreground">•</span><span
								class="text-xs text-muted-foreground"
								>15 Maret 2024</span
							>
						</div>
					</div>
					<div class="flex items-center gap-3">
						<img
							alt="Bukti"
							src="https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/generation-assets/placeholder/square.png"
							class="size-20 rounded-xl object-cover border border-border"
						>
						<div class="flex-1 space-y-2">
							<p class="text-xs text-muted-foreground">Dokumentasi Kegiatan</p>
							<div class="flex gap-2">
								<button
									class="flex-1 py-2.5 px-3 rounded-xl bg-green-600 text-white text-xs font-semibold flex items-center justify-center gap-1"
								>
									<iconify-icon icon="solar:check-circle-bold" class="size-4"></iconify-icon>Setujui
								</button>
								<button
									class="flex-1 py-2.5 px-3 rounded-xl bg-destructive text-white text-xs font-semibold flex items-center justify-center gap-1"
								>
									<iconify-icon icon="solar:close-circle-bold" class="size-4"></iconify-icon>Tolak
								</button>
							</div>
						</div>
					</div>
				</div>
				<div class="bg-green-50 rounded-2xl p-4 shadow-sm border border-green-200">
					<div class="flex gap-3 mb-3">
						<img
							alt="Mahasiswa"
							src="https://randomuser.me/api/portraits/women/63.jpg"
							class="size-12 rounded-full border-2 border-green-500"
						>
						<div class="flex-1">
							<p class="text-sm font-bold text-foreground">Zahra Putri</p>
							<p class="text-xs text-muted-foreground">2201234576</p>
							<span
								class="inline-block mt-1 px-2.5 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold"
								>Disetujui</span
							>
						</div>
						<div class="text-right">
							<p class="text-lg font-bold text-green-600">+20</p>
							<p class="text-xs text-muted-foreground">Poin</p>
						</div>
					</div>
					<div class="space-y-2 mb-3">
						<p class="text-sm font-semibold text-foreground">Adab Baik - Membantu Teman</p>
						<div class="flex items-center gap-2">
							<span
								class="px-2.5 py-1 rounded-lg bg-accent/30 text-accent-foreground text-xs font-semibold"
								>Adab &amp; Akhlak</span
							><span class="text-xs text-muted-foreground">•</span><span
								class="text-xs text-muted-foreground"
								>15 Maret 2024</span
							>
						</div>
					</div>
					<div class="flex items-center gap-3">
						<img
							alt="Bukti"
							src="https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/generation-assets/placeholder/square.png"
							class="size-20 rounded-xl object-cover border border-border"
						>
						<div class="flex-1 space-y-2">
							<p class="text-xs text-muted-foreground">Dokumentasi Kegiatan</p>
							<div class="flex gap-2">
								<button
									class="flex-1 py-2 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
								>
									Lihat Detail
								</button>
							</div>
						</div>
					</div>
				</div>
				<div class="bg-green-50 rounded-2xl p-4 shadow-sm border border-green-200">
					<div class="flex gap-3 mb-3">
						<img
							alt="Mahasiswa"
							src="https://randomuser.me/api/portraits/men/34.jpg"
							class="size-12 rounded-full border-2 border-green-500"
						>
						<div class="flex-1">
							<p class="text-sm font-bold text-foreground">Hadi Wijaya</p>
							<p class="text-xs text-muted-foreground">2201234577</p>
							<span
								class="inline-block mt-1 px-2.5 py-1 rounded-lg bg-accent text-accent-foreground text-xs font-semibold"
								>Pending</span
							>
						</div>
						<div class="text-right">
							<p class="text-lg font-bold text-green-600">+15</p>
							<p class="text-xs text-muted-foreground">Poin</p>
						</div>
					</div>
					<div class="space-y-2 mb-3">
						<p class="text-sm font-semibold text-foreground">Kajian Rutin Asrama</p>
						<div class="flex items-center gap-2">
							<span class="px-2.5 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold"
								>Ibadah</span
							><span class="text-xs text-muted-foreground">•</span><span
								class="text-xs text-muted-foreground"
								>14 Maret 2024</span
							>
						</div>
					</div>
					<div class="flex items-center gap-3">
						<img
							alt="Bukti"
							src="https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/generation-assets/placeholder/square.png"
							class="size-20 rounded-xl object-cover border border-border"
						>
						<div class="flex-1 space-y-2">
							<p class="text-xs text-muted-foreground">Dokumentasi Kegiatan</p>
							<div class="flex gap-2">
								<button
									class="flex-1 py-2.5 px-3 rounded-xl bg-green-600 text-white text-xs font-semibold flex items-center justify-center gap-1"
								>
									<iconify-icon icon="solar:check-circle-bold" class="size-4"></iconify-icon>Setujui
								</button>
								<button
									class="flex-1 py-2.5 px-3 rounded-xl bg-destructive text-white text-xs font-semibold flex items-center justify-center gap-1"
								>
									<iconify-icon icon="solar:close-circle-bold" class="size-4"></iconify-icon>Tolak
								</button>
							</div>
						</div>
					</div>
				</div>
				<div class="bg-green-50 rounded-2xl p-4 shadow-sm border border-green-200">
					<div class="flex gap-3 mb-3">
						<img
							alt="Mahasiswa"
							src="https://randomuser.me/api/portraits/women/77.jpg"
							class="size-12 rounded-full border-2 border-green-500"
						>
						<div class="flex-1">
							<p class="text-sm font-bold text-foreground">Aisyah Kamila</p>
							<p class="text-xs text-muted-foreground">2201234578</p>
							<span
								class="inline-block mt-1 px-2.5 py-1 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold"
								>Ditolak</span
							>
						</div>
						<div class="text-right">
							<p class="text-lg font-bold text-muted-foreground">+10</p>
							<p class="text-xs text-muted-foreground">Poin</p>
						</div>
					</div>
					<div class="space-y-2 mb-3">
						<p class="text-sm font-semibold text-foreground">Piket Bersama Asrama</p>
						<div class="flex items-center gap-2">
							<span class="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold"
								>Kegiatan Asrama</span
							><span class="text-xs text-muted-foreground">•</span><span
								class="text-xs text-muted-foreground"
								>14 Maret 2024</span
							>
						</div>
					</div>
					<div class="flex items-center gap-3">
						<img
							alt="Bukti"
							src="https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/generation-assets/placeholder/square.png"
							class="size-20 rounded-xl object-cover border border-border"
						>
						<div class="flex-1 space-y-2">
							<p class="text-xs text-muted-foreground">Dokumentasi Kegiatan</p>
							<div class="flex gap-2">
								<button
									class="flex-1 py-2 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
								>
									Lihat Detail
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>
