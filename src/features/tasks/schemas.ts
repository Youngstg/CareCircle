import { z } from "zod";

const databaseIdSchema = z
  .string()
  .trim()
  .min(1, "ID wajib diisi.")
  .max(191)
  .regex(/^[A-Za-z0-9_-]+$/, "Format ID tidak valid.");

export const taskSchema = z.object({
  circleId: databaseIdSchema,
  title: z.string().trim().min(1, "Judul tugas wajib diisi.").max(120),
  description: z.string().trim().max(1000).optional(),
  assignedTo: databaseIdSchema,
  priority: z.enum(["normal", "important"]),
  dueAt: z.string().optional(),
});
