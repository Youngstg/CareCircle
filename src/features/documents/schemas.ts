import { z } from "zod";

export const documentCategories = [
  "MEDICAL",
  "IDENTITY",
  "INSURANCE",
  "LEGAL",
  "OTHER",
] as const;

export type DocumentCategory = typeof documentCategories[number];

export const documentCategoryLabels: Record<DocumentCategory, string> = {
  MEDICAL: "Kesehatan",
  IDENTITY: "Identitas",
  INSURANCE: "Asuransi",
  LEGAL: "Hukum",
  OTHER: "Lainnya",
};

const databaseIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(191)
  .regex(/^[A-Za-z0-9_-]+$/, "Care Circle tidak valid.");

export const documentMetadataSchema = z.object({
  circleId: databaseIdSchema,
  title: z.string().trim().min(1, "Judul dokumen wajib diisi.").max(120, "Judul maksimal 120 karakter."),
  category: z.enum(documentCategories, { error: "Pilih kategori dokumen." }),
  note: z.string().trim().max(1000, "Catatan maksimal 1.000 karakter.").optional(),
  consent: z.literal("accepted", { error: "Persetujuan penyimpanan data sensitif wajib diberikan." }),
});

export const documentIdSchema = databaseIdSchema;

export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;

const signatures: ReadonlyArray<{ mimeType: string; matches: (bytes: Uint8Array) => boolean }> = [
  { mimeType: "application/pdf", matches: (bytes) => bytes.length >= 4 && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 },
  { mimeType: "image/jpeg", matches: (bytes) => bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff },
  { mimeType: "image/png", matches: (bytes) => bytes.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((value, index) => bytes[index] === value) },
  { mimeType: "image/webp", matches: (bytes) => bytes.length >= 12 && [0x52, 0x49, 0x46, 0x46].every((value, index) => bytes[index] === value) && [0x57, 0x45, 0x42, 0x50].every((value, index) => bytes[index + 8] === value) },
];

export function detectDocumentMimeType(bytes: Uint8Array): string | null {
  return signatures.find((signature) => signature.matches(bytes))?.mimeType ?? null;
}

export function sanitizeOriginalName(name: string): string {
  const baseName = name.replace(/\\/g, "/").split("/").pop() ?? "dokumen";
  const cleaned = baseName
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/[<>:"|?*]/g, "_")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\.+/, "")
    .slice(0, 191)
    .trim();
  return cleaned || "dokumen";
}
