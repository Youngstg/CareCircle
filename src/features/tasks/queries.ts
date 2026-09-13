import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import type { CareTask, Member } from "@/types/domain";

export async function listTasks(circleId: string, members: Member[]): Promise<CareTask[]> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHENTICATED");

  const membership = await prisma.circleMember.findFirst({
    where: { circleId, userId: session.user.id },
    select: { id: true },
  });
  if (!membership) throw new Error("FORBIDDEN");

  const tasks = await prisma.task.findMany({
    where: { circleId },
    orderBy: [{ completedAt: "asc" }, { dueAt: "asc" }, { createdAt: "desc" }],
  });
  const names = new Map(members.map((member) => [member.id, member.displayName]));

  return tasks.map((task: {
    id: string;
    circleId: string;
    title: string;
    description: string | null;
    assigneeId: string | null;
    priority: string;
    dueAt: Date | null;
    completedAt: Date | null;
  }) => ({
    id: task.id,
    circleId: task.circleId,
    title: task.title,
    description: task.description,
    assignedTo: task.assigneeId,
    assigneeName: task.assigneeId ? names.get(task.assigneeId) ?? "Anggota keluarga" : "Belum ditentukan",
    priority: task.priority === "HIGH" || task.priority === "URGENT" ? "important" : "normal",
    dueAt: task.dueAt?.toISOString() ?? null,
    completedAt: task.completedAt?.toISOString() ?? null,
  }));
}
