import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { PwaInstallPrompt } from "@/components/pwa/pwa-install-prompt";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#356859",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://carecircle.us.ci"),
  title: {
    default: "CareCircle",
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
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CareCircle",
  },
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
    url: "https://carecircle.us.ci",
    title: "CareCircle",
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
    title: "CareCircle",
    description:
      "Ruang privat terpercaya untuk keluarga berbagi tugas, jadwal obat harian, dan catatan medis lansia bersama.",
    images: ["/images/family-together.webp"],
  },
  alternates: {
    canonical: "https://carecircle.us.ci",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={geist.variable}>
      <body>
        {children}
        <PwaInstallPrompt />
      </body>
    </html>
  );
}
