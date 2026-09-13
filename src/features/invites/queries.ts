import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export type InviteSummary = {
  id: string;
  createdBy: string;
  expiresAt: string;
  maxUses: number;
  useCount: number;
  revokedAt: string | null;
  status: "Aktif" | "Dicabut" | "Kedaluwarsa" | "Kuota habis";
  unavailable: boolean;
};

export async function listInvites(circleId: string): Promise<InviteSummary[]> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHENTICATED");

  const membership = await prisma.circleMember.findFirst({
    where: { circleId, userId: session.user.id },
    select: { role: true },
  });
  if (!membership || !["OWNER", "COORDINATOR"].includes(membership.role)) return [];

  const invites = await prisma.circleInvite.findMany({
    where: { circleId },
    select: {
      id: true,
      expiresAt: true,
      maxUses: true,
      useCount: true,
      revokedAt: true,
      createdBy: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const queriedAt = new Date();
  return invites.map((invite: {
    id: string;
    expiresAt: Date;
    maxUses: number;
    useCount: number;
    revokedAt: Date | null;
    createdBy: { name: string };
  }) => ({
    id: invite.id,
    createdBy: invite.createdBy.name,
    expiresAt: invite.expiresAt.toISOString(),
    maxUses: invite.maxUses,
    useCount: invite.useCount,
    revokedAt: invite.revokedAt?.toISOString() ?? null,
    status: invite.revokedAt ? "Dicabut" : invite.expiresAt <= queriedAt ? "Kedaluwarsa" : invite.useCount >= invite.maxUses ? "Kuota habis" : "Aktif",
    unavailable: Boolean(invite.revokedAt) || invite.expiresAt <= queriedAt || invite.useCount >= invite.maxUses,
  }));
}
