"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import type { ActionResult } from "@/types/domain";
import { contactMutationSchema, contactSchema } from "./schemas";

async function getMembership(circleId: string, userId: string) {
  return prisma.circleMember.findUnique({
    where: { circleId_userId: { circleId, userId } },
    select: { role: true },
  });
}

export async function createContact(_previous: ActionResult, formData: FormData): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Periksa kembali data kontak.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const session = await getSession();
  if (!session || !await getMembership(parsed.data.circleId, session.user.id)) {
    return { ok: false, code: "FORBIDDEN", message: "Anda tidak memiliki akses ke Care Circle ini." };
  }

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const contact = await tx.careContact.create({
        data: {
          circleId: parsed.data.circleId,
          name: parsed.data.name,
          role: parsed.data.role,
          phoneNumber: parsed.data.phoneNumber,
          whatsapp: parsed.data.whatsapp || null,
          address: parsed.data.address || null,
          note: parsed.data.note || null,
          createdById: session.user.id,
        },
      });
      await tx.activityEvent.create({
        data: {
          circleId: parsed.data.circleId,
          actorId: session.user.id,
          type: "CONTACT_ADDED",
          metadata: { contactId: contact.id, contactName: contact.name },
        },
      });
    });
  } catch {
    return { ok: false, code: "CREATE_FAILED", message: "Kontak belum dapat disimpan." };
  }

  revalidatePath("/contacts");
  revalidatePath("/dashboard");
  return { ok: true, data: undefined };
}

export async function deleteContact(formData: FormData) {
  const parsed = contactMutationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const session = await getSession();
  if (!session) return;

  const member = await getMembership(parsed.data.circleId, session.user.id);
  const contact = await prisma.careContact.findFirst({
    where: { id: parsed.data.contactId, circleId: parsed.data.circleId },
    select: { createdById: true },
  });

  if (!member || !contact) return;
  if (contact.createdById !== session.user.id && member.role === "MEMBER") return;

  await prisma.careContact.delete({ where: { id: parsed.data.contactId } });
  revalidatePath("/contacts");
  revalidatePath("/dashboard");
}
