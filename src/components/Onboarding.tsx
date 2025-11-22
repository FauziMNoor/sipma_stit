'use client';

import { useState } from 'react';
import { BookOpen, GraduationCap, Trophy } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: BookOpen,
    title: 'Catat aktivitas kampusmu dengan mudah',
    description: 'Kelola semua kegiatan akademik dan kemahasiswaan dalam satu aplikasi',
    bgColor: 'from-primary-500/10 to-primary-600/10',
    iconBg: 'bg-primary-500/10',
    iconColor: 'text-primary-500',
  },
  {
    icon: GraduationCap,
    title: 'Pantau poin dan progress kelulusan',
    description: 'Lihat perkembangan poin positif dan negatif secara real-time',
    bgColor: 'from-success-500/10 to-success-600/10',
    iconBg: 'bg-success-500/10',
    iconColor: 'text-success-500',
  },
  {
    icon: Trophy,
    title: 'Raih prestasi dan bersaing sehat',
    description: 'Lihat ranking dan kompetisi dengan mahasiswa lainnya',
    bgColor: 'from-warning-500/10 to-warning-600/10',
    iconBg: 'bg-warning-500/10',
    iconColor: 'text-warning-500',
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header with indicators */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="w-16" />
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-primary-500'
                  : 'w-1.5 bg-neutral-300'
              }`}
            />
          ))}
        </div>
        <button
          onClick={handleSkip}
          className="px-4 py-2 text-sm font-semibold text-neutral-500 hover:text-neutral-700 transition"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm mb-12">
          <div className="relative aspect-square w-full flex items-center justify-center">
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgColor} rounded-3xl`} />
            <div className="relative z-10 flex flex-col items-center gap-6 p-8">
              <div className={`w-32 h-32 rounded-2xl ${slide.iconBg} flex items-center justify-center`}>
                <Icon className={`w-16 h-16 ${slide.iconColor}`} />
              </div>
            </div>
          </div>
        </div>
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 leading-tight">
            {slide.title}
          </h2>
          <p className="text-base text-neutral-600 leading-relaxed px-4">
            {slide.description}
          </p>
        </div>
      </div>

      {/* Button */}
      <div className="px-6 pb-8 space-y-6">
        <button
          onClick={handleNext}
          className="w-full py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 transition"
        >
          {currentSlide < slides.length - 1 ? 'Next' : 'Get Started'}
        </button>
      </div>
    </div>
  );
}

