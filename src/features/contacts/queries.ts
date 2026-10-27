import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export type CareContactItem = {
  id: string;
  circleId: string;
  name: string;
  role: string;
  phoneNumber: string;
  whatsapp: string | null;
  address: string | null;
  note: string | null;
  createdById: string;
  createdAt: string;
  creatorName: string;
};

export async function listContacts(circleId: string): Promise<CareContactItem[]> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHENTICATED");

  const membership = await prisma.circleMember.findUnique({
    where: { circleId_userId: { circleId, userId: session.user.id } },
    select: { id: true },
  });
  if (!membership) throw new Error("FORBIDDEN");

  const contacts = await prisma.careContact.findMany({
    where: { circleId },
    include: {
      createdBy: { select: { name: true } },
    },
    orderBy: [
      { role: "asc" },
      { name: "asc" },
    ],
  });

  return contacts.map((c: {
    id: string;
    circleId: string;
    name: string;
    role: string;
    phoneNumber: string;
    whatsapp: string | null;
    address: string | null;
    note: string | null;
    createdById: string;
    createdAt: Date;
    createdBy: { name: string };
  }) => ({
    id: c.id,
    circleId: c.circleId,
    name: c.name,
    role: c.role,
    phoneNumber: c.phoneNumber,
    whatsapp: c.whatsapp,
    address: c.address,
    note: c.note,
    createdById: c.createdById,
    createdAt: c.createdAt.toISOString(),
    creatorName: c.createdBy.name,
  }));
}
