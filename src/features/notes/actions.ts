"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import type { ActionResult } from "@/types/domain";
import { noteMutationSchema, noteSchema } from "./schemas";

async function membership(circleId: string, userId: string) {
  return prisma.circleMember.findUnique({ where: { circleId_userId: { circleId, userId } }, select: { role: true } });
}

export async function createNote(_previous: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = noteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, code: "VALIDATION_ERROR", message: "Periksa kembali isi catatan.", fieldErrors: parsed.error.flatten().fieldErrors };
  const session = await getSession();
  if (!session || !await membership(parsed.data.circleId, session.user.id)) return { ok: false, code: "FORBIDDEN", message: "Anda tidak memiliki akses ke Care Circle ini." };
  if (parsed.data.scheduleId) {
    const linked = await prisma.schedule.findFirst({ where: { id: parsed.data.scheduleId, circleId: parsed.data.circleId }, select: { id: true } });
    if (!linked) return { ok: false, code: "INVALID_SCHEDULE", message: "Jadwal terkait tidak tersedia." };
  }
  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const note = await tx.note.create({ data: { circleId: parsed.data.circleId, body: parsed.data.body, scheduleId: parsed.data.scheduleId || null, isPinned: parsed.data.isPinned === "on", createdById: session.user.id } });
      await tx.activityEvent.create({ data: { circleId: parsed.data.circleId, actorId: session.user.id, noteId: note.id, type: note.isPinned ? "NOTE_PINNED" : "NOTE_ADDED" } });
    });
  } catch { return { ok: false, code: "CREATE_FAILED", message: "Catatan belum dapat disimpan." }; }
  revalidatePath("/notes"); revalidatePath("/dashboard");
  return { ok: true, data: undefined };
}

export async function togglePinned(noteId: string, circleId: string, pinned: boolean): Promise<ActionResult> {
  const parsed = noteMutationSchema.safeParse({ noteId, circleId });
  if (!parsed.success) return { ok: false, code: "VALIDATION_ERROR", message: "Catatan tidak valid." };
  const session = await getSession();
  if (!session || !await membership(circleId, session.user.id)) return { ok: false, code: "FORBIDDEN", message: "Anda tidak memiliki akses." };
  const note = await prisma.note.findFirst({ where: { id: noteId, circleId }, select: { id: true } });
  if (!note) return { ok: false, code: "NOT_FOUND", message: "Catatan tidak ditemukan." };
  await prisma.note.update({ where: { id: note.id }, data: { isPinned: pinned } });
  if (pinned) await prisma.activityEvent.create({ data: { circleId, actorId: session.user.id, noteId, type: "NOTE_PINNED" } });
  revalidatePath("/notes"); return { ok: true, data: undefined };
}

export async function deleteNote(formData: FormData) {
  const parsed = noteMutationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const session = await getSession();
  if (!session) return;
  const member = await membership(parsed.data.circleId, session.user.id);
  const note = await prisma.note.findFirst({ where: { id: parsed.data.noteId, circleId: parsed.data.circleId }, select: { createdById: true } });
  if (!member || !note || (note.createdById !== session.user.id && member.role === "MEMBER")) return;
  await prisma.note.delete({ where: { id: parsed.data.noteId } });
  revalidatePath("/notes"); revalidatePath("/dashboard");
}
