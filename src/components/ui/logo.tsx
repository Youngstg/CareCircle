import { UsersRound } from "lucide-react";
import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="logo" href="/" aria-label="CareCircle, halaman utama">
      <span className="logo-mark" aria-hidden="true"><UsersRound size={21} /></span>
      {!compact && <span>CareCircle</span>}
    </Link>
  );
}
