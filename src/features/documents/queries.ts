import "server-only";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export type ListedDocument = {
  id: string;
  title: string;
  category: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  note: string | null;
  uploaderId: string;
  uploaderName: string;
  createdAt: string;
};

type DocumentReader = {
  document: {
    findMany(args: object): Promise<Array<{
      id: string;
      title: string;
      category: string;
      originalName: string;
      mimeType: string;
      sizeBytes: number | bigint;
      note: string | null;
      uploaderId: string;
      createdAt: Date;
      uploader: { name: string };
    }>>;
  };
};

export async function listDocuments(circleId: string): Promise<ListedDocument[]> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHENTICATED");

  const membership = await prisma.circleMember.findFirst({
    where: { circleId, userId: session.user.id },
    select: { id: true },
  });
  if (!membership) throw new Error("FORBIDDEN");

  const documentReader = prisma as unknown as DocumentReader;
  const documents = await documentReader.document.findMany({
    where: { circleId },
    include: { uploader: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return documents.map((document) => ({
    id: document.id,
    title: document.title,
    category: document.category,
    originalName: document.originalName,
    mimeType: document.mimeType,
    sizeBytes: Number(document.sizeBytes),
    note: document.note,
    uploaderId: document.uploaderId,
    uploaderName: document.uploader.name || "Anggota keluarga",
    createdAt: document.createdAt.toISOString(),
  }));
}
