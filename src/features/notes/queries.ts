import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function listNotes(circleId: string) {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHENTICATED");
  const membership = await prisma.circleMember.findUnique({ where: { circleId_userId: { circleId, userId: session.user.id } }, select: { id: true } });
  if (!membership) throw new Error("FORBIDDEN");
  return prisma.note.findMany({ where: { circleId }, include: { createdBy: { select: { name: true } }, schedule: { select: { title: true } } }, orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }] });
}
