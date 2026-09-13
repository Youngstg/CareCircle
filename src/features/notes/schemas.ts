import { z } from "zod";
import { databaseIdSchema } from "@/features/schedules/schemas";

export const noteSchema = z.object({
  circleId: databaseIdSchema,
  body: z.string().trim().min(1, "Isi catatan wajib diisi.").max(2000),
  scheduleId: z.union([databaseIdSchema, z.literal("")]).optional(),
  isPinned: z.string().optional(),
});

export const noteMutationSchema = z.object({ noteId: databaseIdSchema, circleId: databaseIdSchema });
