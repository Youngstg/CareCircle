import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CareCircle — Platform Kolaborasi Perawatan Keluarga",
    short_name: "CareCircle",
    description: "Ruang privat terpercaya untuk keluarga berbagi tugas, jadwal agenda, kontak darurat, dan dokumen penting.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#F8FAF7",
    theme_color: "#356859",
    icons: [
      {
        src: "/brand/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    orientation: "portrait-primary",
    categories: ["health", "family", "lifestyle", "productivity"],
    lang: "id",
    shortcuts: [
      {
        name: "Tugas Keluarga",
        short_name: "Tugas",
        description: "Buka daftar tugas keluarga",
        url: "/tasks",
        icons: [{ src: "/brand/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Jadwal & Agenda",
        short_name: "Jadwal",
        description: "Lihat jadwal kontrol dan agenda mendatang",
        url: "/schedule",
        icons: [{ src: "/brand/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Kontak Darurat",
        short_name: "Kontak",
        description: "Hubungi kontak penting & medis utama",
        url: "/contacts",
        icons: [{ src: "/brand/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
