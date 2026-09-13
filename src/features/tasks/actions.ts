"use server";

import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import type { ActionResult } from "@/types/domain";
import { taskSchema } from "./schemas";

const databaseIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(191)
  .regex(/^[A-Za-z0-9_-]+$/);

const toggleTaskSchema = z.object({
  taskId: databaseIdSchema,
  circleId: databaseIdSchema,
  completed: z.boolean(),
});

export async function createTask(_previous: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = taskSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, code: "VALIDATION_ERROR", message: "Periksa kembali data tugas.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const session = await getSession();
  if (!session) return { ok: false, code: "UNAUTHENTICATED", message: "Sesi Anda berakhir. Silakan masuk kembali." };

  const { circleId, assignedTo, dueAt, description, ...input } = parsed.data;
  try {
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const [membership, assignee] = await Promise.all([
        tx.circleMember.findFirst({ where: { circleId, userId: session.user.id }, select: { id: true } }),
        tx.circleMember.findFirst({ where: { circleId, userId: assignedTo }, select: { id: true } }),
      ]);
      if (!membership) return "FORBIDDEN" as const;
      if (!assignee) return "INVALID_ASSIGNEE" as const;

      const task = await tx.task.create({
        data: {
          ...input,
          description: description || null,
          priority: input.priority === "important" ? "HIGH" : "NORMAL",
          circleId,
          assigneeId: assignedTo,
          dueAt: dueAt ? new Date(`${dueAt}T12:00:00`) : null,
          createdById: session.user.id,
        },
        select: { id: true },
      });
      await tx.activityEvent.create({
        data: {
          circleId,
          actorId: session.user.id,
          taskId: task.id,
          type: "TASK_CREATED",
        },
      });
      return "CREATED" as const;
    });
    if (result === "FORBIDDEN") return { ok: false, code: result, message: "Anda tidak memiliki akses ke Care Circle ini." };
    if (result === "INVALID_ASSIGNEE") return { ok: false, code: result, message: "Anggota yang dipilih tidak tersedia." };
  } catch {
    return { ok: false, code: "CREATE_FAILED", message: "Tugas belum dapat disimpan. Coba lagi." };
  }

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return { ok: true, data: undefined };
}

export async function toggleTask(taskId: string, circleId: string, completed: boolean): Promise<ActionResult> {
  const parsed = toggleTaskSchema.safeParse({ taskId, circleId, completed });
  if (!parsed.success) return { ok: false, code: "VALIDATION_ERROR", message: "Data tugas tidak valid." };

  const session = await getSession();
  if (!session) return { ok: false, code: "UNAUTHENTICATED", message: "Sesi Anda berakhir. Silakan masuk kembali." };

  try {
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const membership = await tx.circleMember.findFirst({
        where: { circleId: parsed.data.circleId, userId: session.user.id },
        select: { id: true, role: true },
      });
      if (!membership) return "FORBIDDEN" as const;

      const task = await tx.task.findFirst({
        where: { id: parsed.data.taskId, circleId: parsed.data.circleId },
        select: { id: true, assigneeId: true, createdById: true },
      });
      if (!task) return "NOT_FOUND" as const;
      const canUpdate = task.assigneeId === session.user.id
        || task.createdById === session.user.id
        || membership.role === "OWNER"
        || membership.role === "COORDINATOR";
      if (!canUpdate) return "FORBIDDEN" as const;

      await tx.task.update({
        where: { id: task.id },
        data: {
          status: parsed.data.completed ? "COMPLETED" : "OPEN",
          completedAt: parsed.data.completed ? new Date() : null,
          completedById: parsed.data.completed ? session.user.id : null,
        },
      });
      await tx.activityEvent.create({
        data: {
          circleId: parsed.data.circleId,
          actorId: session.user.id,
          taskId: task.id,
          type: parsed.data.completed ? "TASK_COMPLETED" : "TASK_REOPENED",
        },
      });
      return "UPDATED" as const;
    });
    if (result === "FORBIDDEN") return { ok: false, code: result, message: "Anda tidak memiliki akses untuk mengubah tugas ini." };
    if (result === "NOT_FOUND") return { ok: false, code: result, message: "Tugas tidak tersedia." };
  } catch {
    return { ok: false, code: "UPDATE_FAILED", message: "Status tugas belum dapat diperbarui." };
  }

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return { ok: true, data: undefined };
}
