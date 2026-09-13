import Link from "next/link";
import { Logo } from "@/components/ui/logo";
export default function NotFound() { return <main className="auth-layout"><Logo/><div className="empty-state"><span className="error-code">404</span><h1>Halaman tidak ditemukan</h1><p>Tautan mungkin sudah berubah atau tidak tersedia.</p><Link className="button button-primary" href="/">Kembali ke halaman utama</Link></div></main>; }
