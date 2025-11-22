import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "@/components/ui/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SIPMA - Sistem Poin Mahasiswa STIT",
  description: "Sistem Poin Mahasiswa STIT Riyadhusssholihiin untuk mencatat dan mengelola aktivitas mahasiswa",
  keywords: ["sipma", "sistem poin", "mahasiswa", "stit"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} antialiased`}>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
