import { z } from "zod";

export const databaseIdSchema = z.string().trim().min(1).max(191).regex(/^[A-Za-z0-9_-]+$/);

export const scheduleSchema = z.object({
  circleId: databaseIdSchema,
  title: z.string().trim().min(1, "Judul jadwal wajib diisi.").max(120),
  description: z.string().trim().max(1000).optional(),
  locationName: z.string().trim().max(191).optional(),
  startsAt: z.string().min(1, "Tanggal dan waktu mulai wajib diisi."),
  endsAt: z.string().optional(),
  companionUserId: z.union([databaseIdSchema, z.literal("")]).optional(),
  checklist: z.string().max(2000).optional(),
}).superRefine((value, context) => {
  const start = new Date(value.startsAt);
  if (Number.isNaN(start.getTime())) context.addIssue({ code: "custom", path: ["startsAt"], message: "Waktu mulai tidak valid." });
  if (value.endsAt) {
    const end = new Date(value.endsAt);
    if (Number.isNaN(end.getTime()) || end <= start) context.addIssue({ code: "custom", path: ["endsAt"], message: "Waktu selesai harus setelah waktu mulai." });
  }
});

export const scheduleMutationSchema = z.object({ scheduleId: databaseIdSchema, circleId: databaseIdSchema });
export const checklistMutationSchema = z.object({ itemId: databaseIdSchema, circleId: databaseIdSchema, completed: z.boolean() });
