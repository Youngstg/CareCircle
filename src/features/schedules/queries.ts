import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function listSchedules(circleId: string) {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHENTICATED");
  const membership = await prisma.circleMember.findUnique({ where: { circleId_userId: { circleId, userId: session.user.id } }, select: { id: true } });
  if (!membership) throw new Error("FORBIDDEN");

  return prisma.schedule.findMany({
    where: { circleId },
    include: {
      companion: { select: { name: true } },
      checklist: { include: { assignedTo: { select: { name: true } } }, orderBy: { position: "asc" } },
    },
    orderBy: { startsAt: "asc" },
  });
}
