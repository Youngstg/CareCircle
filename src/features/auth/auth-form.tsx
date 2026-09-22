import Link from "next/link";
import { CircleAlert, CircleCheck } from "lucide-react";
import { SubmitButton } from "@/components/ui/submit-button";
import { googleAuthEnabled } from "@/lib/auth";
import { signIn, signUp } from "./actions";
import { GoogleAuthButton } from "./google-auth-button";

type Props = {
  mode: "sign-in" | "sign-up";
  error?: string;
  success?: string;
};

export function AuthForm({ mode, error, success }: Props) {
  const isSignUp = mode === "sign-up";
  return (
    <div className="auth-card">
      <div className="eyebrow">Ruang koordinasi keluarga</div>
      <h1>{isSignUp ? "Buat akun" : "Selamat datang kembali"}</h1>
      <p>{isSignUp ? "Mulai ruang privat untuk keluarga Anda." : "Masuk untuk melihat tanggung jawab bersama."}</p>
      {error && <div className="alert alert-error" role="alert"><CircleAlert size={18} />{error}</div>}
      {success && <div className="alert alert-success" role="status"><CircleCheck size={18} />{success}</div>}
      <GoogleAuthButton enabled={googleAuthEnabled} />
      <form action={isSignUp ? signUp : signIn} className="form-stack">
        {isSignUp && <label>Nama tampilan<input name="displayName" autoComplete="name" required minLength={2} maxLength={100} /></label>}
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <label>Kata sandi<input name="password" type="password" autoComplete={isSignUp ? "new-password" : "current-password"} required minLength={8} /></label>
        <SubmitButton>{isSignUp ? "Buat akun" : "Masuk"}</SubmitButton>
      </form>
      <p className="auth-switch">{isSignUp ? "Sudah punya akun?" : "Belum punya akun?"} <Link href={isSignUp ? "/sign-in" : "/sign-up"}>{isSignUp ? "Masuk" : "Daftar"}</Link></p>
    </div>
  );
}
