import { AuthForm } from "@/features/auth/auth-form";

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  const params = await searchParams;
  return <AuthForm mode="sign-in" error={params.error} success={params.success} />;
}
