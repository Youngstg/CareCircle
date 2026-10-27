"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import type { ActionResult } from "@/types/domain";
import { routineMutationSchema, routineSchema, routineToggleSchema } from "./schemas";

async function getMembership(circleId: string, userId: string) {
  return prisma.circleMember.findUnique({
    where: { circleId_userId: { circleId, userId } },
    select: { role: true },
  });
}

export async function createRoutine(_previous: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = routineSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Periksa kembali data rutinitas.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const session = await getSession();
  if (!session || !await getMembership(parsed.data.circleId, session.user.id)) {
    return { ok: false, code: "FORBIDDEN", message: "Anda tidak memiliki akses ke Care Circle ini." };
  }

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const routine = await tx.dailyRoutine.create({
        data: {
          circleId: parsed.data.circleId,
          title: parsed.data.title,
          category: parsed.data.category,
          timeOfDay: parsed.data.timeOfDay,
          customTime: parsed.data.customTime || null,
          note: parsed.data.note || null,
          createdById: session.user.id,
        },
      });
      await tx.activityEvent.create({
        data: {
          circleId: parsed.data.circleId,
          actorId: session.user.id,
          type: "ROUTINE_CREATED",
          metadata: { routineId: routine.id, title: routine.title },
        },
      });
    });
  } catch {
    return { ok: false, code: "CREATE_FAILED", message: "Rutinitas belum dapat disimpan." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/schedule");
  return { ok: true, data: undefined };
}

export async function toggleRoutineToday(
  routineId: string,
  circleId: string,
  completed: boolean,
  dateStr: string
): Promise<ActionResult> {
  const parsed = routineToggleSchema.safeParse({ routineId, circleId, completed, dateStr });
  if (!parsed.success) return { ok: false, code: "VALIDATION_ERROR", message: "Data tidak valid." };

  const session = await getSession();
  if (!session || !await getMembership(circleId, session.user.id)) {
    return { ok: false, code: "FORBIDDEN", message: "Anda tidak memiliki akses." };
  }

  try {
    if (completed) {
      await prisma.routineLog.upsert({
        where: { routineId_dateStr: { routineId, dateStr } },
        create: {
          routineId,
          dateStr,
          completedById: session.user.id,
          completedAt: new Date(),
        },
        update: {
          completedById: session.user.id,
          completedAt: new Date(),
        },
      });
    } else {
      await prisma.routineLog.deleteMany({
        where: { routineId, dateStr },
      });
    }
  } catch {
    return { ok: false, code: "UPDATE_FAILED", message: "Gagal memperbarui status rutinitas." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/schedule");
  return { ok: true, data: undefined };
}

export async function deleteRoutine(formData: FormData) {
  const parsed = routineMutationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const session = await getSession();
  if (!session) return;

  const member = await getMembership(parsed.data.circleId, session.user.id);
  const routine = await prisma.dailyRoutine.findFirst({
    where: { id: parsed.data.routineId, circleId: parsed.data.circleId },
    select: { createdById: true },
  });

  if (!member || !routine) return;
  if (routine.createdById !== session.user.id && member.role === "MEMBER") return;

  await prisma.dailyRoutine.delete({ where: { id: parsed.data.routineId } });
  revalidatePath("/dashboard");
  revalidatePath("/schedule");
}
