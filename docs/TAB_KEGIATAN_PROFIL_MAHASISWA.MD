HALAMAN KEGIATAN
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Kegiatan</title>
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
				<div class="flex items-center justify-between">
					<button class="flex items-center justify-center size-11">
						<iconify-icon
							icon="solar:arrow-left-linear"
							class="size-6 text-foreground"
						></iconify-icon>
					</button>
					<h1 class="text-lg font-bold font-heading text-foreground">Kegiatan Saya</h1>
					<div class="size-11"/>
				</div>
			</div>
			<div class="px-6 py-4 bg-card border-b border-border">
				<div class="flex gap-3 overflow-x-auto">
					<button
						class="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold whitespace-nowrap"
					>
						Semua
					</button>
					<button
						class="px-4 py-2 rounded-xl bg-muted text-muted-foreground text-sm font-semibold whitespace-nowrap"
					>
						Pending
					</button>
					<button
						class="px-4 py-2 rounded-xl bg-muted text-muted-foreground text-sm font-semibold whitespace-nowrap"
					>
						Disetujui
					</button>
					<button
						class="px-4 py-2 rounded-xl bg-muted text-muted-foreground text-sm font-semibold whitespace-nowrap"
					>
						Ditolak
					</button>
				</div>
			</div>
			<div class="flex-1 overflow-y-auto px-6 py-6 space-y-4">
				<div class="bg-card rounded-2xl p-5 shadow-sm border border-border">
					<div class="flex items-start gap-4">
						<div class="flex items-center justify-center size-12 rounded-xl bg-primary/10 shrink-0">
							<span class="text-2xl">🎓</span>
						</div>
						<div class="flex-1 min-w-0">
							<div class="flex items-start justify-between gap-3 mb-2">
								<h3 class="text-base font-semibold text-foreground">Seminar Nasional Pendidikan</h3>
								<span
									class="px-3 py-1 rounded-full text-xs font-semibold bg-accent/20 text-accent-foreground whitespace-nowrap"
									>Pending</span
								>
							</div>
							<div class="space-y-2">
								<div class="flex items-center gap-2 text-sm text-muted-foreground">
									<iconify-icon icon="solar:calendar-linear" class="size-4"></iconify-icon>
									<span>15 Januari 2024</span>
								</div>
								<div class="flex items-center gap-2 text-sm text-muted-foreground">
									<iconify-icon icon="solar:tag-linear" class="size-4"></iconify-icon>
									<span>Akademik</span>
								</div>
								<div class="flex items-center gap-2">
									<iconify-icon icon="solar:star-bold" class="size-4 text-accent"></iconify-icon>
									<span class="text-sm font-semibold text-foreground">+20 Poin</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="bg-card rounded-2xl p-5 shadow-sm border border-border">
					<div class="flex items-start gap-4">
						<div
							class="flex items-center justify-center size-12 rounded-xl bg-secondary/10 shrink-0"
						>
							<span class="text-2xl">🕌</span>
						</div>
						<div class="flex-1 min-w-0">
							<div class="flex items-start justify-between gap-3 mb-2">
								<h3 class="text-base font-semibold text-foreground">Kajian Rutin Masjid</h3>
								<span
									class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 whitespace-nowrap"
									>Disetujui</span
								>
							</div>
							<div class="space-y-2">
								<div class="flex items-center gap-2 text-sm text-muted-foreground">
									<iconify-icon icon="solar:calendar-linear" class="size-4"></iconify-icon>
									<span>12 Januari 2024</span>
								</div>
								<div class="flex items-center gap-2 text-sm text-muted-foreground">
									<iconify-icon icon="solar:tag-linear" class="size-4"></iconify-icon>
									<span>Dakwah &amp; Keagamaan</span>
								</div>
								<div class="flex items-center gap-2">
									<iconify-icon icon="solar:star-bold" class="size-4 text-accent"></iconify-icon>
									<span class="text-sm font-semibold text-foreground">+15 Poin</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="bg-card rounded-2xl p-5 shadow-sm border border-border">
					<div class="flex items-start gap-4">
						<div class="flex items-center justify-center size-12 rounded-xl bg-chart-2/10 shrink-0">
							<span class="text-2xl">🤝</span>
						</div>
						<div class="flex-1 min-w-0">
							<div class="flex items-start justify-between gap-3 mb-2">
								<h3 class="text-base font-semibold text-foreground">Bakti Sosial Masyarakat</h3>
								<span
									class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 whitespace-nowrap"
									>Disetujui</span
								>
							</div>
							<div class="space-y-2">
								<div class="flex items-center gap-2 text-sm text-muted-foreground">
									<iconify-icon icon="solar:calendar-linear" class="size-4"></iconify-icon>
									<span>08 Januari 2024</span>
								</div>
								<div class="flex items-center gap-2 text-sm text-muted-foreground">
									<iconify-icon icon="solar:tag-linear" class="size-4"></iconify-icon>
									<span>Sosial &amp; Kepemimpinan</span>
								</div>
								<div class="flex items-center gap-2">
									<iconify-icon icon="solar:star-bold" class="size-4 text-accent"></iconify-icon>
									<span class="text-sm font-semibold text-foreground">+25 Poin</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="bg-card rounded-2xl p-5 shadow-sm border border-border">
					<div class="flex items-start gap-4">
						<div class="flex items-center justify-center size-12 rounded-xl bg-primary/10 shrink-0">
							<span class="text-2xl">🎓</span>
						</div>
						<div class="flex-1 min-w-0">
							<div class="flex items-start justify-between gap-3 mb-2">
								<h3 class="text-base font-semibold text-foreground">
									Workshop Metodologi Penelitian
								</h3>
								<span
									class="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 whitespace-nowrap"
									>Ditolak</span
								>
							</div>
							<div class="space-y-2">
								<div class="flex items-center gap-2 text-sm text-muted-foreground">
									<iconify-icon icon="solar:calendar-linear" class="size-4"></iconify-icon>
									<span>05 Januari 2024</span>
								</div>
								<div class="flex items-center gap-2 text-sm text-muted-foreground">
									<iconify-icon icon="solar:tag-linear" class="size-4"></iconify-icon>
									<span>Akademik</span>
								</div>
								<div class="flex items-center gap-2">
									<iconify-icon
										icon="solar:star-bold"
										class="size-4 text-muted-foreground"
									></iconify-icon>
									<span class="text-sm font-semibold text-muted-foreground">+0 Poin</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="bg-card rounded-2xl p-5 shadow-sm border border-border">
					<div class="flex items-start gap-4">
						<div
							class="flex items-center justify-center size-12 rounded-xl bg-green-500/10 shrink-0"
						>
							<span class="text-2xl">🌿</span>
						</div>
						<div class="flex-1 min-w-0">
							<div class="flex items-start justify-between gap-3 mb-2">
								<h3 class="text-base font-semibold text-foreground">Tadarus Pagi Bersama</h3>
								<span
									class="px-3 py-1 rounded-full text-xs font-semibold bg-accent/20 text-accent-foreground whitespace-nowrap"
									>Pending</span
								>
							</div>
							<div class="space-y-2">
								<div class="flex items-center gap-2 text-sm text-muted-foreground">
									<iconify-icon icon="solar:calendar-linear" class="size-4"></iconify-icon>
									<span>03 Januari 2024</span>
								</div>
								<div class="flex items-center gap-2 text-sm text-muted-foreground">
									<iconify-icon icon="solar:tag-linear" class="size-4"></iconify-icon>
									<span>Adab &amp; Akhlak</span>
								</div>
								<div class="flex items-center gap-2">
									<iconify-icon icon="solar:star-bold" class="size-4 text-accent"></iconify-icon>
									<span class="text-sm font-semibold text-foreground">+10 Poin</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="bg-card rounded-2xl p-5 shadow-sm border border-border">
					<div class="flex items-start gap-4">
						<div
							class="flex items-center justify-center size-12 rounded-xl bg-secondary/10 shrink-0"
						>
							<span class="text-2xl">🕌</span>
						</div>
						<div class="flex-1 min-w-0">
							<div class="flex items-start justify-between gap-3 mb-2">
								<h3 class="text-base font-semibold text-foreground">Kultum Jumat</h3>
								<span
									class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 whitespace-nowrap"
									>Disetujui</span
								>
							</div>
							<div class="space-y-2">
								<div class="flex items-center gap-2 text-sm text-muted-foreground">
									<iconify-icon icon="solar:calendar-linear" class="size-4"></iconify-icon>
									<span>29 Desember 2023</span>
								</div>
								<div class="flex items-center gap-2 text-sm text-muted-foreground">
									<iconify-icon icon="solar:tag-linear" class="size-4"></iconify-icon>
									<span>Dakwah &amp; Keagamaan</span>
								</div>
								<div class="flex items-center gap-2">
									<iconify-icon icon="solar:star-bold" class="size-4 text-accent"></iconify-icon>
									<span class="text-sm font-semibold text-foreground">+15 Poin</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
				<div class="flex items-center justify-around py-3 px-6">
					<button class="flex flex-col items-center gap-1 px-4 py-2">
						<iconify-icon
							icon="solar:home-2-bold"
							class="size-6 text-muted-foreground"
						></iconify-icon>
						<span class="text-xs text-muted-foreground">Home</span>
					</button>
					<button class="flex flex-col items-center gap-1 px-4 py-2">
						<iconify-icon
							icon="solar:clipboard-list-bold"
							class="size-6 text-primary"
						></iconify-icon>
						<span class="text-xs text-primary font-semibold">Kegiatan</span>
					</button>
					<button class="flex flex-col items-center gap-1 px-4 py-2">
						<iconify-icon
							icon="solar:user-bold"
							class="size-6 text-muted-foreground"
						></iconify-icon>
						<span class="text-xs text-muted-foreground">Profil</span>
					</button>
				</div>
			</div>
		</div>
	</body>
</html>



HALAMAN PROFIL MAHASISWA
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Profil</title>
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
			<div class="flex-1 overflow-y-auto">
				<div class="bg-card px-6 pt-8 pb-6 border-b border-border">
					<div class="flex flex-col items-center text-center space-y-4">
						<img
							alt="Student Profile"
							src="https://randomuser.me/api/portraits/men/32.jpg"
							class="size-28 rounded-full border-4 border-primary shadow-lg"
						>
						<div>
							<h1 class="text-2xl font-bold text-foreground font-heading">Ahmad Fauzi</h1>
							<p class="text-sm text-muted-foreground mt-1">NIM: 2021001234</p>
						</div>
						<div
							class="inline-flex items-center px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20"
						>
							<span class="size-2 rounded-full bg-green-500 mr-2"/><span
								class="text-sm font-semibold text-green-700"
								>Aktif dan Layak Lulus</span
							>
						</div>
					</div>
				</div>
				<div class="px-6 py-6 space-y-6">
					<div style="{}" class="rounded-3xl p-6 shadow-lg">
						<div class="text-center space-y-2">
							<p class="text-sm text-white/90">Total Poin Terkumpul</p>
							<h2 class="text-5xl font-bold text-white font-heading">220</h2>
							<p class="text-xs text-white/80 mt-1">Poin</p>
						</div>
					</div>
					<div class="space-y-3">
						<div
							class="bg-card rounded-2xl p-4 border border-border flex items-center justify-between"
						>
							<div class="flex items-center gap-4">
								<div class="flex items-center justify-center size-12 rounded-xl bg-primary/10">
									<iconify-icon icon="solar:user-bold" class="size-6 text-primary"></iconify-icon>
								</div>
								<span class="text-base font-semibold text-foreground">Edit Profil</span>
							</div>
							<iconify-icon
								icon="solar:arrow-right-linear"
								class="size-5 text-muted-foreground"
							></iconify-icon>
						</div>
						<div
							class="bg-card rounded-2xl p-4 border border-border flex items-center justify-between"
						>
							<div class="flex items-center gap-4">
								<div class="flex items-center justify-center size-12 rounded-xl bg-secondary/10">
									<iconify-icon
										icon="solar:history-bold"
										class="size-6 text-secondary"
									></iconify-icon>
								</div>
								<span class="text-base font-semibold text-foreground">Riwayat Kegiatan</span>
							</div>
							<iconify-icon
								icon="solar:arrow-right-linear"
								class="size-5 text-muted-foreground"
							></iconify-icon>
						</div>
						<div class="bg-card rounded-2xl p-4 border border-border">
							<div class="flex items-center justify-between mb-4">
								<div class="flex items-center gap-4">
									<div class="flex items-center justify-center size-12 rounded-xl bg-accent/10">
										<iconify-icon
											icon="solar:chart-bold"
											class="size-6 text-accent-foreground"
										></iconify-icon>
									</div>
									<span class="text-base font-semibold text-foreground">Poin per Kategori</span>
								</div>
								<iconify-icon
									icon="solar:arrow-right-linear"
									class="size-5 text-muted-foreground"
								></iconify-icon>
							</div>
							<div class="grid grid-cols-3 gap-3">
								<div class="flex flex-col items-center space-y-2">
									<div class="flex items-center justify-center size-12 rounded-xl bg-primary/10">
										<span class="text-2xl">🎓</span>
									</div>
									<span class="text-xs text-muted-foreground text-center">Akademik</span>
								</div>
								<div class="flex flex-col items-center space-y-2">
									<div class="flex items-center justify-center size-12 rounded-xl bg-secondary/10">
										<span class="text-2xl">🕌</span>
									</div>
									<span class="text-xs text-muted-foreground text-center">Dakwah</span>
								</div>
								<div class="flex flex-col items-center space-y-2">
									<div class="flex items-center justify-center size-12 rounded-xl bg-chart-2/10">
										<span class="text-2xl">🤝</span>
									</div>
									<span class="text-xs text-muted-foreground text-center">Sosial</span>
								</div>
								<div class="flex flex-col items-center space-y-2">
									<div class="flex items-center justify-center size-12 rounded-xl bg-green-500/10">
										<span class="text-2xl">🌿</span>
									</div>
									<span class="text-xs text-muted-foreground text-center">Adab</span>
								</div>
								<div class="flex flex-col items-center space-y-2">
									<div
										class="flex items-center justify-center size-12 rounded-xl bg-destructive/10"
									>
										<span class="text-2xl">🚫</span>
									</div>
									<span class="text-xs text-muted-foreground text-center">Pelanggaran</span>
								</div>
							</div>
						</div>
						<div
							class="bg-card rounded-2xl p-4 border border-border flex items-center justify-between"
						>
							<div class="flex items-center gap-4">
								<div class="flex items-center justify-center size-12 rounded-xl bg-muted">
									<iconify-icon
										icon="solar:document-bold"
										class="size-6 text-foreground"
									></iconify-icon>
								</div>
								<div>
									<p class="text-base font-semibold text-foreground">Kebijakan Kampus</p>
									<p class="text-xs text-muted-foreground mt-0.5">Lihat PDF</p>
								</div>
							</div>
							<iconify-icon
								icon="solar:arrow-right-linear"
								class="size-5 text-muted-foreground"
							></iconify-icon>
						</div>
					</div>
					<div class="pb-8">
						<button
							class="w-full py-4 px-6 rounded-2xl font-semibold bg-destructive text-white flex items-center justify-center gap-3"
						>
							<iconify-icon icon="solar:logout-2-bold" class="size-6"></iconify-icon>
							<span>Keluar dari Akun</span>
						</button>
					</div>
				</div>
			</div>
			<div class="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
				<div class="flex items-center justify-around py-3 px-6">
					<button class="flex flex-col items-center gap-1.5 flex-1">
						<iconify-icon
							icon="solar:home-2-bold"
							class="size-6 text-muted-foreground"
						></iconify-icon>
						<span class="text-xs text-muted-foreground">Home</span>
					</button>
					<button class="flex flex-col items-center gap-1.5 flex-1">
						<iconify-icon
							icon="solar:calendar-bold"
							class="size-6 text-muted-foreground"
						></iconify-icon>
						<span class="text-xs text-muted-foreground">Kegiatan</span>
					</button>
					<button class="flex flex-col items-center gap-1.5 flex-1">
						<iconify-icon icon="solar:user-bold" class="size-6 text-primary"></iconify-icon>
						<span class="text-xs text-primary font-semibold">Profil</span>
					</button>
				</div>
			</div>
		</div>
	</body>
</html>



EDIT PROFIL MAHASISWA

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>EditProfil</title>
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
			<div class="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
				<button class="flex items-center justify-center size-11">
					<iconify-icon
						icon="solar:arrow-left-linear"
						class="size-6 text-foreground"
					></iconify-icon>
				</button>
				<h1 class="text-lg font-semibold font-heading text-foreground">Edit Profil</h1>
				<div class="size-11"/>
			</div>
			<div class="flex-1 overflow-y-auto px-6 py-6">
				<div class="bg-card rounded-3xl p-6 border border-border shadow-sm">
					<div class="flex flex-col items-center mb-6">
						<div class="relative">
							<img
								alt="Profile"
								src="https://randomuser.me/api/portraits/men/32.jpg"
								class="size-28 rounded-full border-4 border-primary shadow-lg"
							>
							<button
								class="absolute bottom-0 right-0 flex items-center justify-center size-10 rounded-full bg-accent border-2 border-card shadow-lg"
							>
								<iconify-icon
									icon="solar:camera-bold"
									class="size-5 text-accent-foreground"
								></iconify-icon>
							</button>
						</div>
						<button class="mt-3 text-sm font-semibold text-primary">Ubah Foto</button>
					</div>
					<div class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-foreground mb-2">Nama Lengkap</label>
							<input
								type="text"
								class="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground"
								placeholder="Ahmad Fauzi"
							>
						</div>
						<div>
							<label class="block text-sm font-medium text-foreground mb-2">NIM</label>
							<input
								type="text"
								disabled
								class="w-full px-4 py-3 rounded-xl border border-border bg-muted text-muted-foreground"
								placeholder="2021001234"
							>
						</div>
						<div>
							<label class="block text-sm font-medium text-foreground mb-2">Email</label>
							<input
								type="email"
								class="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground"
								placeholder="ahmad.fauzi@example.com"
							>
						</div>
						<div>
							<label class="block text-sm font-medium text-foreground mb-2">No. Telepon</label>
							<input
								type="tel"
								class="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground"
								placeholder="0812-3456-7890"
							>
						</div>
						<div>
							<label class="block text-sm font-medium text-foreground mb-2">Alamat</label>
							<textarea
								class="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground h-24 resize-none"
								placeholder="Masukkan alamat lengkap"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-foreground mb-2">Program Studi</label>
							<input
								type="text"
								class="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground"
								placeholder="Teknik Informatika"
							>
						</div>
					</div>
				</div>
				<div class="mt-6 pb-8">
					<button style="{}" class="w-full py-4 px-6 rounded-2xl font-bold text-white shadow-lg">
						Simpan Perubahan
					</button>
				</div>
			</div>
			<div class="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
				<div class="flex items-center justify-around py-3 px-6">
					<button class="flex flex-col items-center gap-1.5 flex-1">
						<iconify-icon
							icon="solar:home-2-bold"
							class="size-6 text-muted-foreground"
						></iconify-icon>
						<span class="text-xs text-muted-foreground">Home</span>
					</button>
					<button class="flex flex-col items-center gap-1.5 flex-1">
						<iconify-icon
							icon="solar:calendar-bold"
							class="size-6 text-muted-foreground"
						></iconify-icon>
						<span class="text-xs text-muted-foreground">Kegiatan</span>
					</button>
					<button class="flex flex-col items-center gap-1.5 flex-1">
						<iconify-icon icon="solar:user-bold" class="size-6 text-primary"></iconify-icon>
						<span class="text-xs text-primary font-semibold">Profil</span>
					</button>
				</div>
			</div>
		</div>
	</body>
</html>
