import type { Metadata } from "next";
import Link from "next/link";
import { getGoogleAuthErrorMessage } from "@/features/auth/google-errors";

export const metadata: Metadata = {
  title: "Login Google",
  robots: { index: false, follow: false },
};

type SearchParams = { error?: string | string[]; flow?: string | string[] };

export default async function GoogleAuthErrorPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const linking = params.flow === "link";
  const message = getGoogleAuthErrorMessage(typeof params.error === "string" ? params.error : undefined);

  return (
    <div className="auth-card">
      <div className="eyebrow">Login Google</div>
      <h1>Belum bisa melanjutkan</h1>
      <p role="alert">{message}</p>
      <Link className="button button-primary" href={linking ? "/account" : "/sign-in"}>
        {linking ? "Kembali ke akun" : "Kembali ke halaman masuk"}
      </Link>
    </div>
  );
}
