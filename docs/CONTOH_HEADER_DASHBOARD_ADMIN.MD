CONTOH HEADER DASHBOARD ADMIN

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>DashboardAdmin</title>
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
					<h1 class="text-xl font-bold text-foreground font-heading">Admin Dashboard</h1>
					<button class="flex items-center justify-center size-11 rounded-xl bg-muted">
						<iconify-icon icon="solar:settings-bold" class="size-6 text-primary"></iconify-icon>
					</button>
				</div>
			</div>
			<div class="bg-gradient-to-r from-primary to-secondary rounded-3xl mx-6 px-6 py-6 shadow-lg">
				<div class="flex items-center justify-between gap-4">
					<div class="flex items-center gap-4 flex-1">
						<div
							class="flex items-center justify-center size-12 rounded-xl bg-white/20 backdrop-blur-sm"
						>
							<span class="text-white font-bold text-lg">STIT</span>
						</div>
						<div class="flex items-center gap-3">
							<div class="size-14 rounded-full border-2 border-white overflow-hidden bg-white">
								<img
									src="https://randomuser.me/api/portraits/men/32.jpg"
									alt="Admin"
									class="w-full h-full object-cover"
								>
							</div>
							<div>
								<p class="text-white font-bold text-base">Dr. Ahmad Fauzi</p>
								<p class="text-white/80 text-sm">Administrator</p>
							</div>
						</div>
					</div>
					<div class="text-right">
						<p class="text-white font-semibold text-sm">STIT Riyadhussholihiin</p>
						<p class="text-white/80 text-xs">TA 2023/2024</p>
					</div>
				</div>
			</div>
			<div class="flex-1 overflow-y-auto px-6 py-6 space-y-6">
				<div class="grid grid-cols-2 gap-4">
					<div class="bg-card rounded-2xl p-5 shadow-sm border border-border">
						<div class="flex items-center gap-4">
							<div class="flex items-center justify-center size-12 rounded-xl bg-primary/10">
								<iconify-icon
									icon="solar:users-group-two-rounded-bold"
									class="size-6 text-primary"
								></iconify-icon>
							</div>
							<div>
								<p class="text-sm text-muted-foreground">Total Mahasiswa</p>
								<p class="text-2xl font-bold text-foreground font-heading">1,248</p>
							</div>
						</div>
					</div>
					<div class="bg-card rounded-2xl p-5 shadow-sm border border-border">
						<div class="flex items-center gap-4">
							<div class="flex items-center justify-center size-12 rounded-xl bg-secondary/10">
								<iconify-icon
									icon="solar:calendar-bold"
									class="size-6 text-secondary"
								></iconify-icon>
							</div>
							<div>
								<p class="text-sm text-muted-foreground">Total Kegiatan</p>
								<p class="text-2xl font-bold text-foreground font-heading">342</p>
							</div>
						</div>
					</div>
					<div class="bg-card rounded-2xl p-5 shadow-sm border border-border">
						<div class="flex items-center gap-4">
							<div class="flex items-center justify-center size-12 rounded-xl bg-accent/20">
								<iconify-icon
									icon="solar:clock-circle-bold"
									class="size-6 text-accent"
								></iconify-icon>
							</div>
							<div>
								<p class="text-sm text-muted-foreground">Pengajuan Pending</p>
								<div class="flex items-center gap-2">
									<p class="text-2xl font-bold text-foreground font-heading">28</p>
									<span
										class="px-2 py-0.5 text-xs font-semibold rounded-full bg-accent text-accent-foreground"
										>Pending</span
									>
								</div>
							</div>
						</div>
					</div>
					<div class="bg-card rounded-2xl p-5 shadow-sm border border-border">
						<div class="flex items-center gap-4">
							<div class="flex items-center justify-center size-12 rounded-xl bg-chart-2/10">
								<iconify-icon
									icon="solar:medal-star-bold"
									class="size-6 text-chart-2"
								></iconify-icon>
							</div>
							<div>
								<p class="text-sm text-muted-foreground">Total Poin</p>
								<p class="text-2xl font-bold text-foreground font-heading">45,620</p>
							</div>
						</div>
					</div>
				</div>
				<div>
					<h3 class="text-lg font-bold text-foreground mb-4 font-heading">Menu Manajemen</h3>
					<div class="grid grid-cols-2 gap-4">
						<div class="bg-card rounded-2xl p-6 shadow-md border border-border">
							<div class="flex flex-col items-center text-center space-y-3">
								<div class="flex items-center justify-center size-16 rounded-2xl bg-primary/10">
									<iconify-icon
										icon="solar:users-group-rounded-bold"
										class="size-8 text-primary"
									></iconify-icon>
								</div>
								<p class="text-sm font-semibold text-foreground">Kelola Mahasiswa</p>
							</div>
						</div>
						<div class="bg-card rounded-2xl p-6 shadow-md border border-border">
							<div class="flex flex-col items-center text-center space-y-3">
								<div class="flex items-center justify-center size-16 rounded-2xl bg-secondary/10">
									<iconify-icon
										icon="solar:clipboard-list-bold"
										class="size-8 text-secondary"
									></iconify-icon>
								</div>
								<p class="text-sm font-semibold text-foreground">Kelola Kegiatan</p>
							</div>
						</div>
						<div class="bg-card rounded-2xl p-6 shadow-md border border-border">
							<div class="flex flex-col items-center text-center space-y-3">
								<div class="flex items-center justify-center size-16 rounded-2xl bg-accent/20">
									<iconify-icon
										icon="solar:check-circle-bold"
										class="size-8 text-accent"
									></iconify-icon>
								</div>
								<p class="text-sm font-semibold text-foreground">Verifikasi Semua</p>
							</div>
						</div>
						<div class="bg-card rounded-2xl p-6 shadow-md border border-border">
							<div class="flex flex-col items-center text-center space-y-3">
								<div class="flex items-center justify-center size-16 rounded-2xl bg-chart-2/10">
									<iconify-icon icon="solar:chart-bold" class="size-8 text-chart-2"></iconify-icon>
								</div>
								<p class="text-sm font-semibold text-foreground">Laporan &amp; Statistik</p>
							</div>
						</div>
						<div class="bg-card rounded-2xl p-6 shadow-md border border-border">
							<div class="flex flex-col items-center text-center space-y-3">
								<div class="flex items-center justify-center size-16 rounded-2xl bg-chart-4/10">
									<iconify-icon
										icon="solar:user-id-bold"
										class="size-8 text-chart-4"
									></iconify-icon>
								</div>
								<p class="text-sm font-semibold text-foreground">Kelola Pengguna</p>
							</div>
						</div>
						<div class="bg-card rounded-2xl p-6 shadow-md border border-border">
							<div class="flex flex-col items-center text-center space-y-3">
								<div class="flex items-center justify-center size-16 rounded-2xl bg-muted">
									<iconify-icon
										icon="solar:settings-bold"
										class="size-8 text-primary"
									></iconify-icon>
								</div>
								<p class="text-sm font-semibold text-foreground">Pengaturan Sistem</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>
