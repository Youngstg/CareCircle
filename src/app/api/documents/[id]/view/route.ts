import { NextResponse } from "next/server";
import { documentIdSchema } from "@/features/documents/schemas";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { createPrivateDocumentUrl } from "@/lib/storage/minio";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Sesi Anda berakhir. Silakan masuk kembali." }, { status: 401 });

  const parsedId = documentIdSchema.safeParse((await context.params).id);
  if (!parsedId.success) return NextResponse.json({ message: "Dokumen tidak valid." }, { status: 404 });

  const document = await prisma.document.findFirst({
    where: { id: parsedId.data },
    select: { circleId: true, objectKey: true, originalName: true },
  });
  if (!document) return NextResponse.json({ message: "Dokumen tidak ditemukan." }, { status: 404 });

  const membership = await prisma.circleMember.findUnique({
    where: { circleId_userId: { circleId: document.circleId, userId: session.user.id } },
    select: { id: true },
  });
  if (!membership) return NextResponse.json({ message: "Anda tidak memiliki akses ke dokumen ini." }, { status: 403 });

  try {
    const signedUrl = await createPrivateDocumentUrl({ objectKey: document.objectKey, originalName: document.originalName, disposition: "inline" });
    return NextResponse.redirect(signedUrl, 307);
  } catch {
    return NextResponse.json({ message: "Dokumen belum dapat dibuka. Coba lagi." }, { status: 503 });
  }
}
