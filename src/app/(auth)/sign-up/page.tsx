import { AuthForm } from "@/features/auth/auth-form";

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return <AuthForm mode="sign-up" error={params.error} />;
}
