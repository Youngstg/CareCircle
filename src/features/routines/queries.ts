import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export type DailyRoutineItem = {
  id: string;
  circleId: string;
  title: string;
  category: "MEDICATION" | "VITAL_CHECK" | "THERAPY" | "MEAL" | "OTHER";
  timeOfDay: "MORNING" | "AFTERNOON" | "EVENING" | "NIGHT";
  customTime: string | null;
  note: string | null;
  isCompleted: boolean;
  completedAt: string | null;
  completedByName: string | null;
};

export function getTodayDateStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function listRoutines(circleId: string, targetDate?: string): Promise<DailyRoutineItem[]> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHENTICATED");

  const dateStr = targetDate || getTodayDateStr();

  const routines = await prisma.dailyRoutine.findMany({
    where: { circleId },
    include: {
      logs: {
        where: { dateStr },
        include: { completedBy: { select: { name: true } } },
        take: 1,
      },
    },
    orderBy: [
      { timeOfDay: "asc" },
      { createdAt: "asc" },
    ],
  });

  return routines.map((r: {
    id: string;
    circleId: string;
    title: string;
    category: string;
    timeOfDay: "MORNING" | "AFTERNOON" | "EVENING" | "NIGHT";
    customTime: string | null;
    note: string | null;
    logs: Array<{
      completedAt: Date;
      completedBy: { name: string };
    }>;
  }) => {
    const todayLog = r.logs[0];
    return {
      id: r.id,
      circleId: r.circleId,
      title: r.title,
      category: r.category as DailyRoutineItem["category"],
      timeOfDay: r.timeOfDay,
      customTime: r.customTime,
      note: r.note,
      isCompleted: Boolean(todayLog),
      completedAt: todayLog ? todayLog.completedAt.toISOString() : null,
      completedByName: todayLog?.completedBy.name ?? null,
    };
  });
}
