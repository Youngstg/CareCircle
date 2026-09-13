import Link from "next/link";
import { KeyRound } from "lucide-react";
import { redirect } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { JoinForm } from "@/features/invites/join-form";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function JoinPage() {
  const session = await getSession();
  if (!session) redirect("/sign-in?next=/join");

  const membership = await prisma.circleMember.findFirst({ where: { userId: session.user.id }, select: { id: true } });
  if (membership) redirect("/dashboard");

  return <main className="auth-layout">
    <Logo />
    <section className="auth-card">
      <span className="feature-icon"><KeyRound /></span>
      <div className="eyebrow">Undangan keluarga</div>
      <h1>Gabung Care Circle</h1>
      <p>Masukkan kode 8 karakter yang dibagikan owner atau koordinator.</p>
      <JoinForm />
      <p className="auth-switch"><Link href="/onboarding">Kembali ke pilihan awal</Link></p>
    </section>
    <p className="auth-note">Demi privasi, kode yang tidak valid, kedaluwarsa, dicabut, atau habis kuota menampilkan pesan yang sama.</p>
  </main>;
}
