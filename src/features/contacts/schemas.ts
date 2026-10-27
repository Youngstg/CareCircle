import { z } from "zod";

export const contactRoles = [
  "Dokter Spesialis",
  "Dokter Umum / Keluarga",
  "Rumah Sakit / UGD",
  "Puskesmas / Klinik",
  "Apotek 24 Jam",
  "Sopir / Ambulans",
  "Perawat / Fisioterapis",
  "Keluarga Terdekat",
  "Asuransi / BPJS",
  "Lainnya",
] as const;

export const contactSchema = z.object({
  circleId: z.string().min(1, "Lingkaran tidak valid."),
  name: z.string().trim().min(2, "Nama kontak minimal 2 karakter.").max(120, "Nama maksimal 120 karakter."),
  role: z.string().trim().min(2, "Peran minimal 2 karakter.").max(80, "Peran maksimal 80 karakter."),
  phoneNumber: z.string().trim().min(5, "Nomor telepon minimal 5 karakter.").max(50, "Nomor maksimal 50 karakter."),
  whatsapp: z.string().trim().max(50).optional().nullable(),
  address: z.string().trim().max(255).optional().nullable(),
  note: z.string().trim().max(500).optional().nullable(),
});

export const contactMutationSchema = z.object({
  contactId: z.string().min(1, "Kontak tidak valid."),
  circleId: z.string().min(1, "Lingkaran tidak valid."),
});

export type ContactInput = z.infer<typeof contactSchema>;
