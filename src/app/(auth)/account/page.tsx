import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, LogOut } from "lucide-react";
import { GoogleAuthButton } from "@/features/auth/google-auth-button";
import { signOut } from "@/features/auth/actions";
import { googleAuthEnabled } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import styles from "./account.module.css";

export const metadata: Metadata = {
  title: "Kelola akun",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const googleAccount = await prisma.account.findFirst({
    where: { userId: session.user.id, providerId: "google" },
    select: { id: true },
  });

  return (
    <div className="auth-card">
      <div className="eyebrow">Pengaturan akun</div>
      <h1>Akun Anda</h1>
      <p>Kelola cara Anda masuk ke CareCircle.</p>

      <dl className={styles.details}>
        <div><dt>Nama</dt><dd>{session.user.name}</dd></div>
        <div><dt>Email</dt><dd>{session.user.email}</dd></div>
      </dl>

      <section className={styles.connection} aria-labelledby="google-connection-title">
        <h2 id="google-connection-title">Login Google</h2>
        {googleAccount ? (
          <p className={styles.connected} role="status">
            <CheckCircle2 size={20} aria-hidden="true" />Akun Google sudah terhubung
          </p>
        ) : (
          <>
            <p>Gunakan akun Google dengan alamat email yang sama untuk menambahkan cara masuk, tanpa membuat akun CareCircle baru.</p>
            <GoogleAuthButton enabled={googleAuthEnabled} mode="link" />
          </>
        )}
        <p className={styles.notice}>
          Penautan ini hanya untuk login. CareCircle tidak meminta akses Gmail atau Google Calendar.
        </p>
      </section>

      <div className={styles.actions}>
        <Link className="button button-secondary" href="/dashboard">Kembali ke CareCircle</Link>
        <form action={signOut}>
          <button className="button button-secondary" type="submit"><LogOut size={18} aria-hidden="true" />Keluar</button>
        </form>
      </div>
    </div>
  );
}
