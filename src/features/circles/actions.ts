"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const circleSchema = z.object({
  circleName: z.string().trim().min(2).max(120),
  displayName: z.string().trim().min(2).max(100),
});

export async function createCircle(formData: FormData) {
  const parsed = circleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/onboarding?error=Lengkapi nama Anda dan nama Care Circle.");

  const session = await getSession();
  if (!session) redirect("/sign-in");

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const existingMembership = await tx.circleMember.findFirst({
        where: { userId: session.user.id },
        select: { id: true },
      });
      if (existingMembership) return "EXISTS" as const;

      await tx.user.update({
        where: { id: session.user.id },
        data: { name: parsed.data.displayName },
      });
      await tx.careCircle.create({
        data: {
          name: parsed.data.circleName,
          createdById: session.user.id,
          members: {
            create: { userId: session.user.id, role: "OWNER" },
          },
        },
      });
      return "CREATED" as const;
    });
  } catch {
    redirect("/onboarding?error=Care Circle belum dapat dibuat. Coba lagi.");
  }
  redirect("/dashboard?welcome=1");
}
