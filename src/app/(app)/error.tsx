"use client";
import { CircleAlert } from "lucide-react";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <main className="app-main"><div className="empty-state error-state"><span><CircleAlert /></span><h1>Konten belum dapat dimuat</h1><p>Periksa koneksi Anda, lalu coba lagi.</p><button className="button button-secondary" onClick={reset}>Coba lagi</button></div></main>; }
