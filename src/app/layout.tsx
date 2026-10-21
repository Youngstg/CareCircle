import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://carecircle.mooo.com"),
  title: {
    default: "CareCircle — Platform Kolaborasi Perawatan Keluarga & Lansia",
    template: "%s | CareCircle",
  },
  description:
    "Ruang privat terpercaya untuk keluarga berbagi tugas pengasuhan, jadwal obat harian, log perkembangan kesehatan lansia, dan dokumen medis penting bersama caregiver.",
  keywords: [
    "carecircle",
    "perawatan lansia",
    "elderly care indonesia",
    "aplikasi perawat keluarga",
    "jadwal obat lansia",
    "caregiver management",
    "catatan kesehatan keluarga",
    "manajemen pengasuhan lansia",
  ],
  authors: [{ name: "CareCircle" }],
  creator: "CareCircle",
  publisher: "CareCircle",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://carecircle.mooo.com",
    title: "CareCircle — Platform Kolaborasi Perawatan Keluarga & Lansia",
    description:
      "Ruang privat terpercaya untuk keluarga berbagi tugas pengasuhan, jadwal obat harian, log perkembangan kesehatan lansia, dan dokumen medis penting bersama caregiver.",
    siteName: "CareCircle",
    images: [
      {
        url: "/images/family-together.webp",
        width: 1200,
        height: 630,
        alt: "CareCircle — Merawat Bersama Keluarga",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CareCircle — Platform Kolaborasi Perawatan Keluarga & Lansia",
    description:
      "Ruang privat terpercaya untuk keluarga berbagi tugas, jadwal obat harian, dan catatan medis lansia bersama.",
    images: ["/images/family-together.webp"],
  },
  alternates: {
    canonical: "https://carecircle.mooo.com",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}
