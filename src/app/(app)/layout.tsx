import { AppShell } from "@/components/layout/app-shell";
import { listRecentActivities } from "@/features/activities/queries";
import { getCircleContext } from "@/features/circles/queries";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const context = await getCircleContext();
  const activities = await listRecentActivities(context.circleId).catch(() => []);
  return (
    <AppShell circleName={context.circleName} displayName={context.displayName} activities={activities}>
      {children}
    </AppShell>
  );
}
