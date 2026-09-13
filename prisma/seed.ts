import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_USER_EMAIL?.trim().toLowerCase();

  if (!email) {
    console.log(
      "Seed dilewati. Daftarkan akun melalui aplikasi, lalu jalankan dengan SEED_USER_EMAIL=email-yang-sudah-terdaftar.",
    );
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("SEED_USER_EMAIL tidak cocok dengan user yang sudah mendaftar melalui aplikasi.");
  }

  const existingMembership = await prisma.circleMember.findFirst({
    where: { userId: user.id },
    select: { circleId: true },
  });
  if (existingMembership) {
    console.log(`Seed dilewati: user sudah menjadi anggota circle ${existingMembership.circleId}.`);
    return;
  }

  const circle = await prisma.careCircle.create({
    data: {
      name: "Keluarga Angkasa",
      createdById: user.id,
      members: {
        create: { userId: user.id, role: "OWNER" },
      },
      tasks: {
        create: {
          title: "Susun jadwal koordinasi keluarga",
          description: "Data fiktif untuk memeriksa instalasi; aman untuk dihapus.",
          priority: "NORMAL",
          createdById: user.id,
          assigneeId: user.id,
        },
      },
    },
  });

  await prisma.activityEvent.create({
    data: {
      circleId: circle.id,
      actorId: user.id,
      type: "circle.seeded",
      metadata: { fictional: true },
    },
  });

  console.log(`Data fiktif dibuat untuk circle ${circle.id}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
