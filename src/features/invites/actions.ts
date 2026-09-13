"use server";

import { createHash, randomInt } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import type { ActionResult } from "@/types/domain";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 8;
const INVITE_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;
const databaseIdSchema = z.union([z.uuid(), z.cuid()]);
const createInviteSchema = z.object({ circleId: databaseIdSchema });
const revokeInviteSchema = z.object({ inviteId: databaseIdSchema, circleId: databaseIdSchema });
const joinSchema = z.object({
  code: z.string().trim().transform((value) => value.replace(/[\s-]/g, "").toUpperCase()).pipe(z.string().regex(/^[A-HJ-NP-Z2-9]{8}$/)),
});

export type CreatedInvite = {
  inviteId: string;
  code: string;
  expiresAt: string;
};

function generateCode() {
  return Array.from({ length: CODE_LENGTH }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join("");
}

function hashCode(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

function formatCode(code: string) {
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}

export async function createInvite(
  _previous: ActionResult<CreatedInvite>,
  formData: FormData,
): Promise<ActionResult<CreatedInvite>> {
  const parsed = createInviteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, code: "VALIDATION_ERROR", message: "Permintaan undangan tidak valid." };

  const session = await getSession();
  if (!session) return { ok: false, code: "UNAUTHENTICATED", message: "Sesi Anda berakhir. Silakan masuk kembali." };

  const membership = await prisma.circleMember.findFirst({
    where: { circleId: parsed.data.circleId, userId: session.user.id },
    select: { role: true },
  });
  if (!membership || !["OWNER", "COORDINATOR"].includes(membership.role)) {
    return { ok: false, code: "FORBIDDEN", message: "Hanya owner atau koordinator yang dapat membuat undangan." };
  }

  const expiresAt = new Date(Date.now() + INVITE_LIFETIME_MS);
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = generateCode();
    try {
      const invite = await prisma.circleInvite.create({
        data: {
          circleId: parsed.data.circleId,
          codeHash: hashCode(code),
          createdById: session.user.id,
          expiresAt,
        },
        select: { id: true, expiresAt: true },
      });
      revalidatePath("/members");
      return { ok: true, data: { inviteId: invite.id, code: formatCode(code), expiresAt: invite.expiresAt.toISOString() } };
    } catch (error) {
      const duplicateCode = typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
      if (!duplicateCode) break;
    }
  }
  return { ok: false, code: "CREATE_FAILED", message: "Undangan belum dapat dibuat. Coba lagi." };
}

export async function revokeInvite(formData: FormData) {
  const parsed = revokeInviteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/members?error=Permintaan tidak valid.");

  const session = await getSession();
  if (!session) redirect("/sign-in?next=/members");

  const membership = await prisma.circleMember.findFirst({
    where: { circleId: parsed.data.circleId, userId: session.user.id },
    select: { role: true },
  });
  if (!membership || !["OWNER", "COORDINATOR"].includes(membership.role)) {
    redirect("/members?error=Anda tidak memiliki izin untuk mencabut undangan.");
  }

  await prisma.circleInvite.updateMany({
    where: { id: parsed.data.inviteId, circleId: parsed.data.circleId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  revalidatePath("/members");
  redirect("/members?success=Undangan telah dicabut.");
}

export async function joinCircle(
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = joinSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, code: "INVALID_INVITE", message: "Kode undangan tidak valid atau tidak tersedia." };

  const session = await getSession();
  if (!session) return { ok: false, code: "UNAUTHENTICATED", message: "Silakan masuk untuk bergabung." };

  try {
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const existingMembership = await tx.circleMember.findFirst({
        where: { userId: session.user.id },
        select: { circleId: true },
      });
      if (existingMembership) return "ALREADY_MEMBER" as const;

      const now = new Date();
      const invite = await tx.circleInvite.findUnique({
        where: { codeHash: hashCode(parsed.data.code) },
        select: { id: true, circleId: true },
      });
      if (!invite) return "INVALID_INVITE" as const;

      const claimed = await tx.circleInvite.updateMany({
        where: {
          id: invite.id,
          revokedAt: null,
          expiresAt: { gt: now },
          useCount: { lt: tx.circleInvite.fields.maxUses },
        },
        data: { useCount: { increment: 1 } },
      });
      if (claimed.count !== 1) return "INVALID_INVITE" as const;

      await tx.circleMember.create({
        data: { circleId: invite.circleId, userId: session.user.id, role: "MEMBER" },
      });
      await tx.activityEvent.create({
        data: { circleId: invite.circleId, actorId: session.user.id, type: "MEMBER_JOINED" },
      });
      return "JOINED" as const;
    }, { isolationLevel: "Serializable" });

    if (result === "ALREADY_MEMBER") {
      return { ok: false, code: result, message: "Akun Anda sudah menjadi anggota Care Circle. Saat ini satu akun hanya dapat bergabung ke satu circle." };
    }
    if (result === "INVALID_INVITE") {
      return { ok: false, code: result, message: "Kode undangan tidak valid atau tidak tersedia." };
    }
  } catch {
    return { ok: false, code: "JOIN_FAILED", message: "Belum dapat bergabung dengan kode tersebut. Coba lagi." };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?joined=1");
}
