import { z } from "zod";

export const routineCategories = [
  { value: "MEDICATION", label: "Obat-obatan" },
  { value: "VITAL_CHECK", label: "Cek Tensi / Gula Darah" },
  { value: "THERAPY", label: "Fisioterapi / Latihan Gerak" },
  { value: "MEAL", label: "Makan / Nutrisi Khusus" },
  { value: "OTHER", label: "Rutinitas Lain" },
] as const;

export const routineTimes = [
  { value: "MORNING", label: "Pagi (06:00 - 11:00)" },
  { value: "AFTERNOON", label: "Siang (11:00 - 15:00)" },
  { value: "EVENING", label: "Sore (15:00 - 18:30)" },
  { value: "NIGHT", label: "Malam (18:30 - 22:00)" },
] as const;

export const routineSchema = z.object({
  circleId: z.string().min(1, "Lingkaran tidak valid."),
  title: z.string().trim().min(2, "Nama rutinitas minimal 2 karakter.").max(120, "Nama maksimal 120 karakter."),
  category: z.enum(["MEDICATION", "VITAL_CHECK", "THERAPY", "MEAL", "OTHER"]).default("MEDICATION"),
  timeOfDay: z.enum(["MORNING", "AFTERNOON", "EVENING", "NIGHT"]).default("MORNING"),
  customTime: z.string().trim().max(20).optional().nullable(),
  note: z.string().trim().max(500).optional().nullable(),
});

export const routineToggleSchema = z.object({
  routineId: z.string().min(1),
  circleId: z.string().min(1),
  completed: z.boolean(),
  dateStr: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD."),
});

export const routineMutationSchema = z.object({
  routineId: z.string().min(1),
  circleId: z.string().min(1),
});
