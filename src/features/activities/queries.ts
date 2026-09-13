import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export type RecentActivity = {
  id: string;
  summary: string;
  createdAt: string;
};

const eventLabels: Record<string, (actor: string, task: string | null) => string> = {
  TASK_CREATED: (actor, task) => `${actor} membuat tugas “${task ?? "Tanpa judul"}”.`,
  TASK_COMPLETED: (actor, task) => `${actor} menyelesaikan tugas “${task ?? "Tanpa judul"}”.`,
  TASK_REOPENED: (actor, task) => `${actor} membuka kembali tugas “${task ?? "Tanpa judul"}”.`,
  MEMBER_JOINED: (actor) => `${actor} bergabung dengan Care Circle.`,
  SCHEDULE_CREATED: (actor, title) => `${actor} menambahkan jadwal “${title ?? "Tanpa judul"}”.`,
  NOTE_ADDED: (actor) => `${actor} menambahkan catatan bersama.`,
  NOTE_PINNED: (actor) => `${actor} menyematkan catatan penting.`,
  DOCUMENT_UPLOADED: (actor) => `${actor} mengunggah dokumen.`,
  DOCUMENT_DELETED: (actor) => `${actor} menghapus dokumen.`,
};

export async function listRecentActivities(circleId: string): Promise<RecentActivity[]> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHENTICATED");

  const membership = await prisma.circleMember.findFirst({
    where: { circleId, userId: session.user.id },
    select: { id: true },
  });
  if (!membership) throw new Error("FORBIDDEN");

  const events = await prisma.activityEvent.findMany({
    where: { circleId },
    include: {
      actor: { select: { name: true } },
      task: { select: { title: true } },
      schedule: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return events.map((event: {
    id: string;
    type: string;
    createdAt: Date;
    actor: { name: string } | null;
    task: { title: string } | null;
    schedule: { title: string } | null;
  }) => ({
    id: event.id,
    summary: (eventLabels[event.type] ?? ((actor) => `${actor} memperbarui Care Circle.`))(
      event.actor?.name ?? "Anggota keluarga",
      event.task?.title ?? event.schedule?.title ?? null,
    ),
    createdAt: event.createdAt.toISOString(),
  }));
}
