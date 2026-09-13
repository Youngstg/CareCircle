import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import type { Member } from "@/types/domain";

export type CircleContext = {
  userId: string;
  displayName: string;
  circleId: string;
  circleName: string;
  role: "OWNER" | "COORDINATOR" | "MEMBER";
  members: Member[];
};

export async function getCircleContext(): Promise<CircleContext> {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const membership = await prisma.circleMember.findFirst({
    where: { userId: session.user.id },
    orderBy: { joinedAt: "asc" },
    include: {
      circle: {
        include: {
          members: {
            include: { user: { select: { id: true, name: true } } },
            orderBy: { joinedAt: "asc" },
          },
        },
      },
    },
  });
  if (!membership) redirect("/onboarding");

  return {
    userId: session.user.id,
    displayName: session.user.name || "Keluarga",
    circleId: membership.circleId,
    circleName: membership.circle.name,
    role: membership.role,
    members: membership.circle.members.map((member: {
      userId: string;
      role: string;
      user: { name: string };
    }) => ({
      id: member.userId,
      displayName: member.user.name || "Anggota keluarga",
      role: member.role === "OWNER" ? "owner" : member.role === "COORDINATOR" ? "coordinator" : "member",
    })),
  };
}
