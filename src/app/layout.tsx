import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
export const metadata: Metadata = { title: { default: "CareCircle — Merawat bersama", template: "%s — CareCircle" }, description: "Ruang privat untuk membantu keluarga membagi tugas, jadwal, dan persiapan bersama." };
export default function RootLayout({ children }: LayoutProps<"/">) { return <html lang="id" className={geist.variable}><body>{children}</body></html>; }
