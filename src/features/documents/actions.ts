"use server";

import { randomUUID } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { deletePrivateObject, putPrivateObject } from "@/lib/storage/minio";
import type { ActionResult } from "@/types/domain";
import {
  detectDocumentMimeType,
  documentIdSchema,
  documentMetadataSchema,
  MAX_DOCUMENT_BYTES,
  sanitizeOriginalName,
} from "./schemas";

type CreatedDocument = { id: string };
type StoredDocument = { id: string; circleId: string; objectKey: string; uploaderId: string };

type DocumentTransaction = {
  document: {
    create(args: object): Promise<CreatedDocument>;
    findFirst(args: object): Promise<StoredDocument | null>;
    delete(args: object): Promise<void>;
  };
  activityEvent: { create(args: object): Promise<unknown> };
};

const allowedUploaderRoles = new Set(["OWNER", "COORDINATOR", "MEMBER"]);

export async function uploadDocument(_previous: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = documentMetadataSchema.safeParse({
    circleId: formData.get("circleId"),
    title: formData.get("title"),
    category: formData.get("category"),
    note: formData.get("note") || undefined,
    consent: formData.get("consent"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Periksa kembali data dokumen dan persetujuan Anda.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const fileValue = formData.get("file");
  if (!(fileValue instanceof File) || fileValue.size === 0) {
    return { ok: false, code: "FILE_REQUIRED", message: "Pilih file dokumen yang akan disimpan." };
  }
  if (fileValue.size > MAX_DOCUMENT_BYTES) {
    return { ok: false, code: "FILE_TOO_LARGE", message: "Ukuran file maksimal 10 MB." };
  }

  const bytes = new Uint8Array(await fileValue.arrayBuffer());
  const detectedMimeType = detectDocumentMimeType(bytes.subarray(0, 16));
  if (!detectedMimeType || detectedMimeType !== fileValue.type.toLowerCase()) {
    return { ok: false, code: "INVALID_FILE_TYPE", message: "File harus berupa PDF, JPEG, PNG, atau WebP yang valid." };
  }

  const session = await getSession();
  if (!session) return { ok: false, code: "UNAUTHENTICATED", message: "Sesi Anda berakhir. Silakan masuk kembali." };

  const membership = await prisma.circleMember.findFirst({
    where: { circleId: parsed.data.circleId, userId: session.user.id },
    select: { role: true },
  });
  if (!membership || !allowedUploaderRoles.has(membership.role)) {
    return { ok: false, code: "FORBIDDEN", message: "Anda tidak memiliki akses untuk mengunggah dokumen ke Care Circle ini." };
  }

  const objectKey = `${parsed.data.circleId}/${randomUUID()}`;
  try {
    await putPrivateObject({ objectKey, body: bytes, contentType: detectedMimeType });
  } catch {
    return { ok: false, code: "STORAGE_FAILED", message: "File belum dapat disimpan. Periksa layanan penyimpanan lalu coba lagi." };
  }

  try {
    await prisma.$transaction(async (transaction: Prisma.TransactionClient) => {
      const tx = transaction as unknown as DocumentTransaction;
      const document = await tx.document.create({
        data: {
          circleId: parsed.data.circleId,
          title: parsed.data.title,
          category: parsed.data.category,
          originalName: sanitizeOriginalName(fileValue.name),
          objectKey,
          mimeType: detectedMimeType,
          sizeBytes: fileValue.size,
          note: parsed.data.note || null,
          uploaderId: session.user.id,
        },
        select: { id: true },
      });
      await tx.activityEvent.create({
        data: {
          circleId: parsed.data.circleId,
          actorId: session.user.id,
          documentId: document.id,
          type: "DOCUMENT_UPLOADED",
        },
      });
    });
  } catch {
    try {
      await deletePrivateObject(objectKey);
    } catch (cleanupError) {
      console.error("Gagal membersihkan object setelah transaksi upload gagal.", cleanupError);
    }
    return { ok: false, code: "DATABASE_FAILED", message: "Metadata dokumen belum dapat disimpan. File unggahan dibatalkan." };
  }

  revalidatePath("/documents");
  revalidatePath("/dashboard");
  return { ok: true, data: undefined };
}

export async function deleteDocument(_previous: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsedId = documentIdSchema.safeParse(formData.get("documentId"));
  if (!parsedId.success) return { ok: false, code: "VALIDATION_ERROR", message: "Dokumen tidak valid." };

  const session = await getSession();
  if (!session) return { ok: false, code: "UNAUTHENTICATED", message: "Sesi Anda berakhir. Silakan masuk kembali." };

  let deletedObjectKey: string | undefined;
  try {
    const result = await prisma.$transaction(async (transaction: Prisma.TransactionClient) => {
      const tx = transaction as unknown as DocumentTransaction;
      const document = await tx.document.findFirst({
        where: { id: parsedId.data },
        select: { id: true, circleId: true, objectKey: true, uploaderId: true },
      });
      if (!document) return "NOT_FOUND" as const;

      const membership = await transaction.circleMember.findFirst({
        where: { circleId: document.circleId, userId: session.user.id },
        select: { role: true },
      });
      if (!membership) return "FORBIDDEN" as const;
      const canDelete = document.uploaderId === session.user.id
        || membership.role === "OWNER"
        || membership.role === "COORDINATOR";
      if (!canDelete) return "FORBIDDEN" as const;

      await tx.activityEvent.create({
        data: {
          circleId: document.circleId,
          actorId: session.user.id,
          documentId: document.id,
          type: "DOCUMENT_DELETED",
        },
      });
      await tx.document.delete({ where: { id: document.id } });
      deletedObjectKey = document.objectKey;
      return "DELETED" as const;
    });

    if (result === "NOT_FOUND") return { ok: false, code: result, message: "Dokumen tidak ditemukan atau sudah dihapus." };
    if (result === "FORBIDDEN") return { ok: false, code: result, message: "Hanya pengunggah, owner, atau koordinator yang dapat menghapus dokumen ini." };
  } catch {
    return { ok: false, code: "DELETE_FAILED", message: "Dokumen belum dapat dihapus. Coba lagi." };
  }

  if (deletedObjectKey) {
    try {
      await deletePrivateObject(deletedObjectKey);
    } catch (storageError) {
      console.error("Metadata dokumen telah dihapus, tetapi pembersihan object gagal.", storageError);
    }
  }

  revalidatePath("/documents");
  revalidatePath("/dashboard");
  return { ok: true, data: undefined };
}
