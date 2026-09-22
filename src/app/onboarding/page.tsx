import { CircleAlert, KeyRound, UsersRound } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SubmitButton } from "@/components/ui/submit-button";
import { createCircle } from "@/features/circles/actions";
import { JoinForm } from "@/features/invites/join-form";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const existing = await prisma.circleMember.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (existing) redirect("/dashboard");

  const params = await searchParams;
  return <section className="onboarding"><div className="onboarding-copy"><span className="feature-icon"><UsersRound /></span><div className="eyebrow">Langkah 1 dari 1</div><h1>Siapkan ruang keluarga Anda</h1><p>Buat ruang baru atau gunakan kode undangan untuk bergabung dengan keluarga Anda.</p><Link className="button button-secondary button-small" href="/account">Kelola akun</Link></div><div className="onboarding-options"><div className="onboarding-card"><h2>Buat Care Circle</h2><p>Gunakan nama yang netral dan hindari informasi sensitif.</p>{params.error && <div className="alert alert-error" role="alert"><CircleAlert size={18} />{params.error}</div>}<form action={createCircle} className="form-stack"><label htmlFor="displayName">Nama tampilan<input id="displayName" name="displayName" defaultValue={session.user.name} autoComplete="name" required minLength={2} maxLength={100} /></label><label htmlFor="circleName">Nama Care Circle<input id="circleName" name="circleName" placeholder="Contoh: Keluarga Harmoni" required minLength={2} maxLength={120} /></label><SubmitButton>Buat Care Circle</SubmitButton></form></div><div className="onboarding-card"><span className="feature-icon"><KeyRound /></span><h2>Punya kode undangan?</h2><p>Masukkan kode dari owner atau koordinator Care Circle.</p><JoinForm compact /></div></div></section>;
}
