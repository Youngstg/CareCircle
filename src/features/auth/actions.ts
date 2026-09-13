"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";

const authSchema = z.object({
  email: z.email("Masukkan alamat email yang valid.").trim().max(254),
  password: z.string().min(8, "Kata sandi minimal 8 karakter.").max(72),
});

function authError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function signIn(formData: FormData) {
  const parsed = authSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) authError("/sign-in", parsed.error.issues[0]?.message ?? "Data belum valid.");

  try {
    await auth.api.signInEmail({ body: parsed.data, headers: await headers() });
  } catch (error) {
    if (error instanceof APIError) authError("/sign-in", "Email atau kata sandi tidak cocok.");
    throw error;
  }
  redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  const displayName = z.string().trim().min(2, "Nama minimal 2 karakter.").max(100).safeParse(formData.get("displayName"));
  const parsed = authSchema.safeParse(Object.fromEntries(formData));
  if (!displayName.success || !parsed.success) {
    authError("/sign-up", displayName.error?.issues[0]?.message ?? parsed.error?.issues[0]?.message ?? "Data belum valid.");
  }

  try {
    await auth.api.signUpEmail({
      body: { ...parsed.data, name: displayName.data },
      headers: await headers(),
    });
  } catch (error) {
    if (error instanceof APIError) authError("/sign-up", "Akun belum dapat dibuat. Email mungkin sudah digunakan.");
    throw error;
  }
  redirect("/onboarding");
}

export async function signOut() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/");
}
