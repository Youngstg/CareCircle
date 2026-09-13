"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CalendarDays, ClipboardList, FileLock2, Home, LogOut, NotebookPen, UsersRound } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { signOut } from "@/features/auth/actions";

const items = [
  { href: "/dashboard", label: "Beranda", icon: Home, available: true },
  { href: "/tasks", label: "Tugas", icon: ClipboardList, available: true },
  { href: "/documents", label: "Dokumen", icon: FileLock2, available: true },
  { href: "/schedule", label: "Jadwal", icon: CalendarDays, available: true },
  { href: "/notes", label: "Catatan", icon: NotebookPen, available: true },
  { href: "/members", label: "Anggota", icon: UsersRound, available: true },
];

export function AppShell({ children, circleName, displayName }: { children: React.ReactNode; circleName: string; displayName: string }) {
  const pathname = usePathname();
  return <div className="app-shell">
    <aside className="sidebar">
      <Logo />
      <div className="circle-label"><span>Care Circle aktif</span><strong>{circleName}</strong></div>
      <nav aria-label="Navigasi utama">{items.map(({ href, label, icon: Icon, available }) => available
        ? <Link key={label} href={href} className={pathname === href ? "active" : undefined}><Icon size={20} /><span>{label}</span></Link>
        : <button key={label} type="button" disabled aria-label={`${label}, segera hadir`} title="Segera hadir"><Icon size={20} /><span>{label}</span><small>Segera hadir</small></button>)}</nav>
      <form action={signOut}><button className="nav-button" type="submit"><LogOut size={20} />Keluar</button></form>
    </aside>
    <div className="app-column">
      <header className="app-header"><div className="mobile-brand"><Logo compact /><strong>{circleName}</strong></div><div className="profile"><button className="icon-button" aria-label="Notifikasi"><Bell size={20} /></button><span className="avatar" aria-hidden="true">{displayName.slice(0, 1).toUpperCase()}</span><span>{displayName}</span></div></header>
      <main className="app-main">{children}</main>
    </div>
    <nav className="bottom-nav" aria-label="Navigasi utama seluler">{items.map(({ href, label, icon: Icon, available }) => available
      ? <Link key={label} href={href} className={pathname === href ? "active" : undefined}><Icon size={20} /><span>{label}</span></Link>
      : <button key={label} type="button" disabled aria-label={`${label}, segera hadir`}><Icon size={20} /><span>{label}</span></button>)}</nav>
  </div>;
}
