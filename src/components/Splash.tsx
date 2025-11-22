'use client';

export function Splash() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-[#0059A8] to-[#009EE3] relative overflow-hidden">
      <div className="flex flex-col items-center justify-center flex-1 px-8">
        <div className="w-64 h-64 mb-8 drop-shadow-2xl">
          <img
            alt="STIT Logo"
            src="/logo.png"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-center space-y-2 mb-16">
          <h1 className="text-3xl font-bold text-white tracking-wide">SIPMA</h1>
          <p className="text-lg text-white/90 font-medium">Sistem Poin Mahasiswa</p>
        </div>
      </div>
      <div className="mb-16">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-white/30 rounded-full" />
          <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
}

