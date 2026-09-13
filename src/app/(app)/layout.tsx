import { AppShell } from "@/components/layout/app-shell";
import { getCircleContext } from "@/features/circles/queries";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const context = await getCircleContext();
  return <AppShell circleName={context.circleName} displayName={context.displayName}>{children}</AppShell>;
}
