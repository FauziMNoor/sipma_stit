import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  // Vercel/Netlify deployment optimization
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: ['ui-avatars.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};

export default nextConfig;
