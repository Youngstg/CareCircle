"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import type { ActionResult } from "@/types/domain";
import { checklistMutationSchema, scheduleMutationSchema, scheduleSchema } from "./schemas";

async function membership(circleId: string, userId: string) {
  return prisma.circleMember.findUnique({ where: { circleId_userId: { circleId, userId } }, select: { role: true } });
}

export async function createSchedule(_previous: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = scheduleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, code: "VALIDATION_ERROR", message: "Periksa kembali data jadwal.", fieldErrors: parsed.error.flatten().fieldErrors };
  const session = await getSession();
  if (!session) return { ok: false, code: "UNAUTHENTICATED", message: "Sesi Anda berakhir." };
  if (!await membership(parsed.data.circleId, session.user.id)) return { ok: false, code: "FORBIDDEN", message: "Anda tidak memiliki akses ke Care Circle ini." };

  const { circleId, companionUserId, checklist, startsAt, endsAt, description, locationName, title } = parsed.data;
  if (companionUserId && !await membership(circleId, companionUserId)) return { ok: false, code: "INVALID_COMPANION", message: "Pendamping harus merupakan anggota Care Circle." };
  const labels = (checklist ?? "")
    .split("\n")
    .map((label) => label.trim().replace(/^\d+[.)]\s*/, ""))
    .filter(Boolean)
    .slice(0, 20);
  if (labels.some((label) => label.length > 160)) return { ok: false, code: "VALIDATION_ERROR", message: "Setiap item persiapan maksimal 160 karakter." };

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const schedule = await tx.schedule.create({ data: {
        circleId, title, description: description || null, locationName: locationName || null,
        startsAt: new Date(startsAt), endsAt: endsAt ? new Date(endsAt) : null,
        companionUserId: companionUserId || null, createdById: session.user.id,
        checklist: { create: labels.map((label, position) => ({ circleId, label, position })) },
      } });
      await tx.activityEvent.create({ data: { circleId, actorId: session.user.id, scheduleId: schedule.id, type: "SCHEDULE_CREATED" } });
    });
  } catch { return { ok: false, code: "CREATE_FAILED", message: "Jadwal belum dapat disimpan. Coba lagi." }; }
  revalidatePath("/schedule"); revalidatePath("/dashboard");
  return { ok: true, data: undefined };
}

export async function toggleChecklist(itemId: string, circleId: string, completed: boolean): Promise<ActionResult> {
  const parsed = checklistMutationSchema.safeParse({ itemId, circleId, completed });
  if (!parsed.success) return { ok: false, code: "VALIDATION_ERROR", message: "Item persiapan tidak valid." };
  const session = await getSession();
  if (!session || !await membership(circleId, session.user.id)) return { ok: false, code: "FORBIDDEN", message: "Anda tidak memiliki akses." };
  const item = await prisma.checklistItem.findFirst({ where: { id: itemId, circleId }, select: { id: true } });
  if (!item) return { ok: false, code: "NOT_FOUND", message: "Item persiapan tidak ditemukan." };
  await prisma.checklistItem.update({ where: { id: item.id }, data: { completedAt: completed ? new Date() : null, completedById: completed ? session.user.id : null } });
  revalidatePath("/schedule"); revalidatePath("/dashboard");
  return { ok: true, data: undefined };
}

export async function deleteSchedule(formData: FormData) {
  const parsed = scheduleMutationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const session = await getSession();
  if (!session) return;
  const member = await membership(parsed.data.circleId, session.user.id);
  const schedule = await prisma.schedule.findFirst({ where: { id: parsed.data.scheduleId, circleId: parsed.data.circleId }, select: { createdById: true } });
  if (!member || !schedule || (schedule.createdById !== session.user.id && member.role === "MEMBER")) return;
  await prisma.schedule.delete({ where: { id: parsed.data.scheduleId } });
  revalidatePath("/schedule"); revalidatePath("/dashboard");
}
