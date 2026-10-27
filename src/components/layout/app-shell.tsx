"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, ClipboardList, FileLock2, Home, LogOut, NotebookPen, PhoneCall, UsersRound } from "lucide-react";
import { NotificationPopover } from "@/components/layout/notification-popover";
import { Logo } from "@/components/ui/logo";
import type { RecentActivity } from "@/features/activities/queries";
import { signOut } from "@/features/auth/actions";

const items = [
  { href: "/dashboard", label: "Beranda", icon: Home, available: true },
  { href: "/tasks", label: "Tugas", icon: ClipboardList, available: true },
  { href: "/schedule", label: "Jadwal", icon: CalendarDays, available: true },
  { href: "/contacts", label: "Kontak", icon: PhoneCall, available: true },
  { href: "/documents", label: "Dokumen", icon: FileLock2, available: true },
  { href: "/notes", label: "Catatan", icon: NotebookPen, available: true },
  { href: "/members", label: "Anggota", icon: UsersRound, available: true },
];

export function AppShell({
  children,
  circleName,
  displayName,
  activities = [],
}: {
  children: React.ReactNode;
  circleName: string;
  displayName: string;
  activities?: RecentActivity[];
}) {
  const pathname = usePathname();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Logo />
        <div className="circle-label">
          <span>Care Circle aktif</span>
          <strong>{circleName}</strong>
        </div>
        <nav aria-label="Navigasi utama">
          {items.map(({ href, label, icon: Icon, available }) =>
            available ? (
              <Link key={label} href={href} className={pathname === href ? "active" : undefined}>
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            ) : (
              <button key={label} type="button" disabled aria-label={`${label}, segera hadir`} title="Segera hadir">
                <Icon size={20} />
                <span>{label}</span>
                <small>Segera hadir</small>
              </button>
            )
          )}
        </nav>
        <form action={signOut}>
          <button className="nav-button" type="submit">
            <LogOut size={20} />
            Keluar
          </button>
        </form>
      </aside>

      <div className="app-column">
        <header className="app-header">
          <div className="mobile-brand">
            <Logo compact />
            <strong>{circleName}</strong>
          </div>
          <div className="profile">
            <NotificationPopover activities={activities} />
            <Link href="/account" className="flex items-center gap-3 rounded-xl" aria-label="Kelola akun">
              <span className="avatar" aria-hidden="true">
                {displayName.slice(0, 1).toUpperCase()}
              </span>
              <span className="hidden min-[701px]:inline">{displayName}</span>
            </Link>
          </div>
        </header>
        <main className="app-main">{children}</main>
      </div>

      <nav className="bottom-nav" aria-label="Navigasi utama seluler">
        {items.map(({ href, label, icon: Icon, available }) =>
          available ? (
            <Link key={label} href={href} className={pathname === href ? "active" : undefined}>
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ) : (
            <button key={label} type="button" disabled aria-label={`${label}, segera hadir`}>
              <Icon size={20} />
              <span>{label}</span>
            </button>
          )
        )}
      </nav>
    </div>
  );
}
