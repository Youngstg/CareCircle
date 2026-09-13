import { describe, expect, it } from "vitest";

import {
  detectDocumentMimeType,
  documentMetadataSchema,
  sanitizeOriginalName,
} from "@/features/documents/schemas";

const validMetadata = {
  circleId: "circle_7Hk2mN9qP4sT6vX8",
  title: "  Hasil pemeriksaan  ",
  category: "MEDICAL" as const,
  note: "  Simpan untuk kontrol berikutnya  ",
  consent: "accepted" as const,
};

describe("documentMetadataSchema", () => {
  it("trims entered text and requires explicit consent", () => {
    const parsed = documentMetadataSchema.parse(validMetadata);
    expect(parsed.title).toBe("Hasil pemeriksaan");
    expect(parsed.note).toBe("Simpan untuk kontrol berikutnya");
    expect(documentMetadataSchema.safeParse({ ...validMetadata, consent: undefined }).success).toBe(false);
  });

  it("rejects unsupported categories and unsafe identifiers", () => {
    expect(documentMetadataSchema.safeParse({ ...validMetadata, category: "FINANCE" }).success).toBe(false);
    expect(documentMetadataSchema.safeParse({ ...validMetadata, circleId: "../circle" }).success).toBe(false);
  });
});

describe("document file validation helpers", () => {
  it.each([
    ["application/pdf", [0x25, 0x50, 0x44, 0x46]],
    ["image/jpeg", [0xff, 0xd8, 0xff, 0xe0]],
    ["image/png", [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
    ["image/webp", [0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]],
  ])("detects %s from magic bytes", (mimeType, bytes) => {
    expect(detectDocumentMimeType(Uint8Array.from(bytes))).toBe(mimeType);
  });

  it("does not infer a type from arbitrary content", () => {
    expect(detectDocumentMimeType(Uint8Array.from([1, 2, 3, 4]))).toBeNull();
  });

  it("removes paths, control characters, and unsafe filename characters", () => {
    expect(sanitizeOriginalName("../folder\\hasil\u0000<baru>.pdf")).toBe("hasil_baru_.pdf");
  });
});
